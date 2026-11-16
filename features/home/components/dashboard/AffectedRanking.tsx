import { KECAMATAN } from '@/features/home/data/stats';
import { card, RISK_HEX } from './ui';

// KECAMATAN is already sorted by affected, descending.
const TOP = KECAMATAN.slice(0, 6);
const MAX = TOP[0].affected;

/** Top-6 kecamatan by kelurahan affected, bars colored by risk class. */
export default function AffectedRanking() {
  return (
    <div className={`${card} p-5 anim-fade-up`} style={{ animationDelay: '0.2s' }}>
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <h3 className="font-bold text-slate-900 text-[15px] leading-snug">Kelurahan yang terdampak selama 3 tahun</h3>
        <span className="text-[11px] text-slate-400 font-mono shrink-0">6 teratas</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {TOP.map((k) => (
          <div key={k.name} className="grid grid-cols-[minmax(0,7.5rem)_1fr_1.5rem] items-center gap-2.5">
            <span className="text-[13px] text-slate-600 truncate">{k.name}</span>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(k.affected / MAX) * 100}%`, background: RISK_HEX[k.risk] }} />
            </div>
            <span className="text-[13px] font-semibold text-slate-800 text-right font-mono tabular-nums">{k.affected}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
