import type { CursorLngLat } from '@/app/types/map';

interface MapCoordinateBarProps {
  cursorLngLat: CursorLngLat;
}

export default function MapCoordinateBar({ cursorLngLat }: MapCoordinateBarProps) {
  return (
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
  );
}
