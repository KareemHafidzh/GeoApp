'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Map, { Source, Layer, NavigationControl, Marker } from 'react-map-gl/maplibre';
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import { area } from '@turf/area';
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon';
import { centerOfMass } from '@turf/center-of-mass';
import type { Feature, FeatureCollection, MultiPolygon, Point, Polygon } from 'geojson';

// Hooks & Constants
import { useGeoman } from '@/app/hooks/useGeoman';
import { useMapSearch } from '@/app/hooks/useMapSearch';
import { MAP_STYLE, DEFAULT_VIEW_STATE, RISK_LEVELS, DATA_CREDITS } from '@/app/constants/map';

// Subcomponents
import MapSidebar from './MapSidebar';
import MapLegend from './MapLegend';
import MapCoordinateBar from './MapCoordinateBar';
import MapAreaInfo from './MapAreaInfo';
import MapHoverTooltip from './MapHoverTooltip';
import MapPopup from './MapPopup';
import MapTour from './MapTour';
import MapFeedback from './MapFeedback';
import MapEmergency, { type NearestResult } from './MapEmergency';

// Types
import type { PopupInfo, HoverInfo, DrawnAreaInfo, CursorLngLat } from '@/app/types/map';
import type { Map as MapLibreMap, ExpressionSpecification } from 'maplibre-gl';

const POI_TYPES: Record<string, string> = {
  'rumah-sakit-points': 'Rumah Sakit',
  'puskesmas-points': 'Puskesmas',
  'school-points': 'Sekolah',
};

// Built from RISK_LEVELS so the legend/filter and fill colors can't drift apart.
const RISK_FILL_COLOR = ['match', ['get', 'Risk_Label'], ...RISK_LEVELS.flatMap(l => [l.label, l.color]), '#cccccc'] as unknown as ExpressionSpecification;

// Register PMTiles protocol
const protocol = new Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

