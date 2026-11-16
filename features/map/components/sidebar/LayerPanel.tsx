import type { LayerKey } from '@/features/map/types';

const AREA = 'M4 7l6-3 9 3 1 9-7 4-8-3z';
const dot = (classes: string) => <span className={`rounded-full border-2 border-white shadow-sm ${classes}`} />;

// Daftar lapisan dengan ikon yang meniru tampilannya di peta (garis, area, atau titik berwarna).
const LAYERS: { key: LayerKey; label: string; accent: string; tile: string; icon: React.ReactNode }[] = [
  { key: 'risk', label: 'Zona Risiko', accent: 'accent-[#0aab8a]', tile: 'bg-amber-50 text-amber-500',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" fillOpacity="0.55" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d={AREA} /></svg> },
  { key: 'kecamatan', label: 'Batas Kecamatan', accent: 'accent-slate-800', tile: 'bg-slate-100 text-slate-800',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"><path d={AREA} /></svg> },
  { key: 'kelurahan', label: 'Batas Kelurahan', accent: 'accent-slate-400', tile: 'bg-slate-100 text-blue-900',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d={AREA} /><path d="M10 4l1 8-7 5M11 12l9 4M11 12l2 8" /></svg> },
  { key: 'rumahSakit', label: 'Rumah Sakit', accent: 'accent-red-500', tile: 'bg-red-50', icon: dot('w-3.5 h-3.5 bg-red-500 ring-[5px] ring-red-500/25') },
  { key: 'puskesmas', label: 'Puskesmas', accent: 'accent-emerald-500', tile: 'bg-emerald-50', icon: dot('w-3 h-3 bg-emerald-500 ring-4 ring-emerald-500/25') },
  { key: 'sekolah', label: 'Sekolah', accent: 'accent-blue-500', tile: 'bg-blue-50', icon: dot('w-3 h-3 bg-blue-500 ring-4 ring-blue-500/25') },
];

// Panel "Lapisan Peta": centang untuk menyalakan/mematikan tiap lapisan, ikonnya memudar saat mati.
export default function LayerPanel({ visible, onToggle }: { visible: Record<LayerKey, boolean>; onToggle: (key: LayerKey) => void }) {
  return (
    <div data-tour="mapset">
      <h3 className="text-[15px] font-bold text-slate-800 mb-3">Lapisan Peta</h3>
      <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-2 flex flex-col gap-0.5">
        {LAYERS.map(({ key, label, accent, tile, icon }) => (
          <label key={key} className="flex items-center justify-between gap-3 cursor-pointer p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200">
            <span className="flex items-center gap-3">
              <span aria-hidden className={`w-8 h-8 shrink-0 rounded-lg overflow-hidden flex items-center justify-center transition-all ${tile} ${visible[key] ? '' : 'opacity-40 grayscale'}`}>
                {icon}
              </span>
              <span className="text-[13px] font-bold text-slate-700">{label}</span>
            </span>
            <input type="checkbox" className={`w-4 h-4 cursor-pointer ${accent}`} checked={visible[key]} onChange={() => onToggle(key)} />
          </label>
        ))}
      </div>
    </div>
  );
}
