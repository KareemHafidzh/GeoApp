'use client';

import { useRef, useState, useEffect } from 'react';
import Map, { Source, Layer, NavigationControl, MapRef, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import GeomanControl from './geomanControl'; 
import Link from 'next/link';

const rumahSakitData: any = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { nama_rs: "RSUD dr. Chasbullah Abdulmadjid", kecamatan: "Bekasi Selatan" }, geometry: { type: "Point", coordinates: [107.000658, -6.242328] } },
    { type: "Feature", properties: { nama_rs: "RS Hermina Bekasi", kecamatan: "Bekasi Selatan" }, geometry: { type: "Point", coordinates: [106.996111, -6.236111] } },
    { type: "Feature", properties: { nama_rs: "RS Primaya Bekasi Barat", kecamatan: "Bekasi Selatan" }, geometry: { type: "Point", coordinates: [106.985556, -6.245833] } },
    { type: "Feature", properties: { nama_rs: "RS Mitra Keluarga Bekasi", kecamatan: "Bekasi Selatan" }, geometry: { type: "Point", coordinates: [106.992222, -6.237222] } },
    { type: "Feature", properties: { nama_rs: "RS Hermina Galaxy", kecamatan: "Bekasi Selatan" }, geometry: { type: "Point", coordinates: [106.974444, -6.265556] } },
    { type: "Feature", properties: { nama_rs: "RSU Anna", kecamatan: "Bekasi Selatan" }, geometry: { type: "Point", coordinates: [106.985833, -6.264167] } },
    { type: "Feature", properties: { nama_rs: "RS Siloam Bekasi Timur", kecamatan: "Bekasi Timur" }, geometry: { type: "Point", coordinates: [107.016000, -6.262000] } },
    { type: "Feature", properties: { nama_rs: "RS Primaya Bekasi Timur", kecamatan: "Bekasi Timur" }, geometry: { type: "Point", coordinates: [107.020100, -6.265000] } },
    { type: "Feature", properties: { nama_rs: "RS Mitra Keluarga Bekasi Timur", kecamatan: "Bekasi Timur" }, geometry: { type: "Point", coordinates: [107.015278, -6.261111] } },
    { type: "Feature", properties: { nama_rs: "RSU Ananda Bekasi", kecamatan: "Medan Satria" }, geometry: { type: "Point", coordinates: [106.985300, -6.195700] } },
    { type: "Feature", properties: { nama_rs: "RS Seto Hasbadi", kecamatan: "Bekasi Utara" }, geometry: { type: "Point", coordinates: [106.996500, -6.211500] } },
    { type: "Feature", properties: { nama_rs: "RSIA Karunia Kasih", kecamatan: "Pondok Gede" }, geometry: { type: "Point", coordinates: [106.920200, -6.275400] } },
    { type: "Feature", properties: { nama_rs: "RSU Kartika Husada", kecamatan: "Jatiasih" }, geometry: { type: "Point", coordinates: [106.958500, -6.301500] } },
    { type: "Feature", properties: { nama_rs: "RS Mitra Keluarga Jatiasih", kecamatan: "Jatiasih" }, geometry: { type: "Point", coordinates: [106.953800, -6.307200] } },
    { type: "Feature", properties: { nama_rs: "RS Permata Bekasi", kecamatan: "Mustika Jaya" }, geometry: { type: "Point", coordinates: [107.027100, -6.282500] } },
    { type: "Feature", properties: { nama_rs: "RS Mitra Keluarga Cibubur", kecamatan: "Jatisampurna" }, geometry: { type: "Point", coordinates: [106.918600, -6.376400] } },
    { type: "Feature", properties: { nama_rs: "RS Permata Cibubur", kecamatan: "Jatisampurna" }, geometry: { type: "Point", coordinates: [106.922100, -6.376100] } },
    { type: "Feature", properties: { nama_rs: "RS Karya Medika", kecamatan: "Bantar Gebang" }, geometry: { type: "Point", coordinates: [106.985000, -6.308200] } },
    { type: "Feature", properties: { nama_rs: "RSUD Bantargebang", kecamatan: "Bantar Gebang" }, geometry: { type: "Point", coordinates: [106.995100, -6.315400] } },
    { type: "Feature", properties: { nama_rs: "RSUD Bekasi Utara / Teluk Pucung", kecamatan: "Bekasi Utara" }, geometry: { type: "Point", coordinates: [107.018300, -6.211200] } },
    { type: "Feature", properties: { nama_rs: "RSUD Jatisampurna", kecamatan: "Jatisampurna" }, geometry: { type: "Point", coordinates: [106.924200, -6.368500] } },
    { type: "Feature", properties: { nama_rs: "RSUD Pondok Gede", kecamatan: "Pondok Gede" }, geometry: { type: "Point", coordinates: [106.925400, -6.282100] } },
    { type: "Feature", properties: { nama_rs: "RS EMC Pekayon", kecamatan: "Bekasi Selatan" }, geometry: { type: "Point", coordinates: [106.993200, -6.257300] } },
    { type: "Feature", properties: { nama_rs: "RS Primaya Bekasi Utara", kecamatan: "Bekasi Utara" }, geometry: { type: "Point", coordinates: [107.005400, -6.208100] } },
    { type: "Feature", properties: { nama_rs: "RS Siloam Sentosa", kecamatan: "Bekasi Timur" }, geometry: { type: "Point", coordinates: [107.012300, -6.270400] } },
    { type: "Feature", properties: { nama_rs: "RS Siloam Sepanjang Jaya", kecamatan: "Rawalumbu" }, geometry: { type: "Point", coordinates: [106.998400, -6.262500] } },
    { type: "Feature", properties: { nama_rs: "RSU Budi Lestari", kecamatan: "Bekasi Selatan" }, geometry: { type: "Point", coordinates: [106.979500, -6.246100] } },
    { type: "Feature", properties: { nama_rs: "RSU Cikunir", kecamatan: "Bekasi Selatan" }, geometry: { type: "Point", coordinates: [106.968100, -6.258400] } },
    { type: "Feature", properties: { nama_rs: "RSU Citra Harapan", kecamatan: "Medan Satria" }, geometry: { type: "Point", coordinates: [106.985500, -6.183200] } },
    { type: "Feature", properties: { nama_rs: "RSU Dokter Adam Talib Cikunir", kecamatan: "Bekasi Selatan" }, geometry: { type: "Point", coordinates: [106.968800, -6.258900] } },
    { type: "Feature", properties: { nama_rs: "RSU Graha Juanda", kecamatan: "Bekasi Timur" }, geometry: { type: "Point", coordinates: [107.018200, -6.241500] } },
    { type: "Feature", properties: { nama_rs: "RSU Islam dr. Subki", kecamatan: "Bekasi Timur" }, geometry: { type: "Point", coordinates: [107.004100, -6.244300] } },
    { type: "Feature", properties: { nama_rs: "RSU Jati Sampurna", kecamatan: "Jatisampurna" }, geometry: { type: "Point", coordinates: [106.918900, -6.375200] } },
    { type: "Feature", properties: { nama_rs: "RSU Juwita", kecamatan: "Bekasi Timur" }, geometry: { type: "Point", coordinates: [107.013500, -6.239200] } },
    { type: "Feature", properties: { nama_rs: "RSU Masmitra", kecamatan: "Pondok Gede" }, geometry: { type: "Point", coordinates: [106.931200, -6.288400] } },
    { type: "Feature", properties: { nama_rs: "RSU Mekar Sari", kecamatan: "Bekasi Timur" }, geometry: { type: "Point", coordinates: [107.007400, -6.238100] } },
    { type: "Feature", properties: { nama_rs: "RSU Rawa Lumbu", kecamatan: "Rawalumbu" }, geometry: { type: "Point", coordinates: [107.001200, -6.269100] } },
    { type: "Feature", properties: { nama_rs: "RSU Satria Medika", kecamatan: "Mustika Jaya" }, geometry: { type: "Point", coordinates: [107.018400, -6.312500] } },
    { type: "Feature", properties: { nama_rs: "RSU St. Elisabeth", kecamatan: "Rawalumbu" }, geometry: { type: "Point", coordinates: [106.998100, -6.294200] } },
    { type: "Feature", properties: { nama_rs: "RS RSU Bella Bekasi", kecamatan: "Bekasi Timur" }, geometry: { type: "Point", coordinates: [107.014500, -6.241100] } },
    { type: "Feature", properties: { nama_rs: "RS RSU Bhakti Kartini", kecamatan: "Bekasi Timur" }, geometry: { type: "Point", coordinates: [107.011200, -6.247200] } },
    { type: "Feature", properties: { nama_rs: "RS Medik Zainuttaqwa", kecamatan: "Medan Satria" }, geometry: { type: "Point", coordinates: [107.002100, -6.191500] } },
    { type: "Feature", properties: { nama_rs: "RS Mustika Medika Bekasi", kecamatan: "Mustika Jaya" }, geometry: { type: "Point", coordinates: [107.039400, -6.271200] } },
    { type: "Feature", properties: { nama_rs: "RS Persada Medika", kecamatan: "Pondok Melati" }, geometry: { type: "Point", coordinates: [106.928300, -6.295100] } },
    { type: "Feature", properties: { nama_rs: "RS Taman Harapan Baru", kecamatan: "Medan Satria" }, geometry: { type: "Point", coordinates: [106.993100, -6.182400] } },
    { type: "Feature", properties: { nama_rs: "RSIA Rinova Intan", kecamatan: "Bekasi Utara" }, geometry: { type: "Point", coordinates: [107.008200, -6.223500] } },
    { type: "Feature", properties: { nama_rs: "RSIA Selasih Medika", kecamatan: "Bekasi Barat" }, geometry: { type: "Point", coordinates: [106.965100, -6.234200] } },
    { type: "Feature", properties: { nama_rs: "RSIA Taman Harapan Baru", kecamatan: "Medan Satria" }, geometry: { type: "Point", coordinates: [106.993200, -6.182500] } },
    { type: "Feature", properties: { nama_rs: "RSU Anna Medika", kecamatan: "Bekasi Utara" }, geometry: { type: "Point", coordinates: [107.012100, -6.208500] } }
  ]
};

