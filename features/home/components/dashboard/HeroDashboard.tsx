'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import { DATA_UPDATED } from '@/features/map/constants';
import KeyStats from './KeyStats';
import AffectedRanking from './AffectedRanking';
import RiskDistribution from './RiskDistribution';
import KpiRow from './KpiRow';

// MapLibre needs the browser; loaded as its own chunk after the cards render.
const RiskGlobe = dynamic(() => import('./RiskGlobe'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-sky-100/40 animate-pulse" />,
});

// Layout: phone = one column; tablet (md) = 2 columns, intro + map full width; desktop (lg) = 3/6/3 + KPI strip, fits one screen.
// memo: page.tsx re-renders on every scroll (navbar/parallax); nothing here depends on it.
export default memo(function HeroDashboard() {
  return (
    <section className="relative font-sans px-5 sm:px-8 lg:px-12 pt-24 lg:pt-28 pb-10">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5">
        <KeyStats />

        {/* Center: fixed 3D view of the risk zones */}
        <div className="md:col-span-2 lg:col-span-6 relative h-[400px] sm:h-[420px] lg:h-[clamp(440px,58vh,540px)] anim-fade-in">
          <div className="absolute inset-0 rounded-[28px] overflow-hidden bg-gradient-to-b from-sky-50 to-white">
            <RiskGlobe />
          </div>
          <div className="absolute top-3 left-3 hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full px-3 py-1 shadow-sm pointer-events-none font-mono text-[11px] text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-blink" /> Tampilan 3D · makin tinggi = makin banyak kelurahan terdampak (3 thn)
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3 grid md:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-5 content-start">
          <AffectedRanking />
          <RiskDistribution />
        </div>

        <KpiRow />

        <p className="md:col-span-2 lg:col-span-12 text-[11px] text-slate-400 text-center font-mono">Data: BPS Kota Bekasi (Kota Bekasi Dalam Angka 2026) · inaRISK BNPB · kelurahan terdampak = jumlah 2021 + 2024 + 2025 · diperbarui {DATA_UPDATED}</p>
      </div>
    </section>
  );
});
