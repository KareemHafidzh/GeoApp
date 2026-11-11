import { RISK_LEVELS } from '@/features/map/constants';
import { card, mono, riskCount, syne } from './ui';

/** How the 12 kecamatan split across the three K-Means risk classes. */
export default function RiskDistribution() {
  return (
    <div className={`${card} p-5 anim-fade-up`} style={{ animationDelay: '0.28s' }}>
      <h3 className="font-bold text-slate-900 text-sm mb-4" style={syne}>Distribusi Risiko (K=3)</h3>
      <div className="flex h-3 rounded-full overflow-hidden mb-4">
        {RISK_LEVELS.map((r) => <div key={r.label} style={{ flex: riskCount(r.label), background: r.color }} />)}
      </div>
      {RISK_LEVELS.map((r) => (
        <div key={r.label} className="flex items-center justify-between py-1.5">
          <span className="flex items-center gap-2 text-xs text-slate-600" style={syne}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} /> {r.label}
          </span>
          <span className="text-xs font-bold text-slate-800" style={mono}>{riskCount(r.label)} kec.</span>
        </div>
      ))}
      <p className="text-[10px] text-slate-400 mt-3 leading-relaxed" style={mono}>
        Kepadatan tinggi ≠ risiko tinggi: Bekasi Barat terpadat namun berisiko rendah.
      </p>
    </div>
  );
}
