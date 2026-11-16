import React, { useState } from 'react';
import Link from 'next/link';
import type { MapTool } from '@/features/map/types';
import type { SearchResult } from '@/features/map/hooks/useMapSearch';

interface MapSidebarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  searching: boolean;
  searchMessage: string | null;
  searchResults: SearchResult[];
  activeResult: SearchResult | null;
  selectResult: (r: SearchResult) => void;
  showRiskLayer: boolean;
  setShowRiskLayer: (show: boolean) => void;
  showDesaBorders: boolean;
  setShowDesaBorders: (show: boolean) => void;
  showDistrictBorders: boolean;
  setShowDistrictBorders: (show: boolean) => void;
  showRumahSakit: boolean;
  setShowRumahSakit: (show: boolean) => void;
  showSchool: boolean;
  setShowSchool: (show: boolean) => void;
  showPuskesmas: boolean;
  setShowPuskesmas: (show: boolean) => void;
  activeDrawMode: MapTool | null;
  toggleDrawMode: (mode: MapTool) => void;
  clearAll: () => void;
  isOpen: boolean;
  hidden: boolean;
  onClose: () => void;
}

export default React.memo(function MapSidebar({
  searchQuery,
  setSearchQuery,
  handleSearch,
  searching,
  searchMessage,
  searchResults,
  activeResult,
  selectResult,
  showRiskLayer,
  setShowRiskLayer,
  showDesaBorders,
  setShowDesaBorders,
  showDistrictBorders,
  setShowDistrictBorders,
  showRumahSakit,
  setShowRumahSakit,
  showSchool,
  setShowSchool,
  showPuskesmas,
  setShowPuskesmas,
  activeDrawMode,
  toggleDrawMode,
  clearAll,
  isOpen,
  hidden,
  onClose,
}: MapSidebarProps) {
  const [copied, setCopied] = useState(false);

  // The map keeps #zoom/lat/lng in the URL (Map `hash`), so sharing location.href shares the view.
  const shareView = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: 'Geodashboard Bekasi', url }); } catch { /* user cancelled */ }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const layers = [
    { label: 'Zona Risiko', checked: showRiskLayer, set: setShowRiskLayer, accent: 'accent-[#0aab8a]', tile: 'bg-amber-50 text-amber-500',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" fillOpacity="0.55" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M4 7l6-3 9 3 1 9-7 4-8-3z" /></svg> },
    { label: 'Batas Kecamatan', checked: showDistrictBorders, set: setShowDistrictBorders, accent: 'accent-slate-800', tile: 'bg-slate-100 text-slate-800',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7l6-3 9 3 1 9-7 4-8-3z" /></svg> },
    { label: 'Batas Kelurahan', checked: showDesaBorders, set: setShowDesaBorders, accent: 'accent-slate-400', tile: 'bg-slate-100 text-blue-900',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7l6-3 9 3 1 9-7 4-8-3z" /><path d="M10 4l1 8-7 5M11 12l9 4M11 12l2 8" /></svg> },
    { label: 'Rumah Sakit', checked: showRumahSakit, set: setShowRumahSakit, accent: 'accent-red-500', tile: 'bg-red-50 text-red-500',
      icon: <span className="rounded-full border-2 border-white shadow-sm w-3.5 h-3.5 bg-red-500 ring-[5px] ring-red-500/25" /> },
    { label: 'Puskesmas', checked: showPuskesmas, set: setShowPuskesmas, accent: 'accent-emerald-500', tile: 'bg-emerald-50 text-emerald-500',
      icon: <span className="rounded-full border-2 border-white shadow-sm w-3 h-3 bg-emerald-500 ring-4 ring-emerald-500/25" /> },
    { label: 'Sekolah', checked: showSchool, set: setShowSchool, accent: 'accent-blue-500', tile: 'bg-blue-50 text-blue-500',
      icon: <span className="rounded-full border-2 border-white shadow-sm w-3 h-3 bg-blue-500 ring-4 ring-blue-500/25" /> },
  ];

  return (
    <div data-tour="sidebar" className={`absolute top-0 left-0 bottom-0 z-30 flex flex-col w-[300px] max-w-[88vw] p-3 sm:top-4 sm:left-4 sm:bottom-4 sm:p-0 sm:w-[320px] sm:max-w-none transition-transform duration-300 ease-in-out ${hidden ? '' : 'lg:translate-x-0'} ${isOpen ? 'translate-x-0' : '-translate-x-[110%]'}`}>
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">

        {/* Top Section: Logo & Back Button */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <button onClick={onClose} aria-label="Sembunyikan panel" title="Sembunyikan panel" className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            onClick={shareView}
            title="Bagikan tampilan peta"
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 text-[12px] font-bold"
            style={{ fontFamily: 'Syne, sans-serif' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            {copied ? 'Tersalin!' : 'Bagikan'}
          </button>
          <div className="leading-tight font-extrabold text-slate-900 tracking-wider text-[12px] uppercase text-right" style={{ fontFamily: 'Syne, sans-serif' }}>
            GIS<br/>KOTA<br/>BEKASI
          </div>
        </div>
        <Link href="/" className="mx-4 mt-3 py-2 text-center rounded-lg bg-[#0aab8a] hover:bg-[#088c71] transition-colors text-white text-[12px] font-bold shadow-sm" style={{ fontFamily: 'Syne, sans-serif' }}>
          Kembali ke Beranda
        </Link>

        {/* Search Section */}
        <div data-tour="search" className="p-4 pt-3 border-b border-slate-100 bg-slate-50/50">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Cari Lokasi" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:border-[#0aab8a] focus:ring-1 focus:ring-[#0aab8a] transition-all"
              style={{ fontFamily: 'Syne, sans-serif' }}
            />
            <button type="submit" aria-label="Cari" disabled={searching} className="absolute right-1.5 p-1.5 bg-[#0aab8a] text-white rounded-lg hover:bg-[#088c71] disabled:opacity-60 disabled:cursor-wait transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </form>
          <p role="status" aria-live="polite" className="empty:hidden mt-2 px-1 text-[12px] text-slate-600">
            {searching ? 'Mencari…' : searchMessage}
          </p>
          {searchResults.length > 0 && (
            <ul className="mt-2 bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
              {searchResults.map((r, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => selectResult(r)}
                    aria-current={r === activeResult}
                    className={`w-full text-left px-3 py-2 text-[12px] transition-colors ${r === activeResult ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-emerald-50'}`}>
                    <span className="line-clamp-2">{r.display_name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          
          {/* Project Info Section */}
          <div>
            <h3 className="text-[15px] font-bold text-slate-800 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Apa ini?</h3>
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5 text-slate-600 text-[12.5px] leading-relaxed shadow-sm">
              <p className="mb-2.5">
                <strong className="text-emerald-700 font-bold">Geodashboard Bekasi</strong> adalah peta untuk <strong className="text-emerald-700 font-bold">membandingkan risiko bencana</strong> antar kecamatan di Kota Bekasi. Klik area di peta untuk melihat detailnya.
              </p>
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-emerald-100/60">
                <div className="flex items-start gap-2.5">
                  <div className="bg-emerald-100/80 p-1 rounded-md shrink-0">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="font-medium text-slate-700">Banyak lapisan peta</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="bg-emerald-100/80 p-1 rounded-md shrink-0">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="font-medium text-slate-700">Risiko dihitung otomatis</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="bg-emerald-100/80 p-1 rounded-md shrink-0">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="font-medium text-slate-700">Ukur jarak &amp; luas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mapset (Layers) Section */}
          <div data-tour="mapset">
            <h3 className="text-[15px] font-bold text-slate-800 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Lapisan Peta</h3>
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-2 flex flex-col gap-0.5">
              {layers.map(({ label, checked, set, accent, tile, icon }) => (
                <label key={label} className="flex items-center justify-between gap-3 cursor-pointer p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200">
                  <span className="flex items-center gap-3">
                    {/* Drawn the way the layer looks on the map; greyed out while the layer is off. */}
                    <span aria-hidden className={`w-8 h-8 shrink-0 rounded-lg overflow-hidden flex items-center justify-center transition-all ${tile} ${checked ? '' : 'opacity-40 grayscale'}`}>
                      {icon}
                    </span>
                    <span className="text-[13px] font-bold text-slate-700" style={{ fontFamily: 'Syne, sans-serif' }}>{label}</span>
                  </span>
                  <input type="checkbox" className={`w-4 h-4 cursor-pointer ${accent}`} checked={checked} onChange={(e) => set(e.target.checked)} />
                </label>
              ))}
            </div>
          </div>

          {/* Geoman Control Section */}
          <div data-tour="measure">
            <h3 className="text-[15px] font-bold text-slate-800 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Pengukuran Peta</h3>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button 
                onClick={() => toggleDrawMode('marker')} 
                title="Titik" 
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'marker' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'marker' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="mt-1.5 text-[10px] font-bold text-slate-600">Titik</span>
              </button>
              <button 
                onClick={() => toggleDrawMode('line')} 
                title="Garis" 
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'line' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'line' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                  <circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><line x1="8.12" y1="8.12" x2="15.88" y2="15.88"/>
                </svg>
                <span className="mt-1.5 text-[10px] font-bold text-slate-600">Garis</span>
              </button>
              <button 
                onClick={() => toggleDrawMode('polygon')} 
                title="Poligon" 
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'polygon' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'polygon' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                  <path d="M12 2l9 7-3.5 13h-11L3 9z"/>
                </svg>
                <span className="mt-1.5 text-[10px] font-bold text-slate-600">Poligon</span>
              </button>
              <button 
                onClick={() => toggleDrawMode('circle')} 
                title="Lingkaran" 
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'circle' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'circle' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                <span className="mt-1.5 text-[10px] font-bold text-slate-600">Lingkaran</span>
              </button>
              <button 
                onClick={() => toggleDrawMode('rectangle')} 
                title="Persegi" 
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'rectangle' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'rectangle' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                </svg>
                <span className="mt-1.5 text-[10px] font-bold text-slate-600">Persegi</span>
              </button>
              <button 
                onClick={() => toggleDrawMode('freehand')} 
                title="Gambar bebas" 
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'freehand' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'freehand' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                  <path d="M17.5 19c-1.5 0-2.5-2-2.5-2s-1-2-2.5-2-2.5 2-2.5 2-1 2-2.5 2"/>
                  <path d="M22 12c-1.5 0-2.5-2-2.5-2s-1-2-2.5-2-2.5 2-2.5 2-1 2-2.5 2"/>
                </svg>
                <span className="mt-1.5 text-[10px] font-bold text-slate-600">Bebas</span>
              </button>
            </div>

            {/* Change shapes already on the map */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {([['edit', 'Ubah ukuran'], ['drag', 'Geser'], ['delete', 'Hapus satu']] as const).map(([tool, label]) => (
                <button
                  key={tool}
                  onClick={() => toggleDrawMode(tool)}
                  aria-pressed={activeDrawMode === tool}
                  className={`py-2 border rounded-xl text-[11px] font-bold transition-colors shadow-sm ${activeDrawMode === tool ? 'bg-green-50 border-[#0aab8a] text-[#0aab8a]' : 'bg-white border-slate-200 text-slate-700 hover:border-[#0aab8a] hover:bg-green-50/50'}`}>
                  {label}
                </button>
              ))}
            </div>

            <button 
              onClick={clearAll}
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
  );
});
