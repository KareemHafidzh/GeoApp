'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

/**
 * Guided onboarding tour for the map dashboard.
 *
 * Renders a dimmed backdrop with a spotlight cutout around the active target
 * element plus a tooltip card (with arrow) that walks the user through the main
 * features. All copy is in Bahasa Indonesia. Targets are matched via
 * `data-tour="<id>"` attributes placed on the relevant components.
 *
 * Behaviour notes:
 * - For sidebar steps the target is scrolled into view (and the drawer opened on
 *   mobile) *before* the card is revealed, so the spotlight never lands on a
 *   half-clipped section.
 * - The spotlight and card glide between sections with CSS transitions.
 *
 * Shows automatically on first visit (persisted in localStorage); can be
 * replayed anytime via the floating help button.
 */

const STORAGE_KEY = 'bekasigis_map_tour_done';
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

type TourStep = {
  /** `data-tour` value to spotlight, or null for a centered welcome/closing card. */
  selector: string | null;
  title: string;
  body: string;
  /** Whether the sidebar drawer should be open during this step (mobile/tablet). */
  sidebar: boolean;
  /** Hands-on step: undim the map, show a gesture demo, and detect the gesture. */
  interactive?: 'rotate' | 'click';
};

const STEPS: TourStep[] = [
  {
    selector: null,
    title: 'Selamat Datang di BekasiGIS 👋',
    body: 'Peta interaktif zona risiko bencana Kota Bekasi. Yuk ikuti panduan singkat ini untuk mengenal fitur-fiturnya.',
    sidebar: false,
  },
  {
    selector: 'sidebar',
    title: 'Panel Kontrol',
    body: 'Semua pengaturan ada di panel ini. Pada layar kecil, buka panel lewat tombol menu (☰) di pojok kiri atas.',
    sidebar: true,
  },
  {
    selector: 'search',
    title: 'Cari Lokasi',
    body: 'Ketik nama tempat lalu tekan tombol cari. Peta akan otomatis terbang ke lokasi yang kamu cari di sekitar Bekasi.',
    sidebar: true,
  },
  {
    selector: 'mapset',
    title: 'Atur Lapisan Peta',
    body: 'Nyalakan atau matikan lapisan: zona risiko, batas kecamatan/kelurahan, serta titik rumah sakit dan sekolah sesuai kebutuhan.',
    sidebar: true,
  },
  {
    selector: 'measure',
    title: 'Alat Pengukuran',
    body: 'Gambar titik, garis, atau area di peta untuk mengukur jarak dan luas wilayah. Tekan tombol hapus untuk membersihkan gambar.',
    sidebar: true,
  },
  {
    selector: 'legend',
    title: 'Keterangan Risiko',
    body: 'Warna pada peta menunjukkan tingkat risiko bencana, mulai dari Low Risk (hijau) hingga Very High Risk (merah tua).',
    sidebar: false,
  },
  {
    selector: null,
    title: 'Putar & Miringkan Peta 🧭',
    body: 'Ayo coba langsung! Tahan klik kanan mouse lalu geser — atau gunakan dua jari di layar sentuh — untuk memutar arah dan memiringkan peta ke tampilan 3D. Tombol kompas di kanan bawah mengembalikan peta ke arah utara.',
    sidebar: false,
    interactive: 'rotate',
  },
  {
    selector: null,
    title: 'Klik Wilayah untuk Detail 🗺️',
    body: 'Coba sekarang! Klik atau ketuk salah satu zona berwarna pada peta untuk membuka detail wilayah: jumlah penduduk, fasilitas, dan riwayat bencana.',
    sidebar: false,
    interactive: 'click',
  },
];

const PAD = 8; // spotlight padding around target
const GAP = 14; // gap between target and tooltip

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'center';

interface Layout {
  rect: { top: number; left: number; width: number; height: number } | null;
  tip: { top: number; left: number };
  placement: Placement;
  arrow: number; // offset of arrow along the relevant tooltip edge (px)
}

interface MapTourProps {
  /** Opens/closes the sidebar drawer so steps targeting it are visible on mobile. */
  setSidebarOpen: (open: boolean) => void;
  /** Live map instance — used by the interactive rotate/tilt step. */
  mapInstance: MapLibreMap | null;
}

