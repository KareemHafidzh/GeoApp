import { KECAMATAN, TOTALS } from '@/features/home/data/stats';
import { card, fmt, mono, riskCount, syne } from './ui';
import CtaCard from './CtaCard';

const STATS = [
  { label: 'Total Penduduk', value: `${(TOTALS.population / 1e6).toFixed(2)} jt`, sub: `${TOTALS.areaKm2} km² wilayah`, bg: '#e0f2fe', d: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a2.5 2.5 0 1 0 0-5M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 14c2.8 0 5 2.2 5 5' },
  { label: 'Kelurahan Terdampak Bencana', value: fmt(TOTALS.affected), sub: 'banjir + longsor · 2021 + 2024 + 2025', bg: '#fee2e2', d: 'M12 3 2 20h20zM12 10v4M12 17h.01' },
  { label: 'Fasilitas Kesehatan', value: fmt(TOTALS.healthFacilities), sub: 'RS + puskesmas · BPS', bg: '#dcfce7', d: 'M12 5v14M5 12h14' },
];

const highRiskAffected = KECAMATAN.filter((k) => k.risk === 'Risiko Tinggi').reduce((a, k) => a + k.affected, 0);

/** Left column: headline, high-risk count and three key figures. */
export default function KeyStats() {
  return (
    <div className="lg:col-span-3 flex flex-col gap-4 order-1">
      <div className="anim-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 uppercase mb-4" style={{ ...mono, fontSize: 10, letterSpacing: '0.12em' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-blink" /> Kota Bekasi · Data 2025
        </div>
        <h1 className="font-extrabold text-slate-900 leading-[1.05] tracking-[-0.03em]" style={{ ...syne, fontSize: 'clamp(2.2rem, 3.4vw, 3.2rem)' }}>
          Disaster <span className="text-[#0aab8a]">Risk</span> Atlas
        </h1>
        <p className="text-slate-500 mt-2 text-sm" style={syne}>K-Means clustering of 12 kecamatan. Real data, safer city.</p>
      </div>

      <div className="anim-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="text-slate-700 text-sm font-semibold" style={syne}>Kecamatan berisiko tinggi</div>
        <div className="font-extrabold text-slate-900 leading-none mt-1" style={{ ...syne, fontSize: 64 }}>
          {riskCount('Risiko Tinggi')}<span className="text-slate-300 text-4xl"> / 12</span>
        </div>
        <span className="inline-block mt-3 px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold" style={mono}>
          {fmt(highRiskAffected)} kelurahan terdampak di zona ini (2021, 2024, 2025)
        </span>
      </div>

      <CtaCard />

      {STATS.map((s, i) => (
        <div key={s.label} className={`${card} anim-fade-up p-4 flex items-center gap-4`} style={{ animationDelay: `${0.15 + i * 0.07}s` }}>
          <div className="w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center" style={{ background: s.bg }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800"><path d={s.d} /></svg>
          </div>
          <div>
            <div className="text-slate-500 text-xs" style={syne}>{s.label}</div>
            <div className="font-extrabold text-slate-900 text-2xl" style={syne}>{s.value}</div>
            <div className="text-slate-400 text-[10px]" style={mono}>{s.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
