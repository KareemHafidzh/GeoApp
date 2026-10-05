'use client';

import React, { useState } from 'react';
import { RISK_LEVELS } from '@/app/constants/map';

interface MapLegendProps {
  hiddenRisks: string[];
  toggleRisk: (label: string) => void;
}

export default React.memo(function MapLegend({ hiddenRisks, toggleRisk }: MapLegendProps) {
  // Collapsed by default on small screens, expanded on desktop.
  const [open, setOpen] = useState(() =>
    typeof window === 'undefined' ? true : window.innerWidth >= 1024
  );

  return (
    <div data-tour="legend" className="absolute top-4 right-4 z-10 w-[260px] max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-200 flex flex-col gap-3">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center justify-between gap-3 text-left">
        <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase" style={{ fontFamily: 'Syne, sans-serif' }}>
          Informasi Risiko Bencana
        </h3>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? '' : '-rotate-90'}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
            Peta ini menampilkan zona klasifikasi risiko bencana di wilayah Kota Bekasi. Klasifikasi didasarkan pada tingkat risiko yang dipetakan per wilayah.
          </p>
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
        </>
      )}
    </div>
  );
});
