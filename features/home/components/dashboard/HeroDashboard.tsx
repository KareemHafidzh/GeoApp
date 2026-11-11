'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import { DATA_UPDATED } from '@/features/map/constants';
import KeyStats from './KeyStats';
import AffectedRanking from './AffectedRanking';
import RiskDistribution from './RiskDistribution';
import KpiRow from './KpiRow';
import { mono } from './ui';

// MapLibre needs the browser; loaded as its own chunk after the cards render.
const RiskGlobe = dynamic(() => import('./RiskGlobe'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-sky-100/40 animate-pulse" />,
});

// memo: page.tsx re-renders on every scroll (navbar/parallax); nothing here depends on it.
export default memo(function HeroDashboard() {
  return (
    <section className="relative px-5 sm:px-8 lg:px-12 pt-28 pb-16">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
        <KeyStats />

        {/* Center: fixed 3D view of the risk zones */}
        <div className="lg:col-span-6 order-2 relative h-[420px] sm:h-[540px] lg:h-auto lg:min-h-[640px] anim-fade-in">
          <div className="absolute inset-0 rounded-[36px] overflow-hidden bg-gradient-to-b from-sky-50 to-white">
            <RiskGlobe />
          </div>
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full px-3 py-1.5 shadow-sm pointer-events-none"
            style={{ ...mono, fontSize: 10, color: '#0aab8a' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-blink" /> 3D · tinggi = kelurahan terdampak
          </div>
        </div>

        <div className="lg:col-span-3 order-3 flex flex-col gap-4">
          <AffectedRanking />
          <RiskDistribution />
        </div>

        <KpiRow />

        <p className="lg:col-span-12 order-5 text-[10px] text-slate-400 text-center" style={mono}>Data diperbarui {DATA_UPDATED}</p>
      </div>
    </section>
  );
});
