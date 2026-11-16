'use client';

import React from 'react';
import { RISK_LEVELS } from '@/features/map/constants';

interface MapLegendProps {
  hiddenRisks: string[];
  toggleRisk: (label: string) => void;
  hidden: boolean;
  setHidden: (hidden: boolean | ((h: boolean) => boolean)) => void;
}

export default React.memo(function MapLegend({ hiddenRisks, toggleRisk, hidden, setHidden }: MapLegendProps) {

  return (
    <div data-tour="legend" className={`absolute top-4 right-4 z-10 w-[260px] max-w-[calc(100vw-7.5rem)] bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-200 flex flex-col gap-3 transition-transform duration-300 ease-in-out ${hidden ? 'translate-x-[calc(100%+1rem)]' : ''}`}>
      {/* Tab on the card's left edge: rides along with it, so it stays on screen as the handle to slide back. */}
      <button
        onClick={() => setHidden((h) => !h)}
        aria-label={hidden ? 'Tampilkan legenda' : 'Sembunyikan legenda'}
        className="absolute top-3 -left-8 flex items-center justify-center w-8 h-10 bg-white/95 backdrop-blur-md border border-r-0 border-slate-200 rounded-l-xl shadow-lg text-slate-700 hover:bg-slate-50 transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${hidden ? 'rotate-180' : ''}`}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase" style={{ fontFamily: 'Syne, sans-serif' }}>
        Informasi Risiko Bencana
      </h3>
      {/* ponytail: wording mirrors the offline K-Means inputs (RISK_FACTORS) — update when the model changes. */}
      <div className="flex flex-col gap-2 text-[12px] text-slate-600 leading-relaxed">
        <p className="text-[13px] font-medium">Warna membandingkan 12 kecamatan di Kota Bekasi.</p>
        <p><strong className="text-red-700">Risiko lebih tinggi</strong> jika daerahnya rawan bencana, penduduknya padat, dan banyak sekolah.</p>
        <p><strong className="text-emerald-700">Risiko lebih rendah</strong> jika banyak rumah sakit dan puskesmas.</p>
        <p>Riwayat banjir dan longsor tidak ikut dihitung. Hijau bukan berarti bebas bencana.</p>
        <p className="text-[11px] text-slate-400">Sumber: BPS Kota Bekasi, BNPB (inaRISK).</p>
      </div>
      <p className="text-[11px] text-slate-400 font-medium -mb-1">Klik kelas risiko untuk menyaring peta.</p>
      <div className="flex flex-col gap-2.5 mt-1">
        {RISK_LEVELS.map((level) => {
          const visible = !hiddenRisks.includes(level.label);
          return (
            <button
              key={level.label}
              onClick={() => toggleRisk(level.label)}
              aria-pressed={visible}
              className={`flex items-center gap-3 p-2 rounded-lg border text-left transition-all ${visible ? 'bg-slate-50 border-slate-100 hover:border-slate-300' : 'bg-white border-dashed border-slate-200 opacity-45'}`}>
              <span className="w-3.5 h-3.5 rounded-full shadow-sm shrink-0" style={{ background: level.color }}></span>
              <span className={`text-xs font-bold text-slate-800 ${visible ? '' : 'line-through'}`} style={{ fontFamily: 'Syne, sans-serif' }}>{level.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
