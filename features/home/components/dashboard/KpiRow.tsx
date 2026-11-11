import Link from 'next/link';
import { KECAMATAN, TOTALS, FLOODS_BY_YEAR, LANDSLIDES_BY_YEAR } from '@/features/home/data/stats';
import { card, fmt, mono, syne } from './ui';

const avgDensity = Math.round(TOTALS.population / TOTALS.areaKm2);
const maxDensity = Math.max(...KECAMATAN.map((k) => k.density));

function MiniBars({ values, color }: { values: { year: string; value: number }[]; color: string }) {
  const max = Math.max(...values.map((v) => v.value), 1);
  return (
    <div className="flex items-end gap-2 h-14 mt-3">
      {values.map((v) => (
        <div key={v.year} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-md" style={{ height: `${Math.max(6, (v.value / max) * 40)}px`, background: color }} />
          <span className="text-[9px] text-slate-400" style={mono}>{v.year}</span>
        </div>
      ))}
    </div>
  );
}

/** Bottom row: four KPI cards plus the call-to-action into /map. */
export default function KpiRow() {
  return (
    <div className="lg:col-span-12 order-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className={`${card} p-5`}>
        <div className="text-xs text-slate-500" style={syne}>Kelurahan Terdampak Banjir</div>
        <div className="font-extrabold text-3xl text-slate-900" style={syne}>{TOTALS.floods}</div>
        <MiniBars values={FLOODS_BY_YEAR} color="#60a5fa" />
      </div>
      <div className={`${card} p-5`}>
        <div className="text-xs text-slate-500" style={syne}>Kelurahan Terdampak Longsor</div>
        <div className="font-extrabold text-3xl text-slate-900" style={syne}>{TOTALS.landslides}</div>
        <MiniBars values={LANDSLIDES_BY_YEAR} color="#f59e0b" />
      </div>
      <div className={`${card} p-5`}>
        <div className="text-xs text-slate-500" style={syne}>Kepadatan rata-rata</div>
        <div className="font-extrabold text-3xl text-slate-900" style={syne}>{fmt(avgDensity)}</div>
        <div className="text-[10px] text-slate-400 mt-1" style={mono}>jiwa / km²</div>
        <div className="flex items-end gap-1 h-12 mt-2">
          {KECAMATAN.map((k) => <div key={k.name} title={k.name} className="flex-1 rounded-sm bg-violet-400/80" style={{ height: `${(k.density / maxDensity) * 100}%` }} />)}
        </div>
      </div>
      <div className={`${card} p-5`}>
        <div className="text-xs text-slate-500" style={syne}>Sekolah (SMP–SMA/K)</div>
        <div className="font-extrabold text-3xl text-slate-900" style={syne}>{fmt(TOTALS.schools)}</div>
        <div className="text-[10px] text-slate-400 mt-1" style={mono}>SMP + SMA/K · BPS</div>
      </div>
      <div className="rounded-3xl p-5 bg-gradient-to-br from-slate-900 to-emerald-900 text-white flex flex-col justify-between sm:col-span-2 lg:col-span-1">
        <div>
          <div className="font-bold text-lg leading-tight" style={syne}>Jelajahi peta risiko interaktif</div>
          <p className="text-white/60 text-xs mt-2" style={mono}>Ukur area, cari faskes terdekat, filter kelas risiko.</p>
        </div>
        <Link href="/map" className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0aab8a] hover:bg-emerald-500 font-bold text-sm transition-colors" style={syne}>
          Open Spatial Map →
        </Link>
      </div>
    </div>
  );
}
