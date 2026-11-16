'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Map, { NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import type { FeatureCollection, Point } from 'geojson';

import { useGeoman } from '@/features/map/hooks/useGeoman';
import { useMapSearch } from '@/features/map/hooks/useMapSearch';
import { useGeoJson } from '@/features/map/hooks/useGeoJson';
import { MAP_STYLE, DEFAULT_VIEW_STATE, DATA_CREDITS } from '@/features/map/constants';
import { toPopupInfo } from '@/features/map/lib/popupInfo';
import { drawnShapeAt } from '@/features/map/lib/drawnShape';
import type { PopupInfo, HoverInfo, DrawnAreaInfo, CursorLngLat, MapTool, LayerKey } from '@/features/map/types';

import MapLayers, { POI_LAYERS } from './layers/MapLayers';
import PitchControl from './layers/PitchControl';
import MapSidebar from './sidebar/MapSidebar';
import MapTour from './tour/MapTour';
import MapLegend from './overlays/MapLegend';
import MapCoordinateBar from './overlays/MapCoordinateBar';
import MapAreaInfo from './overlays/MapAreaInfo';
import MapHoverTooltip from './overlays/MapHoverTooltip';
import MapPopup from './overlays/MapPopup';
import MapEmergency, { type NearestResult } from './overlays/MapEmergency';
import ToolHint from './overlays/ToolHint';

// Daftarkan protokol pmtiles:// sekali saat modul dimuat, agar MapLibre bisa membaca file .pmtiles.
const protocol = new Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

const ALL_LAYERS_ON: Record<LayerKey, boolean> = { risk: true, kecamatan: true, kelurahan: true, rumahSakit: true, puskesmas: true, sekolah: true };

