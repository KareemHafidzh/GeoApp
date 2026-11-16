import type { CSSProperties, RefObject } from 'react';
import { EASE, type Layout } from './tourLayout';
import type { TourStep } from './tourSteps';

interface TourCardProps {
  cardRef: RefObject<HTMLDivElement | null>;
  step: TourStep;
  index: number;
  total: number;
  layout: Layout | null;
  revealed: boolean;
  done: boolean;
  onSkip: () => void;
  onBack: () => void;
  onNext: () => void;
}

// Kartu panduan: judul, isi, titik kemajuan, dan tombol Kembali / Selanjutnya.
export default function TourCard({ cardRef, step, index, total, layout, revealed, done, onSkip, onBack, onNext }: TourCardProps) {
  const interactive = !!step.interactive;
  const isLast = index === total - 1;
  const tip = layout?.tip ?? { top: -9999, left: -9999 };
  const placement = layout?.placement ?? 'center';
  const arrow = layout?.arrow ?? 0;

  // Posisi panah kecil yang menunjuk ke elemen yang disorot.
  const arrowStyle: CSSProperties = { position: 'absolute' };
  const arrowBox = 'w-3 h-3 bg-white border-slate-200 rotate-45';
  let arrowClass = '';
  if (placement === 'right') {
    Object.assign(arrowStyle, { left: -6, top: arrow - 6 });
    arrowClass = 'border-l border-b';
  } else if (placement === 'left') {
    Object.assign(arrowStyle, { right: -6, top: arrow - 6 });
    arrowClass = 'border-r border-t';
  } else if (placement === 'bottom') {
    Object.assign(arrowStyle, { top: -6, left: arrow - 6 });
    arrowClass = 'border-l border-t';
  } else if (placement === 'top') {
    Object.assign(arrowStyle, { bottom: -6, left: arrow - 6 });
    arrowClass = 'border-r border-b';
  }

  // Kartu masuk dari arah elemen yang disorot.
  const hiddenTransform =
    placement === 'right'
      ? 'translateX(-16px)'
      : placement === 'left'
        ? 'translateX(16px)'
        : placement === 'bottom'
          ? 'translateY(-16px)'
          : 'translateY(16px)';

  return (
    <div
      ref={cardRef}
      className="fixed z-[62] w-[320px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-200 p-5"
      style={
        interactive
          ? {
              left: '50%',
              bottom: 24,
              transform: revealed ? 'translateX(-50%)' : 'translateX(-50%) translateY(16px)',
              opacity: revealed ? 1 : 0,
              transition: `opacity 280ms ease, transform 380ms ${EASE}`,
            }
          : {
              top: tip.top,
              left: tip.left,
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'none' : hiddenTransform,
              transition: `opacity 280ms ease, transform 380ms ${EASE}`,
            }
      }
    >
      {!interactive && placement !== 'center' && (
        <span className={`${arrowBox} ${arrowClass}`} style={arrowStyle} />
      )}

      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#0aab8a] font-mono">
          Langkah {index + 1} dari {total}
        </span>
        <button
          onClick={onSkip}
          className="text-[12px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          Lewati
        </button>
      </div>

      {/* Diberi key per langkah supaya animasi masuk diputar ulang tiap ganti langkah. */}
      <div key={index} style={{ animation: `tourContentIn 360ms ${EASE} both` }}>
        <h3 className="text-[17px] font-extrabold text-slate-900 mb-1.5 leading-snug">
          {step.title}
        </h3>
        <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{step.body}</p>

        {/* Status langsung untuk langkah praktik: menunggu, atau berhasil. */}
        {interactive && (
          <div
            className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-bold ${done ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}
            style={{ transition: 'background-color 300ms ease, color 300ms ease' }}
          >
            {done ? (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {step.interactive === 'click'
                  ? 'Mantap! Detail wilayah berhasil dibuka 🎉'
                  : 'Mantap! Sudut peta berhasil diubah 🎉'}
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#0aab8a] animate-blink" />
                {step.interactive === 'click'
                  ? 'Klik salah satu wilayah berwarna…'
                  : 'Menunggu kamu mencoba…'}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 mt-4 mb-4">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-5 bg-[#0aab8a]' : 'w-1.5 bg-slate-200'}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          disabled={index === 0}
          className="px-4 py-2 text-[13px] font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Kembali
        </button>
        <button
          onClick={onNext}
          className={`flex-1 px-4 py-2 text-[13px] font-bold rounded-xl bg-[#0aab8a] text-white hover:bg-[#088c71] transition-all ${interactive && done ? 'ring-2 ring-emerald-300 ring-offset-1' : ''}`}
        >
          {isLast ? 'Selesai' : 'Selanjutnya'}
        </button>
      </div>
    </div>
  );
}
