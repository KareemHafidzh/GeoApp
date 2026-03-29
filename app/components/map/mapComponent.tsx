'use client';

import { useRef, useState } from 'react';
import Map, { Source, Layer, NavigationControl, MapRef, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import GeomanControl from './geomanControl'; 
import Link from 'next/link';

export default function MapComponent() {
  const mapRef = useRef<MapRef>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const mapStyle = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
  
  // Layer States
  const [showRiskLayer, setShowRiskLayer] = useState(true);
  const [showDesaBorders, setShowDesaBorders] = useState(true);
  const [showDistrictBorders, setShowDistrictBorders] = useState(true);
  const [popupInfo, setPopupInfo] = useState<any>(null);

  const onMapLoad = (e: any) => {
    setMapInstance(e.target);
  };

  const onClick = (event: any) => {
    const features = event.features;
    
    // --- THIS IS THE FIX ---
    // If no features are clicked (empty space), close the popup and stop.
    if (!features || features.length === 0) {
      setPopupInfo(null);
      return;
    }

    const feature = features[0]; 
    const props = feature.properties;
    
    setPopupInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      village: props.NAMOBJ || 'Unknown',       
      district: props.WADMKC || 'Unknown',      
      city: props.WADMKK || 'Unknown',          
      
      // ML & Demographic Properties
      totalRS: (props['RS Umum'] || 0) + (props['RS Khusus'] || 0),
      totalSmp: props['Total Sekolah SMP'] || 0,
      totalSma: props['Total Sekolah SMA/K'] || 0,
      totalPenduduk: props['Total Penduduk'] || 0,
      lajuPertumbuhan: props['Laju Pertumbuhan'] || 0,
      luasWilayahKm: props['Luas Area (km²)'] || 0,
      riskLabel: props['Risk_Label'] || 'N/A'
    });
  };

  // Helper function to dynamically color the risk badge
  const getRiskColor = (label: string) => {
    switch(label) {
      case 'Very High Risk': return 'bg-red-50 text-red-700 border-red-200';
      case 'High Risk': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium Risk': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Low Risk': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-50">
      
      {/* --- COMBINED RIGHT PANEL (Button + Layers Card) --- */}
      <div className="absolute top-6 right-14 z-10 flex flex-col items-end gap-4">
        
        {/* Sleek Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2.5 px-6 py-3 bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 text-[13px] font-bold rounded-xl shadow-sm transition-all duration-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-md"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </Link>

        {/* Unified Control Panel */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-5 rounded-2xl shadow-lg w-[260px]">
          <div className="text-[10px] uppercase tracking-[0.15em] text-[#0aab8a] font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'DM Mono, monospace' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#0aab8a] animate-blink" />
            Map Layers
          </div>
          
          <div className="flex flex-col gap-3">
            {/* Risk Toggle */}
            <label className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>Risk Clusters</span>
              <input type="checkbox" className="w-4 h-4 accent-[#0aab8a] cursor-pointer" checked={showRiskLayer} onChange={(e) => setShowRiskLayer(e.target.checked)}/>
            </label>
            
            {/* Kecamatan Borders Toggle */}
            <label className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>Kecamatan Borders</span>
              <input type="checkbox" className="w-4 h-4 accent-slate-800 cursor-pointer" checked={showDistrictBorders} onChange={(e) => setShowDistrictBorders(e.target.checked)}/>
            </label>
            
            {/* Kelurahan Borders Toggle */}
            <label className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>Kelurahan Borders</span>
              <input type="checkbox" className="w-4 h-4 accent-slate-400 cursor-pointer" checked={showDesaBorders} onChange={(e) => setShowDesaBorders(e.target.checked)}/>
            </label>
          </div>
        </div>
      </div>

      <Map 
        ref={mapRef} 
        initialViewState={{ longitude: 106.9896, latitude: -6.2335, zoom: 11}} 
        style={{ width: '100%', height: '100%' }} 
        mapStyle={mapStyle} 
        onClick={onClick} 
        onLoad={onMapLoad}
        interactiveLayerIds={['risk-fills']} 
        cursor={popupInfo ? 'auto' : 'crosshair'}
      >
        <NavigationControl position="bottom-right" />
        <GeomanControl map={mapInstance} />

        {/* --- MODERN DASHBOARD POPUP --- */}
        {popupInfo && (
          <Popup longitude={popupInfo.longitude} latitude={popupInfo.latitude} anchor="bottom" onClose={() => setPopupInfo(null)} closeOnClick={false} maxWidth="340px" className="modern-popup">
            <div className="p-2 min-w-[260px]">
              
              {/* Popup Header */}
              <div className="mb-4">
                <div className="text-[10px] uppercase tracking-widest text-[#0aab8a] font-bold mb-1" style={{ fontFamily: 'DM Mono, monospace' }}>
                  Kec. {popupInfo.district}
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {popupInfo.village}
                </h3>
              </div>
              
              {/* Risk Layer Specific UI */}
              <div className="space-y-3">
                <div className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold tracking-wide ${getRiskColor(popupInfo.riskLabel)}`}>
                  {popupInfo.riskLabel}
                </div>
                
                {/* Data Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-3 border-t border-slate-100">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>Penduduk</div>
                    <div className="text-sm font-bold text-slate-800">{popupInfo.totalPenduduk?.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>Pertumbuhan</div>
                    <div className="text-sm font-bold text-slate-800">{popupInfo.lajuPertumbuhan}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>Total RS</div>
                    <div className="text-sm font-bold text-slate-800">{popupInfo.totalRS}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>Sekolah (SMA/K)</div>
                    <div className="text-sm font-bold text-slate-800">{popupInfo.totalSma}</div>
                  </div>
                  <div className="col-span-2 mt-1">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>Luas Area</div>
                    <div className="text-sm font-bold text-slate-800">{popupInfo.luasWilayahKm} km²</div>
                  </div>
                </div>
              </div>

            </div>
          </Popup>
        )}

        {/* --- THE MASTER DATA SOURCE --- */}
        <Source id="spatial_risk" type="vector" tiles={['http://localhost:8080/data/spatial_risk/{z}/{x}/{y}.pbf']}>
          
          {/* 1. LAYER: RISK FILLS (COLORS) */}
          <Layer id="risk-fills" type="fill" source-layer="spatial_risk"
            layout={{ visibility: showRiskLayer ? 'visible' : 'none' }}
            paint={{
              'fill-color': ['match', ['get', 'Risk_Label'], 'Very High Risk', '#a50026', 'High Risk', '#f46d43', 'Medium Risk', '#fee08b', 'Low Risk', '#1a9850', '#cccccc'],
              'fill-opacity': 0.65 
            }}/>
            
          {/* 2. LAYER: DESA BORDERS (THIN INNER LINES) */}
          <Layer id="desa-borders" type="line" source-layer="spatial_risk"
            layout={{ visibility: showDesaBorders ? 'visible' : 'none' }} 
            paint={{ 
              'line-color': '#1e3a8a', 
              'line-width': 0.8,
              'line-opacity': 0.8
            }}/>

          {/* 3. LAYER: DISTRICT/KECAMATAN BORDERS (THICK OUTER LINES) */}
          <Layer id="district-borders" type="line" source-layer="spatial_risk"
            layout={{ visibility: showDistrictBorders ? 'visible' : 'none' }} 
            paint={{ 
              'line-color': '#1e293b', 
              'line-width': 2.5,
              'line-opacity': 1
            }}/>

        </Source>
      </Map>
    </div>
  );
}