// Halaman peta utama: menyimpan semua state lalu membagikannya ke panel, lapisan, dan kartu di atas peta.
export default function MapDashboard() {
  const mapRef = useRef<MapRef>(null);
  const [mapInstance, setMapInstance] = useState<MapLibreMap | null>(null);
  const lastMouseMoveTime = useRef(0);
  const lastHoveredShapeId = useRef<string | null>(null);

  // State tampilan panel: laci sidebar (HP/tablet), sidebar disembunyikan, dan legenda disembunyikan.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [legendHidden, setLegendHidden] = useState(false);

  // State lapisan peta dan kelas risiko yang disaring dari legenda.
  const [visible, setVisible] = useState(ALL_LAYERS_ON);
  const [hiddenRisks, setHiddenRisks] = useState<string[]>([]);

  // State interaksi: kartu detail wilayah, tooltip titik, koordinat kursor, dan kartu luas gambar.
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [cursorLngLat, setCursorLngLat] = useState<CursorLngLat>({ lng: 0, lat: 0 });
  const [drawnAreaInfo, setDrawnAreaInfo] = useState<DrawnAreaInfo | null>(null);
  const [nearest, setNearest] = useState<NearestResult | null>(null);

  const { activeDrawMode, toggleDrawMode, clearAll, geomanRef } = useGeoman(mapInstance);
  const search = useMapSearch(mapRef);
  const rumahSakit = useGeoJson('/rumah_sakit.geojson');
  const puskesmas = useGeoJson('/puskesmas.geojson');
  const sekolah = useGeoJson('/school.geojson');

  // Fasilitas untuk pencari faskes terdekat: gabungan rumah sakit dan puskesmas.
  const facilities = useMemo<FeatureCollection<Point> | null>(() =>
    rumahSakit && puskesmas ? { type: 'FeatureCollection', features: [...rumahSakit.features, ...puskesmas.features] } : null,
  [rumahSakit, puskesmas]);

  // Jaga kartu detail wilayah tetap di tengah area peta yang kosong (di kanan sidebar), juga saat isinya membesar.
  useEffect(() => {
    if (!popupInfo) return;
    let observer: ResizeObserver | undefined;
    const frame = requestAnimationFrame(() => {
      const el = document.querySelector('.modern-popup');
      const map = mapRef.current;
      if (!el || !map) return;
      observer = new ResizeObserver(() => {
        const card = el.getBoundingClientRect();
        const box = map.getContainer().getBoundingClientRect();
        const sidebar = document.querySelector('[data-tour="sidebar"]')?.getBoundingClientRect();
        const left = sidebar && sidebar.right > box.left ? sidebar.right : box.left;
        const dx = card.left + card.width / 2 - (left + box.right) / 2;
        const dy = card.top + card.height / 2 - (box.top + box.bottom) / 2;
        map.panBy([dx, dy], { duration: 400 });
      });
      observer.observe(el);
    });
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); };
  }, [popupInfo]);

  const hideSidebar = useCallback(() => { setSidebarOpen(false); setSidebarHidden(true); }, []);
  const showLegend = useCallback(() => setLegendHidden(false), []);
  const toggleLayer = useCallback((key: LayerKey) => setVisible((v) => ({ ...v, [key]: !v[key] })), []);
  const toggleRisk = useCallback((label: string) =>
    setHiddenRisks((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]), []);

  // Panduan membuka sidebar untuk menunjuknya, jadi sidebar yang disembunyikan ikut dimunculkan.
  const setSidebarOpenForTour = useCallback((open: boolean) => {
    setSidebarOpen(open);
    if (open) setSidebarHidden(false);
  }, []);

  // Memilih alat ukur menutup laci di HP dan membuang kartu luas, karena kartu itu menutupi bentuk yang mau diubah.
  const pickTool = useCallback((tool: MapTool) => {
    toggleDrawMode(tool);
    setSidebarOpen(false);
    setDrawnAreaInfo(null);
    lastHoveredShapeId.current = null;
  }, [toggleDrawMode]);

  const handleNearest = (result: NearestResult | null) => {
    setNearest(result);
    // Pakai extend(): pasangan [from, to] mentah dengan from.lng > to.lng dibaca sebagai melintasi garis tanggal.
    if (result) mapRef.current?.fitBounds(new maplibregl.LngLatBounds(result.from, result.from).extend(result.to), {
      padding: { top: 100, bottom: 100, right: 80, left: window.innerWidth / 2 }, // separuh kiri untuk sidebar + panel darurat
      maxZoom: 15,
    });
  };

  // Lapisan area diselipkan di bawah blok label peta dasar, agar label dan titik fasilitas selalu di atasnya.
  const styleLayers = mapInstance?.getStyle()?.layers ?? [];
  const basemapSource = styleLayers.find((l) => 'source' in l)?.source;
  const basemapLayers = styleLayers.filter((l) => 'source' in l && l.source === basemapSource);
  const firstLabelId = basemapLayers[basemapLayers.findLastIndex((l) => l.type !== 'symbol') + 1]?.id;

  const shapeUnder = (lng: number, lat: number) =>
    drawnShapeAt(geomanRef.current?.features.exportGeoJson().features ?? [], lng, lat);

  // Klik peta: tampilkan luas bentuk gambar bila mengenai bentuk, selain itu buka detail kelurahan.
  const onClick = (event: MapLayerMouseEvent) => {
    if (activeDrawMode) return; // saat menggambar, klik dipakai untuk menaruh titik
    const shape = shapeUnder(event.lngLat.lng, event.lngLat.lat);
    if (shape) {
      lastHoveredShapeId.current = shape.key;
      setDrawnAreaInfo(shape.info);
      setPopupInfo(null);
      return;
    }
    const feature = event.features?.[0];
    if (!feature) return setPopupInfo(null);
    if (feature.layer.id !== 'risk-fills') return;
    // Di HP titik yang diketuk digeser ke bawah layar, supaya kartu di atasnya tidak tertutup tombol.
    if (window.innerWidth < 640) mapRef.current?.easeTo({ center: event.lngLat, offset: [0, window.innerHeight * 0.3], duration: 400 });
    setPopupInfo(toPopupInfo(feature.properties, event.lngLat.lng, event.lngLat.lat));
  };

  // Gerak kursor (dibatasi ±25 kali/detik): perbarui koordinat, kartu luas, dan tooltip titik fasilitas.
  const onMouseMove = (event: MapLayerMouseEvent) => {
    const now = performance.now();
    if (now - lastMouseMoveTime.current < 40) return;
    lastMouseMoveTime.current = now;
    setCursorLngLat({ lng: event.lngLat.lng, lat: event.lngLat.lat });

    // Hanya berubah saat bentuk di bawah kursor berganti, agar kartu yang ditutup tidak muncul lagi.
    const shape = activeDrawMode ? null : shapeUnder(event.lngLat.lng, event.lngLat.lat);
    if ((shape?.key ?? null) !== lastHoveredShapeId.current) {
      lastHoveredShapeId.current = shape?.key ?? null;
      setDrawnAreaInfo(shape?.info ?? null);
    }

    const feature = event.features?.[0];
    if (feature && feature.layer.id in POI_LAYERS) {
      setHoverInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        name: feature.properties.nama_rs || feature.properties.name || 'Unknown',
        address: feature.properties['addr:full'] || feature.properties.address || feature.properties.kecamatan || '',
        type: POI_LAYERS[feature.layer.id],
      });
    } else {
      setHoverInfo(null);
    }
  };

  return (
    <div className="relative w-full h-dvh bg-slate-50 overflow-clip">
      {/* Tombol menu mengambang: membuka laci di HP/tablet, atau memunculkan lagi sidebar yang disembunyikan di desktop. */}
      <button
        onClick={() => { setSidebarHidden(false); setSidebarOpen(window.innerWidth < 1024); }}
        aria-label="Buka menu"
        className={`absolute top-4 left-4 z-20 flex items-center justify-center w-11 h-11 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg text-slate-800 transition-opacity ${sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${sidebarHidden ? '' : 'lg:opacity-0 lg:pointer-events-none'}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="lg:hidden absolute inset-0 z-20 bg-slate-900/30 backdrop-blur-[2px]" />
      )}

      <MapSidebar
        search={search}
        visible={visible}
        onToggleLayer={toggleLayer}
        activeTool={activeDrawMode}
        onPickTool={pickTool}
        onClearAll={clearAll}
        isOpen={sidebarOpen}
        hidden={sidebarHidden}
        onHide={hideSidebar}
      />

      {activeDrawMode && <ToolHint tool={activeDrawMode} onDone={() => pickTool(activeDrawMode)} />}

      <MapLegend hiddenRisks={hiddenRisks} toggleRisk={toggleRisk} hidden={legendHidden} setHidden={setLegendHidden} />

      <MapTour setSidebarOpen={setSidebarOpenForTour} mapInstance={mapInstance} sidebarOpen={sidebarOpen} sidebarHidden={sidebarHidden} onShowLegend={showLegend} />

      <MapEmergency facilities={facilities} nearest={nearest} onNearest={handleNearest} sidebarOpen={sidebarOpen} sidebarHidden={sidebarHidden} />

      <Map
        ref={mapRef}
        initialViewState={DEFAULT_VIEW_STATE}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setHoverInfo(null)}
        onLoad={(e) => setMapInstance(e.target)}
        hash // simpan #zoom/lat/lng di URL supaya tautan yang dibagikan membuka tampilan yang sama
        attributionControl={{ compact: true, customAttribution: DATA_CREDITS }}
        interactiveLayerIds={['risk-fills', ...Object.keys(POI_LAYERS)]}
        cursor={hoverInfo ? 'pointer' : (popupInfo ? 'auto' : 'crosshair')}
      >
        <NavigationControl position="bottom-right" visualizePitch />
        <PitchControl />

        <MapAreaInfo drawnAreaInfo={activeDrawMode ? null : drawnAreaInfo} onClose={() => setDrawnAreaInfo(null)} />
        <MapCoordinateBar cursorLngLat={cursorLngLat} />
        <MapHoverTooltip hoverInfo={hoverInfo} />
        <MapPopup popupInfo={popupInfo} onClose={() => setPopupInfo(null)} />

        <MapLayers
          visible={visible}
          hiddenRisks={hiddenRisks}
          beforeId={firstLabelId}
          rumahSakit={rumahSakit}
          puskesmas={puskesmas}
          sekolah={sekolah}
          nearest={nearest}
        />
      </Map>
    </div>
  );
}
