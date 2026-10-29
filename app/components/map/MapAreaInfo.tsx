import { Marker } from 'react-map-gl/maplibre';
import type { DrawnAreaInfo } from '@/app/types/map';

interface MapAreaInfoProps {
  drawnAreaInfo: DrawnAreaInfo | null;
  onClose: () => void;
}

// Area card pinned to the centre of the drawn shape.
export default function MapAreaInfo({ drawnAreaInfo, onClose }: MapAreaInfoProps) {
  if (!drawnAreaInfo) return null;

  return (
    <Marker longitude={drawnAreaInfo.longitude} latitude={drawnAreaInfo.latitude} anchor="center" style={{ zIndex: 40 }}>
      <div className="bg-white/95 backdrop-blur-md rounded-xl px-3 py-2.5 shadow-xl border border-[#0aab8a] flex flex-col gap-1 anim-fade-in min-w-[140px] cursor-default">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-1.5 mb-0.5">
            <span className="text-[11px] text-[#0aab8a] font-bold uppercase tracking-wider" style={{ fontFamily: 'Syne, sans-serif' }}>Area Size</span>
            <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-slate-800 leading-tight">{drawnAreaInfo.areaKm} <span className="text-xs font-normal text-slate-500">km²</span></span>
          <span className="text-xs font-semibold text-slate-500 mt-0.5">{drawnAreaInfo.areaM} m²</span>
        </div>
      </div>
    </Marker>
  );
}
