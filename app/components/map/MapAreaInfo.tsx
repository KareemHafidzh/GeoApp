import type { DrawnAreaInfo } from '@/app/types/map';

interface MapAreaInfoProps {
  drawnAreaInfo: DrawnAreaInfo | null;
  onClose: () => void;
}

export default function MapAreaInfo({ drawnAreaInfo, onClose }: MapAreaInfoProps) {
  if (!drawnAreaInfo) return null;

  return (
    <div className="absolute top-4 right-[310px] z-50 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-[#0aab8a] flex flex-col gap-1 anim-fade-in w-[180px]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 mb-1">
          <span className="text-[11px] text-[#0aab8a] font-bold uppercase tracking-wider" style={{ fontFamily: 'Syne, sans-serif' }}>Area Size</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-slate-800 leading-tight">{drawnAreaInfo.areaKm} <span className="text-xs font-normal text-slate-500">km²</span></span>
        <span className="text-xs font-semibold text-slate-500 mt-0.5">{drawnAreaInfo.areaM} m²</span>
      </div>
    </div>
  );
}