export default function MapDashboard() {
  const mapRef = useRef<MapRef>(null);
  const [mapInstance, setMapInstance] = useState<MapLibreMap | null>(null);
  
  // Performance optimization refs
  const lastMouseMoveTime = useRef<number>(0);
  const lastHoveredGeomanId = useRef<string | null>(null);
  
  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Layer States
  const [showRiskLayer, setShowRiskLayer] = useState(true);
  const [showDesaBorders, setShowDesaBorders] = useState(true);
  const [showDistrictBorders, setShowDistrictBorders] = useState(true);
  const [showRumahSakit, setShowRumahSakit] = useState(true);
  const [showSchool, setShowSchool] = useState(true);
  const [showPuskesmas, setShowPuskesmas] = useState(true);
  const [hiddenRisks, setHiddenRisks] = useState<string[]>([]);
  
  // Data States
  const [schoolData, setSchoolData] = useState<FeatureCollection<Point> | null>(null);
  const [rumahSakitData, setRumahSakitData] = useState<FeatureCollection<Point> | null>(null);
  const [puskesmasData, setPuskesmasData] = useState<FeatureCollection<Point> | null>(null);
  const [nearest, setNearest] = useState<NearestResult | null>(null);
  
  // Interaction States
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [cursorLngLat, setCursorLngLat] = useState<CursorLngLat>({ lng: 0, lat: 0 });
  const [drawnAreaInfo, setDrawnAreaInfo] = useState<DrawnAreaInfo | null>(null);

  // Custom Hooks
  const { activeDrawMode, toggleDrawMode, clearAll, geomanRef } = useGeoman(mapInstance);
  const { searchQuery, setSearchQuery, handleSearch, searching, searchMessage, searchResults, activeResult, selectResult } = useMapSearch(mapRef);

  useEffect(() => {
    fetch('/school.geojson')
      .then(res => res.json())
      .then(data => setSchoolData(data))
      .catch(err => console.error('Failed to load school data:', err));

    fetch('/rumah_sakit.geojson')
      .then(res => res.json())
      .then(data => setRumahSakitData(data))
      .catch(err => console.error('Failed to load rumah sakit data:', err));

    fetch('/puskesmas.geojson')
      .then(res => res.json())
      .then(data => setPuskesmasData(data))
      .catch(err => console.error('Failed to load puskesmas data:', err));
  }, []);

  // Facilities used by the nearest-facility finder (hospitals + puskesmas).
  const facilities = useMemo<FeatureCollection<Point> | null>(() =>
    rumahSakitData && puskesmasData
      ? { type: 'FeatureCollection', features: [...rumahSakitData.features, ...puskesmasData.features] }
      : null,
  [rumahSakitData, puskesmasData]);

  const toggleRisk = useCallback((label: string) =>
    setHiddenRisks(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]), []);

  const handleNearest = (result: NearestResult | null) => {
    setNearest(result);
    // Build via extend(): a raw [from, to] pair with from.lng > to.lng is read as crossing the antimeridian.
    if (result) mapRef.current?.fitBounds(new maplibregl.LngLatBounds(result.from, result.from).extend(result.to), {
      // Left half stays clear of the sidebar + emergency panel.
      padding: { top: 100, bottom: 100, right: 80, left: window.innerWidth / 2 },
      maxZoom: 15,
    });
  };

  const onMapLoad = (e: { target: MapLibreMap }) => {
    setMapInstance(e.target);
  };

  // Drawn shape under a point, measured on Geoman's own geometry. (queryRenderedFeatures returns
  // tile-clipped, simplified pieces, which under-reported the area by ~4–5% and varied with tiling.)
  const drawnShapeAt = ({ lng, lat }: { lng: number; lat: number }) => {
    const shape = geomanRef.current?.features.exportGeoJson().features.find((f) =>
      (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon') &&
      booleanPointInPolygon([lng, lat], f as Feature<Polygon | MultiPolygon>));
    if (!shape) return null;
    const m2 = area(shape);
    const [longitude, latitude] = centerOfMass(shape).geometry.coordinates;
    return {
      key: String(shape.id ?? JSON.stringify(shape.geometry)),
      info: { longitude, latitude, areaKm: (m2 / 1e6).toFixed(3), areaM: m2.toLocaleString(undefined, { maximumFractionDigits: 2 }) },
    };
  };

  const onClick = (event: MapLayerMouseEvent) => {
    // While a draw tool is active, clicks/taps place vertices; don't open the kelurahan card over the drawing.
    if (activeDrawMode) return;
    // Tapping a drawn shape shows its area (touch screens have no hover) instead of the kelurahan card underneath.
    const shape = drawnShapeAt(event.lngLat);
    if (shape) {
      lastHoveredGeomanId.current = shape.key;
      setDrawnAreaInfo(shape.info);
      setPopupInfo(null);
      return;
    }

    const features = event.features;
    if (!features || features.length === 0) {
      setPopupInfo(null);
      return;
    }

    const feature = features[0]; 
    if (feature.layer.id !== 'risk-fills') return;
    const props = feature.properties;
    
    setPopupInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      village: props.NAMOBJ || 'Unknown',       
      district: props.WADMKC || 'Unknown',      
      city: props.WADMKK || 'Unknown',          
      totalRS: (props['RS Umum'] || 0) + (props['RS Khusus'] || 0),
      totalSmp: props['Total Sekolah SMP'] || 0,
      totalSma: props['Total Sekolah SMA/K'] || 0,
      totalPenduduk: props['Total Penduduk'] || 0,
      lajuPertumbuhan: props['Laju Pertumbuhan'] || 0,
      luasWilayahKm: props['Luas Area (km²)'] || 0,
      riskLabel: props['Risk_Label'] || 'N/A',
      banjir2021: props['Banjir_2021'] || 0,
      banjir2024: props['Banjir_2024'] || 0,
      banjir2025: props['Banjir_2025'] || 0,
      gempa2021: props['Gempa_2021'] || 0,
      gempa2024: props['Gempa_2024'] || 0,
      gempa2025: props['Gempa_2025'] || 0,
      longsor2021: props['Longsor_2021'] || 0,
      longsor2024: props['Longsor_2024'] || 0,
      longsor2025: props['Longsor_2025'] || 0,
      totalBencana: props['Total Bencana (All Years)'] || 0
    });
  };

  const onMouseMove = (event: MapLayerMouseEvent) => {
    const now = performance.now();
    if (now - lastMouseMoveTime.current < 40) return; // Throttle to ~25 FPS
    lastMouseMoveTime.current = now;

    setCursorLngLat({ lng: event.lngLat.lng, lat: event.lngLat.lat });
    
    // Only update when the shape under the pointer changes, so a closed card stays closed while moving inside it.
    const shape = drawnShapeAt(event.lngLat);
    if ((shape?.key ?? null) !== lastHoveredGeomanId.current) {
      lastHoveredGeomanId.current = shape?.key ?? null;
      setDrawnAreaInfo(shape?.info ?? null);
    }

    const features = event.features;
    if (features && features.length > 0) {
      const feature = features[0];
      if (feature.layer.id in POI_TYPES) {
        setHoverInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          name: feature.properties.nama_rs || feature.properties.name || 'Unknown',
          address: feature.properties['addr:full'] || feature.properties.address || feature.properties.kecamatan || '',
          type: POI_TYPES[feature.layer.id]
        });
        return;
      }
    }
    setHoverInfo(null);
  };

  const onMouseLeave = () => {
    setHoverInfo(null);
  };

  return (
    <div className="relative w-full h-screen bg-slate-50 overflow-hidden">

      {/* Floating menu button — opens sidebar drawer on mobile/tablet */}
      <button
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
        className={`lg:hidden absolute top-4 left-4 z-20 flex items-center justify-center w-11 h-11 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg text-slate-800 transition-opacity ${sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Backdrop — closes drawer when tapped (mobile/tablet only) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute inset-0 z-20 bg-slate-900/30 backdrop-blur-[2px]"
        />
      )}

      <MapSidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        searching={searching}
        searchMessage={searchMessage}
        searchResults={searchResults}
        activeResult={activeResult}
        selectResult={selectResult}
        showRiskLayer={showRiskLayer}
        setShowRiskLayer={setShowRiskLayer}
        showDesaBorders={showDesaBorders}
        setShowDesaBorders={setShowDesaBorders}
        showDistrictBorders={showDistrictBorders}
        setShowDistrictBorders={setShowDistrictBorders}
        showRumahSakit={showRumahSakit}
        setShowRumahSakit={setShowRumahSakit}
        showSchool={showSchool}
        setShowSchool={setShowSchool}
        showPuskesmas={showPuskesmas}
        setShowPuskesmas={setShowPuskesmas}
        activeDrawMode={activeDrawMode}
        toggleDrawMode={toggleDrawMode}
        clearAll={clearAll}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <MapLegend hiddenRisks={hiddenRisks} toggleRisk={toggleRisk} />

      <MapTour setSidebarOpen={setSidebarOpen} mapInstance={mapInstance} sidebarOpen={sidebarOpen} />

      <MapFeedback sidebarOpen={sidebarOpen} />

      <MapEmergency facilities={facilities} nearest={nearest} onNearest={handleNearest} sidebarOpen={sidebarOpen} />

      <Map
        ref={mapRef} 
        initialViewState={DEFAULT_VIEW_STATE} 
        style={{ width: '100%', height: '100%' }} 
        mapStyle={MAP_STYLE} 
        onClick={onClick} 
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onLoad={onMapLoad}
        hash // syncs #zoom/lat/lng into the URL so shared links open the same view
        attributionControl={{ compact: true, customAttribution: DATA_CREDITS }}
        interactiveLayerIds={['risk-fills', ...Object.keys(POI_TYPES)]} 
        cursor={hoverInfo ? 'pointer' : (popupInfo ? 'auto' : 'crosshair')}
      >
        <NavigationControl position="bottom-right" />

        <MapAreaInfo drawnAreaInfo={drawnAreaInfo} onClose={() => setDrawnAreaInfo(null)} />
        <MapCoordinateBar cursorLngLat={cursorLngLat} />
        <MapHoverTooltip hoverInfo={hoverInfo} />
        <MapPopup popupInfo={popupInfo} onClose={() => setPopupInfo(null)} />

        <Source id="spatial_risk" type="vector" url={`pmtiles:///spatial_risk.pmtiles`}>
          <Layer id="risk-fills" type="fill" source-layer="spatial_risk"
            layout={{ visibility: showRiskLayer ? 'visible' : 'none' }}
            filter={['!', ['in', ['get', 'Risk_Label'], ['literal', hiddenRisks]]]}
            paint={{
              'fill-color': RISK_FILL_COLOR,
              'fill-opacity': 0.65 
            }}/>
          <Layer id="desa-borders" type="line" source-layer="spatial_risk"
            layout={{ visibility: showDesaBorders ? 'visible' : 'none' }} 
            paint={{ 
              'line-color': '#1e3a8a', 
              'line-width': 0.8,
              'line-opacity': 0.8
            }}/>
        </Source>

        <Source id="kecamatan_borders" type="vector" url={`pmtiles:///kecamatan_borders.pmtiles`}>
          <Layer id="district-borders" type="line" source-layer="kecamatan_borders"
            layout={{ visibility: showDistrictBorders ? 'visible' : 'none' }} 
            paint={{ 
              'line-color': '#1e293b', 
              'line-width': 2.5,
              'line-opacity': 1
            }}/>
        </Source>

        {rumahSakitData && (
          <Source id="rumah_sakit" type="geojson" data={rumahSakitData}>
            <Layer 
              id="rumah-sakit-glow" 
              type="circle" 
              layout={{ visibility: showRumahSakit ? 'visible' : 'none' }}
              paint={{
                'circle-radius': 14,
                'circle-color': '#ef4444',
                'circle-opacity': 0.25,
                'circle-blur': 0.5
              }}
            />
            <Layer 
              id="rumah-sakit-points" 
              type="circle" 
              layout={{ visibility: showRumahSakit ? 'visible' : 'none' }}
              paint={{
                'circle-radius': 5,
                'circle-color': '#ef4444',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
                'circle-pitch-alignment': 'map'
              }}
            />
          </Source>
        )}

        {puskesmasData && (
          <Source id="puskesmas" type="geojson" data={puskesmasData}>
            <Layer
              id="puskesmas-points"
              type="circle"
              layout={{ visibility: showPuskesmas ? 'visible' : 'none' }}
              paint={{
                'circle-radius': 4.5,
                'circle-color': '#10b981',
                'circle-stroke-width': 1.5,
                'circle-stroke-color': '#ffffff',
                'circle-pitch-alignment': 'map'
              }}
            />
          </Source>
        )}

        {nearest && (
          <>
            <Source id="nearest-line" type="geojson" data={{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [nearest.from, nearest.to] } }}>
              <Layer id="nearest-line" type="line" paint={{ 'line-color': '#0f172a', 'line-width': 3, 'line-dasharray': [2, 1.5] }} />
            </Source>
            <Marker longitude={nearest.from[0]} latitude={nearest.from[1]}>
              <span className="block w-4 h-4 rounded-full bg-blue-600 border-[3px] border-white shadow-lg" />
            </Marker>
          </>
        )}

        {schoolData && (
          <Source id="school" type="geojson" data={schoolData}>
            <Layer 
              id="school-glow" 
              type="circle" 
              layout={{ visibility: showSchool ? 'visible' : 'none' }}
              paint={{
                'circle-radius': 12,
                'circle-color': '#3b82f6',
                'circle-opacity': 0.25,
                'circle-blur': 0.5
              }}
            />
            <Layer 
              id="school-points" 
              type="circle" 
              layout={{ visibility: showSchool ? 'visible' : 'none' }}
              paint={{
                'circle-radius': 4.5,
                'circle-color': '#3b82f6',
                'circle-stroke-width': 1.5,
                'circle-stroke-color': '#ffffff',
                'circle-pitch-alignment': 'map'
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}
