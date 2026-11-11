import type { ReactNode } from 'react';
import { KECAMATAN, TOTALS, FLOODS_BY_YEAR, LANDSLIDES_BY_YEAR } from '@/features/home/data/stats';
import { card, fmt } from './ui';

const avgDensity = Math.round(TOTALS.population / TOTALS.areaKm2);
const maxDensity = Math.max(...KECAMATAN.map((k) => k.density));

function YearBars({ values, color }: { values: { year: string; value: number }[]; color: string }) {
  const max = Math.max(...values.map((v) => v.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-9">
      {values.map((v) => (
        <div key={v.year} className="flex-1 flex flex-col items-center gap-0.5" title={`${v.year}: ${v.value}`}>
          <div className="w-full rounded-sm" style={{ height: `${Math.max(3, (v.value / max) * 24)}px`, background: color }} />
          <span className="text-[10px] text-slate-400 font-mono">{v.year}</span>
        </div>
      ))}
    </div>
  );
}

const TILES: { label: string; value: string; unit?: string; extra: ReactNode }[] = [
  { label: 'Total penduduk', value: `${(TOTALS.population / 1e6).toFixed(2)} jt`, extra: `${TOTALS.areaKm2} km² wilayah` },
  { label: 'Fasilitas kesehatan', value: fmt(TOTALS.healthFacilities), extra: 'RS + puskesmas · BPS' },
  { label: 'Sekolah', value: fmt(TOTALS.schools), extra: 'SMP + SMA/K · BPS' },
  {
    label: 'Kepadatan rata-rata', value: fmt(avgDensity), unit: '/km²',
    extra: (
      <div className="flex items-end gap-0.5 h-6">
        {KECAMATAN.map((k) => <div key={k.name} title={`${k.name}: ${fmt(k.density)}/km²`} className="flex-1 rounded-[2px] bg-violet-400/80" style={{ height: `${(k.density / maxDensity) * 100}%` }} />)}
      </div>
    ),
  },
  { label: 'Kel. terdampak banjir', value: fmt(TOTALS.floods), extra: <YearBars values={FLOODS_BY_YEAR} color="#60a5fa" /> },
  { label: 'Kel. terdampak longsor', value: fmt(TOTALS.landslides), extra: <YearBars values={LANDSLIDES_BY_YEAR} color="#f59e0b" /> },
];

/** Bottom strip: six compact KPI tiles. */
export default function KpiRow() {
  return (
    <div className="md:col-span-2 lg:col-span-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
      {TILES.map((t, i) => (
        <div key={t.label} className={`${card} p-4 flex flex-col justify-between gap-2 anim-fade-up`} style={{ animationDelay: `${0.3 + i * 0.04}s` }}>
          <div>
            <div className="text-xs font-medium text-slate-500">{t.label}</div>
            <div className="font-bold text-2xl text-slate-900 tabular-nums mt-0.5">
              {t.value}{t.unit && <span className="text-sm font-medium text-slate-400"> {t.unit}</span>}
            </div>
          </div>
          {typeof t.extra === 'string' ? <div className="text-xs text-slate-400">{t.extra}</div> : t.extra}
        </div>
      ))}
    </div>
  );
}
