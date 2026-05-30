import { Popup } from 'react-map-gl/maplibre';
import type { HoverInfo } from '@/app/types/map';

interface MapHoverTooltipProps {
  hoverInfo: HoverInfo | null;
}

export default function MapHoverTooltip({ hoverInfo }: MapHoverTooltipProps) {
  if (!hoverInfo) return null;

  return (
    <Popup longitude={hoverInfo.longitude} latitude={hoverInfo.latitude} closeButton={false} closeOnClick={false} anchor="bottom" offset={12} className="z-50 pointer-events-none">
      <div className="min-w-[120px] max-w-[220px]">
        <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>{hoverInfo.type}</div>
        <div className="text-xs font-bold text-slate-800 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>{hoverInfo.name}</div>
        {hoverInfo.address && <div className="text-[10px] text-slate-500 mt-1 leading-snug">{hoverInfo.address}</div>}
      </div>
    </Popup>
  );
}
