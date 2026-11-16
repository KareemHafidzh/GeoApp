// Animasi contoh gerakan pada langkah praktik: putar/miringkan peta, atau ketuk wilayah.
export default function GestureDemo({ kind }: { kind: 'rotate' | 'click' }) {
  return (
    <div className="fixed inset-0 z-[61] pointer-events-none flex items-start pt-[110px] sm:pt-0 sm:items-center justify-center">
      {kind === 'rotate' ? (
        <div className="flex items-center gap-6 sm:gap-8 sm:-translate-y-16 anim-fade-in">
          {/* Mouse: tahan klik kanan lalu geser. */}
          <div className="flex flex-col items-center gap-3">
            <svg width="58" height="96" viewBox="0 0 60 96" fill="none">
              <line x1="14" y1="86" x2="46" y2="86" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 6" />
              <path d="M14 86 l5 -4 M14 86 l5 4" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M46 86 l-5 -4 M46 86 l-5 4" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="30" cy="86" r="4.5" fill="#0aab8a" style={{ animation: 'tourDragX 2s ease-in-out infinite' }} />
              <rect x="12" y="6" width="36" height="64" rx="18" fill="white" stroke="#334155" strokeWidth="2.5" />
              <path d="M30 6 A18 18 0 0 1 48 24 L48 34 L30 34 Z" fill="#0aab8a" style={{ animation: 'tourPulse 1.6s ease-in-out infinite' }} />
              <line x1="30" y1="8" x2="30" y2="34" stroke="#94a3b8" strokeWidth="2" />
              <rect x="27" y="12" width="6" height="10" rx="3" fill="#94a3b8" />
            </svg>
            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold backdrop-blur-sm">
              Klik kanan + geser
            </span>
          </div>

          <span className="text-white text-sm font-extrabold drop-shadow-md -translate-y-3">
            atau
          </span>

          {/* Layar sentuh: putar dengan dua jari. */}
          <div className="flex flex-col items-center gap-3">
            <svg width="92" height="96" viewBox="0 0 96 96" fill="none">
              <circle cx="48" cy="48" r="30" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="3 6" />
              <circle cx="48" cy="48" r="2.5" fill="#94a3b8" />
              <g style={{ animation: 'tourSwing 2.6s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }}>
                <circle cx="48" cy="18" r="9" fill="#0aab8a" stroke="white" strokeWidth="2.5" />
                <circle cx="48" cy="78" r="9" fill="#0aab8a" stroke="white" strokeWidth="2.5" />
              </g>
            </svg>
            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold backdrop-blur-sm">
              Dua jari diputar
            </span>
          </div>
        </div>
      ) : (
        // Ketuk salah satu zona berwarna.
        <div className="flex flex-col items-center gap-3 sm:-translate-y-16 anim-fade-in">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
            <circle cx="48" cy="54" r="20" fill="none" stroke="#0aab8a" strokeWidth="2.5" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'tourRipple 1.8s ease-out infinite' }} />
            <circle cx="48" cy="54" r="20" fill="none" stroke="#0aab8a" strokeWidth="2.5" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'tourRipple 1.8s ease-out infinite', animationDelay: '0.6s' }} />
            <circle cx="48" cy="54" r="5" fill="#0aab8a" />
            <g style={{ animation: 'tourTapPress 1.8s ease-in-out infinite' }}>
              <path d="M47 50 L47 74 L53 68 L57.5 77 L60.5 75.5 L56 66.5 L63.5 66.5 Z" fill="white" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
            </g>
          </svg>
          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold backdrop-blur-sm">
            Klik / ketuk wilayah
          </span>
        </div>
      )}
    </div>
  );
}
