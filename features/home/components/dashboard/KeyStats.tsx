import { KECAMATAN, TOTALS } from '@/features/home/data/stats';
import { fmt, riskCount } from './ui';
import CtaCard from './CtaCard';

const highRiskAffected = KECAMATAN.filter((k) => k.risk === 'Risiko Tinggi').reduce((a, k) => a + k.affected, 0);

/** Intro column: headline, high-risk count and the call-to-action. */
export default function KeyStats() {
  return (
    <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-5 lg:justify-between">
      <div className="anim-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[11px] uppercase tracking-[0.1em] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-blink" /> Kota Bekasi · Data 2025
        </div>
        <h1 className="font-extrabold text-slate-900 leading-[1.05] tracking-[-0.03em] text-[2.25rem] lg:text-[2.5rem]">
          Disaster <span className="text-[#0aab8a]">Risk</span> Atlas
        </h1>
        <p className="text-slate-500 mt-2 text-[15px] leading-relaxed">K-Means clustering of 12 kecamatan. Real data, safer city.</p>
      </div>

      <div className="anim-fade-up flex items-center gap-4" style={{ animationDelay: '0.08s' }}>
        <div className="font-extrabold text-slate-900 leading-none text-[3.5rem] tabular-nums shrink-0">
          {riskCount('Risiko Tinggi')}<span className="text-slate-300 text-3xl">/12</span>
        </div>
        <div>
          <div className="text-slate-800 text-sm font-semibold">Kecamatan berisiko tinggi</div>
          <div className="text-red-600 text-[13px] leading-snug mt-0.5">
            {fmt(highRiskAffected)} dari {fmt(TOTALS.affected)} catatan kelurahan terdampak (2021, 2024, 2025) ada di zona ini
          </div>
        </div>
      </div>

      <CtaCard />
    </div>
  );
}
