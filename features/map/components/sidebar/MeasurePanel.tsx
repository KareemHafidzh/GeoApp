import type { MapTool } from '@/features/map/types';

const stroke = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

// Alat gambar untuk membuat bentuk baru di peta.
const DRAW_TOOLS: { tool: MapTool; label: string; icon: React.ReactNode }[] = [
  { tool: 'marker', label: 'Titik', icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></> },
  { tool: 'line', label: 'Garis', icon: <><circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><line x1="8.12" y1="8.12" x2="15.88" y2="15.88" /></> },
  { tool: 'polygon', label: 'Poligon', icon: <path d="M12 2l9 7-3.5 13h-11L3 9z" /> },
  { tool: 'circle', label: 'Lingkaran', icon: <circle cx="12" cy="12" r="10" /> },
  { tool: 'rectangle', label: 'Persegi', icon: <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /> },
  { tool: 'freehand', label: 'Bebas', icon: <><path d="M17.5 19c-1.5 0-2.5-2-2.5-2s-1-2-2.5-2-2.5 2-2.5 2-1 2-2.5 2" /><path d="M22 12c-1.5 0-2.5-2-2.5-2s-1-2-2.5-2-2.5 2-2.5 2-1 2-2.5 2" /></> },
];

// Alat untuk mengubah bentuk yang sudah ada di peta.
const EDIT_TOOLS: { tool: MapTool; label: string }[] = [
  { tool: 'edit', label: 'Ubah ukuran' },
  { tool: 'drag', label: 'Geser' },
  { tool: 'delete', label: 'Hapus satu' },
];

interface MeasurePanelProps {
  activeTool: MapTool | null;
  onPickTool: (tool: MapTool) => void;
  onClearAll: () => void;
}

// Panel "Pengukuran Peta": pilih alat gambar, ubah bentuk, atau hapus semua gambar.
export default function MeasurePanel({ activeTool, onPickTool, onClearAll }: MeasurePanelProps) {
  return (
    <div data-tour="measure">
      <h3 className="text-[15px] font-bold text-slate-800 mb-3">Pengukuran Peta</h3>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {DRAW_TOOLS.map(({ tool, label, icon }) => (
          <button
            key={tool}
            onClick={() => onPickTool(tool)}
            title={label}
            aria-pressed={activeTool === tool}
            className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-colors group shadow-sm ${activeTool === tool ? 'bg-green-50 border-[#0aab8a]' : 'bg-white border-slate-200 hover:border-[#0aab8a] hover:bg-green-50/50'}`}>
            <svg {...stroke} className={activeTool === tool ? 'text-[#0aab8a]' : 'text-slate-700 group-hover:text-[#0aab8a]'}>{icon}</svg>
            <span className="mt-1.5 text-[10px] font-bold text-slate-600">{label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        {EDIT_TOOLS.map(({ tool, label }) => (
          <button
            key={tool}
            onClick={() => onPickTool(tool)}
            aria-pressed={activeTool === tool}
            className={`py-2 border rounded-xl text-[11px] font-bold transition-colors shadow-sm ${activeTool === tool ? 'bg-green-50 border-[#0aab8a] text-[#0aab8a]' : 'bg-white border-slate-200 text-slate-700 hover:border-[#0aab8a] hover:bg-green-50/50'}`}>
            {label}
          </button>
        ))}
      </div>

      <button
        onClick={onClearAll}
        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-bold text-[13px] border border-red-200 rounded-xl hover:bg-red-100 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        Hapus Filter Alat Pengukuran Peta
      </button>
    </div>
  );
}
