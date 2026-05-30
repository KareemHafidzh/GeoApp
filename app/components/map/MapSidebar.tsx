import Link from 'next/link';
import type { DrawMode } from '@/app/types/map';

interface MapSidebarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  handleSearch: (e: React.FormEvent) => void;
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
  activeDrawMode: DrawMode | null;
  toggleDrawMode: (mode: DrawMode) => void;
  clearAll: () => void;
}

export default function MapSidebar({
  searchQuery,
  setSearchQuery,
  handleSearch,
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
  activeDrawMode,
  toggleDrawMode,
  clearAll,
}: MapSidebarProps) {
  return (
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
                onClick={() => toggleDrawMode('marker')} 
                title="Point" 
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'marker' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'marker' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </button>
              <button 
                onClick={() => toggleDrawMode('line')} 
                title="Line" 
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'line' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'line' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                  <circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><line x1="8.12" y1="8.12" x2="15.88" y2="15.88"/>
                </svg>
              </button>
              <button 
                onClick={() => toggleDrawMode('polygon')} 
                title="Polygon" 
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'polygon' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'polygon' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                  <path d="M12 2l9 7-3.5 13h-11L3 9z"/>
                </svg>
              </button>
              <button 
                onClick={() => toggleDrawMode('circle')} 
                title="Circle" 
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'circle' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'circle' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </button>
              <button 
                onClick={() => toggleDrawMode('rectangle')} 
                title="Rectangle" 
                className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeDrawMode === 'rectangle' ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={activeDrawMode === 'rectangle' ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                </svg>
              </button>
              <button 
                onClick={() => toggleDrawMode('freehand')} 
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
}
