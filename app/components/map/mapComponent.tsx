'use client';

import { useRef, useState, useEffect } from 'react';
import Map, { Source, Layer, NavigationControl, MapRef, Popup } from 'react-map-gl/maplibre';
// @ts-ignore
import 'maplibre-gl/dist/maplibre-gl.css';
import { Geoman, type GmOptionsPartial } from '@geoman-io/maplibre-geoman-free';
// @ts-ignore
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css';
import Link from 'next/link';
import * as turf from '@turf/turf';

export default function MapComponent() {
  const mapRef = useRef<MapRef>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const geomanRef = useRef<Geoman | null>(null);
  
  const mapStyle = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
  
  // Layer States
  const [showRiskLayer, setShowRiskLayer] = useState(true);
  const [showDesaBorders, setShowDesaBorders] = useState(true);
  const [showDistrictBorders, setShowDistrictBorders] = useState(true);
  const [showRumahSakit, setShowRumahSakit] = useState(true);
  const [showSchool, setShowSchool] = useState(true);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [hoverInfo, setHoverInfo] = useState<any>(null);

  const [rumahSakitData, setRumahSakitData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDrawMode, setActiveDrawMode] = useState<string | null>(null);

  const [cursorLngLat, setCursorLngLat] = useState({ lng: 0, lat: 0 });
  const [drawnAreaInfo, setDrawnAreaInfo] = useState<{areaKm: string, areaM: string} | null>(null);

  useEffect(() => {
    // Fetch School Data
    fetch('/school.geojson')
      .then(res => res.json())
      .then(data => setSchoolData(data))
      .catch(err => console.error('Failed to load school data:', err));

    // Fetch Rumah Sakit Data
    fetch('/rumah_sakit.geojson')
      .then(res => res.json())
      .then(data => setRumahSakitData(data))
      .catch(err => console.error('Failed to load rumah sakit data:', err));
  }, []);

  useEffect(() => {
    if (!mapInstance || geomanRef.current) return;
    const gmOptions: GmOptionsPartial = {
      controls: {
        draw: {
          polygon: { uiEnabled: false },
          line: { uiEnabled: false },
          circle: { uiEnabled: false },
          marker: { uiEnabled: false },
          circle_marker: { uiEnabled: false },
          text_marker: { uiEnabled: false },
          rectangle: { uiEnabled: false },
          freehand: { uiEnabled: false },
          custom_shape: { uiEnabled: false },
        },
        edit: {
          change: { uiEnabled: false },
          copy: { uiEnabled: false },
          cut: { uiEnabled: false },
          drag: { uiEnabled: false },
          delete: { uiEnabled: false },
        },
        helper: {
          shape_markers: { uiEnabled: false },
          pin: { uiEnabled: false },
          snapping: { uiEnabled: false },
          snap_guides: { uiEnabled: false },
          click_to_edit: { uiEnabled: false },
        }
      },
    };
    const gm = new Geoman(mapInstance, gmOptions);
    geomanRef.current = gm;
  }, [mapInstance]);

  const onMapLoad = (e: any) => {
    setMapInstance(e.target);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}+Bekasi&format=json&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        mapRef.current?.flyTo({ center: [parseFloat(lon), parseFloat(lat)], zoom: 14 });
      } else {
        alert("Lokasi tidak ditemukan di Bekasi.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onClick = (event: any) => {
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
      
      // ML & Demographic Properties
      totalRS: (props['RS Umum'] || 0) + (props['RS Khusus'] || 0),
      totalSmp: props['Total Sekolah SMP'] || 0,
      totalSma: props['Total Sekolah SMA/K'] || 0,
      totalPenduduk: props['Total Penduduk'] || 0,
      lajuPertumbuhan: props['Laju Pertumbuhan'] || 0,
      luasWilayahKm: props['Luas Area (km²)'] || 0,
      riskLabel: props['Risk_Label'] || 'N/A',
      
      // Disaster Properties By Year
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

  const onMouseMove = (event: any) => {
    setCursorLngLat({ lng: event.lngLat.lng, lat: event.lngLat.lat });
    
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const allRendered = map.queryRenderedFeatures(event.point);
      
      const geomanFeature = allRendered.find((f: any) => {
        const id = f.layer?.id || '';
        const source = (typeof f.source === 'string') ? f.source : '';
        const isGeoman = id.includes('geoman') || id.includes('gm_') || id.includes('gm-') || id.includes('pm-') || source.includes('geoman') || source.includes('gm_') || source.includes('gm-') || source.includes('pm-');
        
        // Also ensure we are not accidentally picking up our own polygon layers if they somehow match the name
        const isNotMine = !['risk-fills', 'desa-borders', 'district-borders'].includes(id);

        return isGeoman && isNotMine && f.geometry && (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon');
      });

      if (geomanFeature) {
        try {
          const areaSqMeters = turf.area(geomanFeature);
          if (areaSqMeters > 0) {
            const areaSqKm = (areaSqMeters / 1000000).toFixed(3);
            setDrawnAreaInfo({ areaKm: areaSqKm, areaM: areaSqMeters.toLocaleString(undefined, { maximumFractionDigits: 2 }) });
          } else {
            setDrawnAreaInfo(null);
          }
        } catch (err) {
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
      
      {/* --- COMBINED LEFT PANEL --- */}
      <div className="absolute top-4 left-4 bottom-4 z-10 flex flex-col w-[320px]">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
          
          {/* Top Section: Logo & Back Button */}
          <div className="p-4 flex items-center justify-between border-b border-slate-100">
            <Link href="/" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </Link>
            <div className="flex items-center gap-3">
              <div className="leading-tight font-extrabold text-slate-900 tracking-wider text-[12px] uppercase text-right" style={{ fontFamily: 'Syne, sans-serif' }}>
                GIS<br/>KOTA<br/>BEKASI
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Cari Lokasi" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-[#0aab8a] focus:ring-1 focus:ring-[#0aab8a] transition-all"
                style={{ fontFamily: 'Syne, sans-serif' }}
              />
              <button type="submit" className="absolute right-1.5 p-1.5 bg-[#0aab8a] text-white rounded-lg hover:bg-[#088c71] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </form>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
            
            {/* Project Info Section */}
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>About The Project</h3>
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 text-slate-600 text-[12.5px] leading-relaxed shadow-sm">
                <p className="mb-2.5">
                  <strong className="text-emerald-700 font-bold">BekasiGIS</strong> is a spatial analysis platform utilizing <strong className="text-emerald-700 font-bold">K-Means Machine Learning</strong> to classify disaster risk zones in Kota Bekasi.
                </p>
                <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-emerald-100/60">
                  <div className="flex items-start gap-2.5">
                    <div className="bg-emerald-100/80 p-1 rounded-md shrink-0">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="font-medium text-slate-700">Multi-layer Risk Mapping</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="bg-emerald-100/80 p-1 rounded-md shrink-0">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="font-medium text-slate-700">Automated ML Clustering</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="bg-emerald-100/80 p-1 rounded-md shrink-0">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="font-medium text-slate-700">Geospatial Area Calculation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapset (Layers) Section */}
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Mapset</h3>
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex flex-col gap-1">
                {/* Risk Toggle */}
                <label className="flex items-center justify-between group cursor-pointer p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200">
                  <span className="text-[13px] font-bold text-slate-700" style={{ fontFamily: 'Syne, sans-serif' }}>Risk Clusters</span>
                  <input type="checkbox" className="w-4 h-4 accent-[#0aab8a] cursor-pointer" checked={showRiskLayer} onChange={(e) => setShowRiskLayer(e.target.checked)}/>
                </label>
                
                {/* Kecamatan Borders Toggle */}
                <label className="flex items-center justify-between group cursor-pointer p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200">
                  <span className="text-[13px] font-bold text-slate-700" style={{ fontFamily: 'Syne, sans-serif' }}>Kecamatan Borders</span>
                  <input type="checkbox" className="w-4 h-4 accent-slate-800 cursor-pointer" checked={showDistrictBorders} onChange={(e) => setShowDistrictBorders(e.target.checked)}/>
                </label>
                
                {/* Kelurahan Borders Toggle */}
                <label className="flex items-center justify-between group cursor-pointer p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200">
                  <span className="text-[13px] font-bold text-slate-700" style={{ fontFamily: 'Syne, sans-serif' }}>Kelurahan Borders</span>
                  <input type="checkbox" className="w-4 h-4 accent-slate-400 cursor-pointer" checked={showDesaBorders} onChange={(e) => setShowDesaBorders(e.target.checked)}/>
                </label>

                {/* Rumah Sakit Toggle */}
                <label className="flex items-center justify-between group cursor-pointer p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200">
                  <span className="text-[13px] font-bold text-slate-700" style={{ fontFamily: 'Syne, sans-serif' }}>Rumah Sakit</span>
                  <input type="checkbox" className="w-4 h-4 accent-red-500 cursor-pointer" checked={showRumahSakit} onChange={(e) => setShowRumahSakit(e.target.checked)}/>
                </label>

                {/* Sekolah Toggle */}
                <label className="flex items-center justify-between group cursor-pointer p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200">
                  <span className="text-[13px] font-bold text-slate-700" style={{ fontFamily: 'Syne, sans-serif' }}>Sekolah</span>
                  <input type="checkbox" className="w-4 h-4 accent-blue-500 cursor-pointer" checked={showSchool} onChange={(e) => setShowSchool(e.target.checked)}/>
                </label>
              </div>
            </div>

            {/* Geoman Control Section */}
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Pengukuran Peta</h3>
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button 
                  onClick={() => {
                    if (activeDrawMode === 'marker') { geomanRef.current?.disableDraw(); setActiveDrawMode(null); }
                    else { geomanRef.current?.enableDraw('marker'); setActiveDrawMode('marker'); }
                  }} 
                  title="Point" 
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'marker' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'marker' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </button>
                <button 
                  onClick={() => {
                    if (activeDrawMode === 'line') { geomanRef.current?.disableDraw(); setActiveDrawMode(null); }
                    else { geomanRef.current?.enableDraw('line'); setActiveDrawMode('line'); }
                  }} 
                  title="Line" 
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'line' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'line' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                    <circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><line x1="8.12" y1="8.12" x2="15.88" y2="15.88"/>
                  </svg>
                </button>
                <button 
                  onClick={() => {
                    if (activeDrawMode === 'polygon') { geomanRef.current?.disableDraw(); setActiveDrawMode(null); }
                    else { geomanRef.current?.enableDraw('polygon'); setActiveDrawMode('polygon'); }
                  }} 
                  title="Polygon" 
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'polygon' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'polygon' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                    <path d="M12 2l9 7-3.5 13h-11L3 9z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => {
                    if (activeDrawMode === 'circle') { geomanRef.current?.disableDraw(); setActiveDrawMode(null); }
                    else { geomanRef.current?.enableDraw('circle'); setActiveDrawMode('circle'); }
                  }} 
                  title="Circle" 
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'circle' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'circle' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </button>
                <button 
                  onClick={() => {
                    if (activeDrawMode === 'rectangle') { geomanRef.current?.disableDraw(); setActiveDrawMode(null); }
                    else { geomanRef.current?.enableDraw('rectangle'); setActiveDrawMode('rectangle'); }
                  }} 
                  title="Rectangle" 
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'rectangle' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'rectangle' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  </svg>
                </button>
                <button 
                  onClick={() => {
                    if (activeDrawMode === 'freehand') { geomanRef.current?.disableDraw(); setActiveDrawMode(null); }
                    else { geomanRef.current?.enableDraw('freehand'); setActiveDrawMode('freehand'); }
                  }} 
                  title="Freehand" 
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'freehand' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'freehand' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                    <path d="M17.5 19c-1.5 0-2.5-2-2.5-2s-1-2-2.5-2-2.5 2-2.5 2-1 2-2.5 2"/>
                    <path d="M22 12c-1.5 0-2.5-2-2.5-2s-1-2-2.5-2-2.5 2-2.5 2-1 2-2.5 2"/>
                  </svg>
                </button>
              </div>
              
              <button 
                onClick={() => {
                  geomanRef.current?.disableDraw();
                  setDrawnAreaInfo(null);
                  window.location.reload();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-bold text-[13px] border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Hapus Filter Alat Pengukuran Peta
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* --- TOP RIGHT LEGEND CARD --- */}
      <div className="absolute top-4 right-4 z-10 w-[280px] bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-slate-200 flex flex-col gap-3">
        <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase" style={{ fontFamily: 'Syne, sans-serif' }}>
          Informasi Risiko Bencana
        </h3>
        <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
          Peta ini menampilkan zona klasifikasi risiko bencana di wilayah Kota Bekasi. Klasifikasi didasarkan pada tingkat risiko yang dipetakan per wilayah.
        </p>
        <div className="flex flex-col gap-2.5 mt-2">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="w-3.5 h-3.5 rounded-full bg-[#a50026] shadow-sm"></span>
            <span className="text-xs font-bold text-slate-800" style={{ fontFamily: 'Syne, sans-serif' }}>Very High Risk</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="w-3.5 h-3.5 rounded-full bg-[#f46d43] shadow-sm"></span>
            <span className="text-xs font-bold text-slate-800" style={{ fontFamily: 'Syne, sans-serif' }}>High Risk</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="w-3.5 h-3.5 rounded-full bg-[#fee08b] shadow-sm"></span>
            <span className="text-xs font-bold text-slate-800" style={{ fontFamily: 'Syne, sans-serif' }}>Medium Risk</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1a9850] shadow-sm"></span>
            <span className="text-xs font-bold text-slate-800" style={{ fontFamily: 'Syne, sans-serif' }}>Low Risk</span>
          </div>
        </div>
      </div>

      <Map 
        ref={mapRef} 
        initialViewState={{ longitude: 106.9896, latitude: -6.2335, zoom: 11}} 
        style={{ width: '100%', height: '100%' }} 
        mapStyle={mapStyle} 
        onClick={onClick} 
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onLoad={onMapLoad}
        interactiveLayerIds={['risk-fills', 'rumah-sakit-points', 'school-points']} 
        cursor={hoverInfo ? 'pointer' : (popupInfo ? 'auto' : 'crosshair')}
      >
        <NavigationControl position="bottom-right" />

        {/* --- DRAWN AREA INFO --- */}
        {drawnAreaInfo && (
          <div className="absolute top-4 right-[310px] z-50 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-[#0aab8a] flex flex-col gap-1 anim-fade-in w-[180px]">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 mb-1">
               <span className="text-[11px] text-[#0aab8a] font-bold uppercase tracking-wider" style={{ fontFamily: 'Syne, sans-serif' }}>Area Size</span>
               <button onClick={() => setDrawnAreaInfo(null)} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </button>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-800 leading-tight">{drawnAreaInfo.areaKm} <span className="text-xs font-normal text-slate-500">km²</span></span>
              <span className="text-xs font-semibold text-slate-500 mt-0.5">{drawnAreaInfo.areaM} m²</span>
            </div>
          </div>
        )}

        {/* --- BOTTOM RIGHT LNG LAT CARD --- */}
        <div className="absolute bottom-12 right-[56px] z-50 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-200 flex gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest" style={{ fontFamily: 'DM Mono, monospace' }}>Latitude</span>
            <span className="text-xs font-bold text-slate-700 w-[65px]">{cursorLngLat.lat.toFixed(5)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest" style={{ fontFamily: 'DM Mono, monospace' }}>Longitude</span>
            <span className="text-xs font-bold text-slate-700 w-[65px]">{cursorLngLat.lng.toFixed(5)}</span>
          </div>
        </div>

        {/* --- HOVER TOOLTIP --- */}
        {hoverInfo && (
          <Popup longitude={hoverInfo.longitude} latitude={hoverInfo.latitude} closeButton={false} closeOnClick={false} anchor="bottom" offset={12} className="z-50 pointer-events-none">
            <div className="min-w-[120px] max-w-[220px]">
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>{hoverInfo.type}</div>
              <div className="text-xs font-bold text-slate-800 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>{hoverInfo.name}</div>
              {hoverInfo.address && <div className="text-[10px] text-slate-500 mt-1 leading-snug">{hoverInfo.address}</div>}
            </div>
          </Popup>
        )}

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

                {/* Histori Bencana Section */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider" style={{ fontFamily: 'DM Mono, monospace' }}>Histori Bencana</div>
                    <div className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">Total: {popupInfo.totalBencana} Kejadian</div>
                  </div>
                  
                  <div className="overflow-hidden border border-slate-200 rounded-lg">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-[9px] uppercase text-slate-500 border-b border-slate-200" style={{ fontFamily: 'DM Mono, monospace' }}>
                          <th className="py-1.5 px-2 font-semibold">Bencana</th>
                          <th className="py-1.5 px-2 font-semibold text-center border-l border-slate-200">2020</th>
                          <th className="py-1.5 px-2 font-semibold text-center border-l border-slate-200">2021</th>
                          <th className="py-1.5 px-2 font-semibold text-center border-l border-slate-200">2024</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs text-slate-700 bg-white">
                        <tr className="border-b border-slate-100">
                          <td className="py-1.5 px-2 font-medium text-blue-700">Banjir</td>
                          <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.banjir2020}</td>
                          <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.banjir2021}</td>
                          <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.banjir2024}</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="py-1.5 px-2 font-medium text-orange-700">Longsor</td>
                          <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.longsor2020}</td>
                          <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.longsor2021}</td>
                          <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.longsor2024}</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 px-2 font-medium text-yellow-700">Gempa</td>
                          <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.gempa2020}</td>
                          <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.gempa2021}</td>
                          <td className="py-1.5 px-2 text-center border-l border-slate-100 font-bold">{popupInfo.gempa2024}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </Popup>
        )}

        {/* --- THE MASTER DATA SOURCE --- */}
        <Source id="spatial_risk" type="vector" tiles={['http://localhost:8080/data/spatial_risk/{z}/{x}/{y}.pbf?v=2']}>
          
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


        </Source>

        {/* --- KECAMATAN BORDERS SOURCE --- */}
        <Source id="kecamatan_borders" type="vector" tiles={['http://localhost:8080/data/kecamatan_borders/{z}/{x}/{y}.pbf']}>
          <Layer id="district-borders" type="line" source-layer="kecamatan_borders"
            layout={{ visibility: showDistrictBorders ? 'visible' : 'none' }} 
            paint={{ 
              'line-color': '#1e293b', 
              'line-width': 2.5,
              'line-opacity': 1
            }}/>
        </Source>

        {/* --- RUMAH SAKIT SOURCE --- */}
        {rumahSakitData && (
          <Source id="rumah_sakit" type="geojson" data={rumahSakitData}>
            {/* Outer Glow */}
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
            {/* Inner Core */}
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

        {/* --- SCHOOL SOURCE --- */}
        {schoolData && (
          <Source id="school" type="geojson" data={schoolData}>
            {/* Outer Glow */}
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
            {/* Inner Core */}
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
