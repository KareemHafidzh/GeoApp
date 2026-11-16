'use client';

import { memo } from 'react';
import { DATA_UPDATED } from '@/features/map/constants';
import KeyStats from './KeyStats';
import AffectedRanking from './AffectedRanking';
import RiskDistribution from './RiskDistribution';
import KpiRow from './KpiRow';

// Hero beranda: HP satu kolom, tablet pembuka lalu dua kartu berdampingan, desktop pembuka di kiri dan kartu di kanan.
// memo: page.tsx render ulang tiap scroll (untuk navbar), sementara isi hero tidak bergantung pada scroll.
export default memo(function HeroDashboard() {
  return (
    <section className="relative font-sans px-5 sm:px-8 lg:px-12 pt-24 lg:pt-28 pb-10">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5">
        <KeyStats />

        <div className="md:col-span-2 lg:col-span-6 grid md:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-5 content-start">
          <AffectedRanking />
          <RiskDistribution />
        </div>

        <KpiRow />

        <p className="md:col-span-2 lg:col-span-12 text-[11px] text-slate-400 text-center font-mono">Data: BPS Kota Bekasi (Kota Bekasi Dalam Angka 2026) · inaRISK BNPB · kelurahan terdampak = jumlah 2021 + 2024 + 2025 · diperbarui {DATA_UPDATED}</p>
      </div>
    </section>
  );
});