export default function MapTour({ setSidebarOpen, mapInstance }: MapTourProps) {
  // Auto-start on first visit. Component is client-only (parent uses ssr:false),
  // so localStorage is safe to read during initialization.
  const [active, setActive] = useState(() => {
    try {
      return !localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });
  const [step, setStep] = useState(0);
  const [layout, setLayout] = useState<Layout | null>(null);
  // Index of the step whose card has finished scrolling into view. The card is
  // shown only when this matches `step`, so switching steps hides it instantly
  // (no synchronous reset needed) until the new target is in place.
  const [revealedStep, setRevealedStep] = useState(-1);
  // Step index at which the user successfully performed the interactive gesture
  // (rotated the map, or opened a zone's detail popup).
  const [doneStep, setDoneStep] = useState(-1);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const lastSerialized = useRef('');

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  // Keep the sidebar drawer in sync with the current step (affects mobile only;
  // on desktop the sidebar is always visible via CSS).
  useEffect(() => {
    if (active) setSidebarOpen(current.sidebar);
  }, [active, step, current.sidebar, setSidebarOpen]);

  // On each step: hide the card, scroll the target into view, then reveal. The
  // spotlight (a CSS-transitioned box) glides toward the target meanwhile.
  useEffect(() => {
    if (!active) return;

    const isDesktop = window.innerWidth >= 1024;
    // On mobile the drawer needs ~300ms to slide open before we can scroll it.
    const drawerDelay = current.sidebar && !isDesktop ? 320 : 0;

    const scrollTimer = setTimeout(() => {
      if (current.selector) {
        document
          .querySelector(`[data-tour="${current.selector}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    }, drawerDelay);

    // Reveal after the drawer + scroll + spotlight glide have settled.
    const revealTimer = setTimeout(
      () => setRevealedStep(step),
      drawerDelay + (current.selector ? 420 : 80)
    );

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(revealTimer);
    };
  }, [active, step, current.selector, current.sidebar]);

  const finish = useCallback(() => {
    setActive(false);
    setSidebarOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  }, [setSidebarOpen]);

  const start = useCallback(() => {
    setStep(0);
    setActive(true);
  }, []);

  const next = useCallback(() => {
    if (isLast) finish();
    else setStep((s) => s + 1);
  }, [isLast, finish]);

  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  // Reposition the spotlight + tooltip every frame while active so it stays
  // glued to its target during scrolling and the sidebar slide animation.
  const measure = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let rect: Layout['rect'] = null;
    if (current.selector) {
      const el = document.querySelector(`[data-tour="${current.selector}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          rect = {
            top: r.top - PAD,
            left: r.left - PAD,
            width: r.width + PAD * 2,
            height: r.height + PAD * 2,
          };
        }
      }
    }

    const tt = tooltipRef.current?.getBoundingClientRect();
    const ttW = tt?.width ?? 320;
    const ttH = tt?.height ?? 200;

    const clampH = (x: number) => Math.max(12, Math.min(x, vw - ttW - 12));
    const clampV = (y: number) => Math.max(12, Math.min(y, vh - ttH - 12));

    let placement: Placement = 'center';
    let top = (vh - ttH) / 2;
    let left = (vw - ttW) / 2;
    let arrow = 0;

    if (rect) {
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const spaceRight = vw - (rect.left + rect.width);
      const spaceBelow = vh - (rect.top + rect.height);

      if (spaceRight >= ttW + GAP) {
        placement = 'right';
        left = rect.left + rect.width + GAP;
        top = clampV(cy - ttH / 2);
        arrow = cy - top;
      } else if (spaceBelow >= ttH + GAP) {
        placement = 'bottom';
        top = rect.top + rect.height + GAP;
        left = clampH(cx - ttW / 2);
        arrow = cx - left;
      } else if (rect.top >= ttH + GAP) {
        placement = 'top';
        top = rect.top - GAP - ttH;
        left = clampH(cx - ttW / 2);
        arrow = cx - left;
      } else if (rect.left >= ttW + GAP) {
        placement = 'left';
        left = rect.left - GAP - ttW;
        top = clampV(cy - ttH / 2);
        arrow = cy - top;
      } else {
        placement = 'center';
        top = clampV((vh - ttH) / 2);
        left = clampH((vw - ttW) / 2);
      }

      // Keep the arrow within the tooltip edge.
      const max = (placement === 'left' || placement === 'right' ? ttH : ttW) - 18;
      arrow = Math.max(18, Math.min(arrow, max));
    }

    const nextLayout: Layout = { rect, tip: { top, left }, placement, arrow };
    const serialized = JSON.stringify(nextLayout);
    if (serialized !== lastSerialized.current) {
      lastSerialized.current = serialized;
      setLayout(nextLayout);
    }
  }, [current.selector]);

  useLayoutEffect(() => {
    if (!active) return;
    let raf = 0;
    const loop = () => {
      measure();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, step, measure]);

  // Keyboard shortcuts: Esc skips, arrows navigate.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') next();
      else if (e.key === 'ArrowLeft') back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, finish, next, back]);

  // Interactive "rotate" step: watch the map for a real rotate/tilt gesture.
  useEffect(() => {
    if (!active || current.interactive !== 'rotate' || !mapInstance) return;
    const startBearing = mapInstance.getBearing();
    const startPitch = mapInstance.getPitch();
    const onMove = () => {
      let db = Math.abs(mapInstance.getBearing() - startBearing) % 360;
      if (db > 180) db = 360 - db;
      const dp = Math.abs(mapInstance.getPitch() - startPitch);
      if (db > 18 || dp > 12) setDoneStep(step);
    };
    mapInstance.on('rotate', onMove);
    mapInstance.on('pitch', onMove);
    return () => {
      mapInstance.off('rotate', onMove);
      mapInstance.off('pitch', onMove);
    };
  }, [active, step, current.interactive, mapInstance]);

  // Interactive "click" step: confirm when the user clicks a risk zone.
  useEffect(() => {
    if (!active || current.interactive !== 'click' || !mapInstance) return;
    const onZoneClick = () => setDoneStep(step);
    mapInstance.on('click', 'risk-fills', onZoneClick);
    return () => {
      mapInstance.off('click', 'risk-fills', onZoneClick);
    };
  }, [active, step, current.interactive, mapInstance]);

  // Floating help button to (re)play the tour — always rendered.
  const helpButton = (
    <button
      onClick={start}
      aria-label="Buka panduan penggunaan peta"
      title="Panduan Penggunaan"
      className="absolute bottom-12 left-4 z-50 flex items-center justify-center w-11 h-11 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full shadow-lg text-[#0aab8a] hover:bg-[#0aab8a] hover:text-white transition-colors"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    </button>
  );

  if (!active) return helpButton;

  const revealed = revealedStep === step;
  const interactive = !!current.interactive;
  const done = doneStep === step;
  const rect = layout?.rect ?? null;
  const tip = layout?.tip ?? { top: -9999, left: -9999 };
  const placement = layout?.placement ?? 'center';
  const arrow = layout?.arrow ?? 0;

  // Arrow positioning relative to the tooltip card.
  const arrowStyle: React.CSSProperties = { position: 'absolute' };
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

  // Initial slide offset for the card, coming from the target's direction.
  const hiddenTransform =
    placement === 'right'
      ? 'translateX(-16px)'
      : placement === 'left'
        ? 'translateX(16px)'
        : placement === 'bottom'
          ? 'translateY(-16px)'
          : 'translateY(16px)';

  return (
    <>
      {helpButton}

      {/* Backdrop. Skipped on the interactive step so the map stays bright and the
          user can actually perform the gesture on it. */}
      {!interactive && (
        <>
          {/* Full-screen click blocker (keeps clicks off the map during the tour). */}
          <div className="fixed inset-0 z-[60]" />

          {/* Spotlight: a transparent box whose huge box-shadow dims everything else.
              CSS transitions make it glide smoothly between sections. */}
          {rect ? (
            <div
              className="fixed z-[60] pointer-events-none rounded-2xl"
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                boxShadow: '0 0 0 9999px rgba(15,23,42,0.55)',
                border: '2px solid #0aab8a',
                transition: `top 420ms ${EASE}, left 420ms ${EASE}, width 420ms ${EASE}, height 420ms ${EASE}`,
              }}
            />
          ) : (
            <div className="fixed inset-0 z-[60] pointer-events-none" style={{ background: 'rgba(15,23,42,0.55)' }} />
          )}
        </>
      )}

      {/* Interactive gesture demo (pointer-events-none so the map underneath
          stays usable while the user tries the gesture). */}
      {interactive && revealed && (
        <div className="fixed inset-0 z-[61] pointer-events-none flex items-center justify-center">
          {current.interactive === 'rotate' ? (
            <div className="flex items-center gap-6 sm:gap-8 -translate-y-16 anim-fade-in">
              {/* Right-click + drag */}
              <div className="flex flex-col items-center gap-3">
                <svg width="58" height="96" viewBox="0 0 60 96" fill="none">
                  {/* drag track */}
                  <line x1="14" y1="86" x2="46" y2="86" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 6" />
                  <path d="M14 86 l5 -4 M14 86 l5 4" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M46 86 l-5 -4 M46 86 l-5 4" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="30" cy="86" r="4.5" fill="#0aab8a" style={{ animation: 'tourDragX 2s ease-in-out infinite' }} />
                  {/* mouse body */}
                  <rect x="12" y="6" width="36" height="64" rx="18" fill="white" stroke="#334155" strokeWidth="2.5" />
                  {/* right button highlight */}
                  <path d="M30 6 A18 18 0 0 1 48 24 L48 34 L30 34 Z" fill="#0aab8a" style={{ animation: 'tourPulse 1.6s ease-in-out infinite' }} />
                  <line x1="30" y1="8" x2="30" y2="34" stroke="#94a3b8" strokeWidth="2" />
                  <rect x="27" y="12" width="6" height="10" rx="3" fill="#94a3b8" />
                </svg>
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold backdrop-blur-sm" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Klik kanan + geser
                </span>
              </div>

              <span className="text-white text-sm font-extrabold drop-shadow-md -translate-y-3" style={{ fontFamily: 'Syne, sans-serif' }}>
                atau
              </span>

              {/* Two-finger rotate */}
              <div className="flex flex-col items-center gap-3">
                <svg width="92" height="96" viewBox="0 0 96 96" fill="none">
                  <circle cx="48" cy="48" r="30" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="3 6" />
                  <circle cx="48" cy="48" r="2.5" fill="#94a3b8" />
                  <g style={{ animation: 'tourSwing 2.6s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }}>
                    <circle cx="48" cy="18" r="9" fill="#0aab8a" stroke="white" strokeWidth="2.5" />
                    <circle cx="48" cy="78" r="9" fill="#0aab8a" stroke="white" strokeWidth="2.5" />
                  </g>
                </svg>
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold backdrop-blur-sm" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Dua jari diputar
                </span>
              </div>
            </div>
          ) : (
            // Click / tap a zone
            <div className="flex flex-col items-center gap-3 -translate-y-16 anim-fade-in">
              <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                {/* expanding ripples */}
                <circle cx="48" cy="54" r="20" fill="none" stroke="#0aab8a" strokeWidth="2.5" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'tourRipple 1.8s ease-out infinite' }} />
                <circle cx="48" cy="54" r="20" fill="none" stroke="#0aab8a" strokeWidth="2.5" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'tourRipple 1.8s ease-out infinite', animationDelay: '0.6s' }} />
                <circle cx="48" cy="54" r="5" fill="#0aab8a" />
                {/* cursor pressing onto the target */}
                <g style={{ animation: 'tourTapPress 1.8s ease-in-out infinite' }}>
                  <path d="M47 50 L47 74 L53 68 L57.5 77 L60.5 75.5 L56 66.5 L63.5 66.5 Z" fill="white" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
                </g>
              </svg>
              <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold backdrop-blur-sm" style={{ fontFamily: 'Syne, sans-serif' }}>
                Klik / ketuk wilayah
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tooltip card. Pinned bottom-center on the interactive step, otherwise
          anchored to its target. */}
      <div
        ref={tooltipRef}
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
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#0aab8a]" style={{ fontFamily: 'DM Mono, monospace' }}>
            Langkah {step + 1} dari {STEPS.length}
          </span>
          <button
            onClick={finish}
            className="text-[12px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Lewati
          </button>
        </div>

        {/* Content keyed by step so it re-plays the slide-in on each change. */}
        <div key={step} style={{ animation: `tourContentIn 360ms ${EASE} both` }}>
          <h3 className="text-[17px] font-extrabold text-slate-900 mb-1.5 leading-snug" style={{ fontFamily: 'Syne, sans-serif' }}>
            {current.title}
          </h3>
          <p className="text-[13px] text-slate-600 leading-relaxed font-medium">{current.body}</p>

          {/* Live feedback for the hands-on steps. */}
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
                  {current.interactive === 'click'
                    ? 'Mantap! Detail wilayah berhasil dibuka 🎉'
                    : 'Mantap! Sudut peta berhasil diubah 🎉'}
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#0aab8a] animate-blink" />
                  {current.interactive === 'click'
                    ? 'Klik salah satu wilayah berwarna…'
                    : 'Menunggu kamu mencoba…'}
                </>
              )}
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mt-4 mb-4">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-5 bg-[#0aab8a]' : 'w-1.5 bg-slate-200'}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={back}
            disabled={step === 0}
            className="px-4 py-2 text-[13px] font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Kembali
          </button>
          <button
            onClick={next}
            className={`flex-1 px-4 py-2 text-[13px] font-bold rounded-xl bg-[#0aab8a] text-white hover:bg-[#088c71] transition-all ${interactive && done ? 'ring-2 ring-emerald-300 ring-offset-1' : ''}`}
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {isLast ? 'Selesai' : 'Selanjutnya'}
          </button>
        </div>
      </div>
    </>
  );
}
