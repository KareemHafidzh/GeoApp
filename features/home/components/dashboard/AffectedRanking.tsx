import { KECAMATAN } from '@/features/home/data/stats';
import { card, mono, RISK_HEX, syne } from './ui';

// KECAMATAN is already sorted by affected, descending.
const TOP = KECAMATAN.slice(0, 6);
const MAX = TOP[0].affected;

/** Top-6 kecamatan by kelurahan affected, bars colored by risk class. */
export default function AffectedRanking() {
  return (
    <div className={`${card} p-5 anim-fade-up`} style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-sm" style={syne}>Kelurahan Terdampak per Kecamatan</h3>
        <span className="text-[10px] text-slate-400 border border-slate-200 rounded-lg px-2 py-0.5" style={mono}>Top 6</span>
      </div>
      <div className="flex flex-col gap-3">
        {TOP.map((k) => (
          <div key={k.name} className="grid grid-cols-[96px_1fr_24px] items-center gap-2">
            <span className="text-xs text-slate-600 truncate" style={syne}>{k.name}</span>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(k.affected / MAX) * 100}%`, background: RISK_HEX[k.risk] }} />
            </div>
            <span className="text-xs font-bold text-slate-800 text-right" style={mono}>{k.affected}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
