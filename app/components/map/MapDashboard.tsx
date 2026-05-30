'use client';

import { useRef, useState, useEffect } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { area } from '@turf/area';
import type { GeoJSON } from 'geojson';

// Hooks & Constants
import { useGeoman } from '@/app/hooks/useGeoman';
import { useMapSearch } from '@/app/hooks/useMapSearch';
import { TILE_SERVER_URL, MAP_STYLE, DEFAULT_VIEW_STATE } from '@/app/constants/map';

// Subcomponents
import MapSidebar from './MapSidebar';
import MapLegend from './MapLegend';
import MapCoordinateBar from './MapCoordinateBar';
import MapAreaInfo from './MapAreaInfo';
import MapHoverTooltip from './MapHoverTooltip';
import MapPopup from './MapPopup';

// Types
import type { PopupInfo, HoverInfo, DrawnAreaInfo, CursorLngLat } from '@/app/types/map';
import type { Map as MapLibreMap } from 'maplibre-gl';

export default function MapDashboard() {
  const mapRef = useRef<MapRef>(null);
  const [mapInstance, setMapInstance] = useState<MapLibreMap | null>(null);
  
  // Layer States
  const [showRiskLayer, setShowRiskLayer] = useState(true);
  const [showDesaBorders, setShowDesaBorders] = useState(true);
  const [showDistrictBorders, setShowDistrictBorders] = useState(true);
  const [showRumahSakit, setShowRumahSakit] = useState(true);
  const [showSchool, setShowSchool] = useState(true);
  
  // Data States
  const [schoolData, setSchoolData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [rumahSakitData, setRumahSakitData] = useState<GeoJSON.FeatureCollection | null>(null);
  
  // Interaction States
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [cursorLngLat, setCursorLngLat] = useState<CursorLngLat>({ lng: 0, lat: 0 });
  const [drawnAreaInfo, setDrawnAreaInfo] = useState<DrawnAreaInfo | null>(null);

  // Custom Hooks
  const { activeDrawMode, toggleDrawMode, clearAll } = useGeoman(mapInstance);
  const { searchQuery, setSearchQuery, handleSearch } = useMapSearch(mapRef);

  useEffect(() => {
    fetch('/school.geojson')
      .then(res => res.json())
      .then(data => setSchoolData(data))
      .catch(err => console.error('Failed to load school data:', err));

    fetch('/rumah_sakit.geojson')
      .then(res => res.json())
      .then(data => setRumahSakitData(data))
      .catch(err => console.error('Failed to load rumah sakit data:', err));
  }, []);

  const onMapLoad = (e: { target: MapLibreMap }) => {
    setMapInstance(e.target);
  };

  const onClick = (event: MapLayerMouseEvent) => {
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
      banjir2020: props['Banjir_2020'] || 0,
      banjir2021: props['Banjir_2021'] || 0,
      banjir2024: props['Banjir_2024'] || 0,
      gempa2020: props['Gempa_2020'] || 0,
      gempa2021: props['Gempa_2021'] || 0,
      gempa2024: props['Gempa_2024'] || 0,
      longsor2020: props['Longsor_2020'] || 0,
      longsor2021: props['Longsor_2021'] || 0,
      longsor2024: props['Longsor_2024'] || 0,
      totalBencana: props['Total Bencana (All Years)'] || 0
    });
  };

  const onMouseMove = (event: MapLayerMouseEvent) => {
    setCursorLngLat({ lng: event.lngLat.lng, lat: event.lngLat.lat });
    
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const allRendered = map.queryRenderedFeatures(event.point);
      
      const geomanFeature = allRendered.find((f) => {
        const id = f.layer?.id || '';
        const source = (typeof f.source === 'string') ? f.source : '';
        const isGeoman = id.includes('geoman') || id.includes('gm_') || id.includes('gm-') || id.includes('pm-') || source.includes('geoman') || source.includes('gm_') || source.includes('gm-') || source.includes('pm-');
        const isNotMine = !['risk-fills', 'desa-borders', 'district-borders'].includes(id);
        return isGeoman && isNotMine && f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon');
      });

      if (geomanFeature) {
        try {
          const areaSqMeters = area(geomanFeature);
          if (areaSqMeters > 0) {
            const areaSqKm = (areaSqMeters / 1000000).toFixed(3);
            setDrawnAreaInfo({ areaKm: areaSqKm, areaM: areaSqMeters.toLocaleString(undefined, { maximumFractionDigits: 2 }) });
          } else {
            setDrawnAreaInfo(null);
          }
        } catch {
          setDrawnAreaInfo(null);
        }
      } else {
        setDrawnAreaInfo(null);
      }
    }

    const features = event.features;
    if (features && features.length > 0) {
      const feature = features[0];
      if (feature.layer.id === 'rumah-sakit-points' || feature.layer.id === 'school-points') {
        setHoverInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          name: feature.properties.nama_rs || feature.properties.name || 'Unknown',
          address: feature.properties['addr:full'] || feature.properties.address || feature.properties.kecamatan || '',
          type: feature.layer.id === 'rumah-sakit-points' ? 'Rumah Sakit' : 'Sekolah'
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
      
      <MapSidebar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
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
        activeDrawMode={activeDrawMode}
        toggleDrawMode={toggleDrawMode}
        clearAll={clearAll}
      />

      <MapLegend />

      <Map 
        ref={mapRef} 
        initialViewState={DEFAULT_VIEW_STATE} 
        style={{ width: '100%', height: '100%' }} 
        mapStyle={MAP_STYLE} 
        onClick={onClick} 
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onLoad={onMapLoad}
        interactiveLayerIds={['risk-fills', 'rumah-sakit-points', 'school-points']} 
        cursor={hoverInfo ? 'pointer' : (popupInfo ? 'auto' : 'crosshair')}
      >
        <NavigationControl position="bottom-right" />

        <MapAreaInfo drawnAreaInfo={drawnAreaInfo} onClose={() => setDrawnAreaInfo(null)} />
        <MapCoordinateBar cursorLngLat={cursorLngLat} />
        <MapHoverTooltip hoverInfo={hoverInfo} />
        <MapPopup popupInfo={popupInfo} onClose={() => setPopupInfo(null)} />

        <Source id="spatial_risk" type="vector" tiles={[`${TILE_SERVER_URL}/data/spatial_risk/{z}/{x}/{y}.pbf?v=2`]}>
          <Layer id="risk-fills" type="fill" source-layer="spatial_risk"
            layout={{ visibility: showRiskLayer ? 'visible' : 'none' }}
            paint={{
              'fill-color': ['match', ['get', 'Risk_Label'], 'Very High Risk', '#a50026', 'High Risk', '#f46d43', 'Medium Risk', '#fee08b', 'Low Risk', '#1a9850', '#cccccc'],
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

        <Source id="kecamatan_borders" type="vector" tiles={[`${TILE_SERVER_URL}/data/kecamatan_borders/{z}/{x}/{y}.pbf`]}>
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