export default function MapComponent() {
  const mapRef = useRef<MapRef>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const mapStyle = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
  
  // Layer States
  const [showRiskLayer, setShowRiskLayer] = useState(true);
  const [showDesaBorders, setShowDesaBorders] = useState(true);
  const [showDistrictBorders, setShowDistrictBorders] = useState(true);
  const [showRumahSakit, setShowRumahSakit] = useState(true);
  const [showSchool, setShowSchool] = useState(true);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [popupInfo, setPopupInfo] = useState<any>(null);

  useEffect(() => {
    fetch('/school.geojson')
      .then(res => res.json())
      .then(data => setSchoolData(data))
      .catch(err => console.error('Failed to load school data:', err));
  }, []);

  const onMapLoad = (e: any) => {
    setMapInstance(e.target);
  };

  const onClick = (event: any) => {
    const features = event.features;
    
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

            {/* Rumah Sakit Toggle */}
            <label className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>Rumah Sakit</span>
              <input type="checkbox" className="w-4 h-4 accent-red-500 cursor-pointer" checked={showRumahSakit} onChange={(e) => setShowRumahSakit(e.target.checked)}/>
            </label>

            {/* Sekolah Toggle */}
            <label className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
              <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>Sekolah</span>
              <input type="checkbox" className="w-4 h-4 accent-blue-500 cursor-pointer" checked={showSchool} onChange={(e) => setShowSchool(e.target.checked)}/>
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

        {/* --- RUMAH SAKIT SOURCE --- */}
        <Source id="rumah_sakit" type="geojson" data={rumahSakitData}>
          <Layer 
            id="rumah-sakit-points" 
            type="circle" 
            layout={{ visibility: showRumahSakit ? 'visible' : 'none' }}
            paint={{
              'circle-radius': 6,
              'circle-color': '#ef4444',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff'
            }}
          />
        </Source>

        {/* --- SCHOOL SOURCE --- */}
        {schoolData && (
          <Source id="school" type="geojson" data={schoolData}>
            <Layer 
              id="school-points" 
              type="circle" 
              layout={{ visibility: showSchool ? 'visible' : 'none' }}
              paint={{
                'circle-radius': 5,
                'circle-color': '#3b82f6',
                'circle-stroke-width': 1.5,
                'circle-stroke-color': '#ffffff'
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}