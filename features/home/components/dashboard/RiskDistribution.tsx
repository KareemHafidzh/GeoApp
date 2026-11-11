import { RISK_LEVELS } from '@/features/map/constants';
import { card, riskCount } from './ui';

/** How the 12 kecamatan split across the three K-Means risk classes. */
export default function RiskDistribution() {
  return (
    <div className={`${card} p-5 anim-fade-up`} style={{ animationDelay: '0.28s' }}>
      <h3 className="font-bold text-slate-900 text-[15px] mb-3">Distribusi risiko (K=3)</h3>
      <div className="flex h-2.5 rounded-full overflow-hidden mb-3">
        {RISK_LEVELS.map((r) => <div key={r.label} style={{ flex: riskCount(r.label), background: r.color }} />)}
      </div>
      {RISK_LEVELS.map((r) => (
        <div key={r.label} className="flex items-center justify-between py-1">
          <span className="flex items-center gap-2 text-[13px] text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} /> {r.label}
          </span>
          <span className="text-[13px] font-semibold text-slate-800 font-mono tabular-nums">{riskCount(r.label)} kec.</span>
        </div>
      ))}
      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
        Kepadatan tinggi ≠ risiko tinggi: Bekasi Barat terpadat, namun berisiko rendah.
      </p>
    </div>
  );
}
