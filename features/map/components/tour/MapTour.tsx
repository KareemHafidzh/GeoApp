'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { STEPS } from './tourSteps';
import { computeLayout, EASE, type Layout } from './tourLayout';
import GestureDemo from './GestureDemo';
import TourCard from './TourCard';

const STORAGE_KEY = 'bekasigis_map_tour_done';

interface MapTourProps {
  /** Membuka/menutup laci sidebar supaya langkah yang menunjuk sidebar terlihat di HP. */
  setSidebarOpen: (open: boolean) => void;
  /** Peta aktif, dipakai untuk mendeteksi gerakan pada langkah praktik. */
  mapInstance: MapLibreMap | null;
  sidebarOpen: boolean;
  sidebarHidden: boolean;
  /** Menggeser legenda masuk (false) atau keluar (true), supaya tidak menutupi peta saat langkah praktik. */
  setLegendHidden: (hidden: boolean) => void;
}

// Panduan penggunaan peta: muncul otomatis saat kunjungan pertama dan bisa diputar ulang lewat tombol "?".
export default React.memo(function MapTour({ setSidebarOpen, mapInstance, sidebarOpen, sidebarHidden, setLegendHidden }: MapTourProps) {
  // Komponen ini hanya berjalan di browser (ssr:false), jadi localStorage aman dibaca di sini.
  const [active, setActive] = useState(() => {
    try {
      return !localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });
  const [step, setStep] = useState(0);
  const [layout, setLayout] = useState<Layout | null>(null);
  // Kartu baru ditampilkan setelah elemen langkah ini selesai digulir ke layar.
  const [revealedStep, setRevealedStep] = useState(-1);
  // Langkah praktik yang gerakannya sudah berhasil dilakukan pengguna.
  const [doneStep, setDoneStep] = useState(-1);
  const cardRef = useRef<HTMLDivElement>(null);
  const lastSerialized = useRef('');

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  // Buka/tutup sidebar sesuai langkah; legenda dimunculkan untuk langkahnya sendiri dan disembunyikan saat langkah praktik.
  useEffect(() => {
    if (!active) return;
    setSidebarOpen(current.sidebar);
    if (current.selector === 'legend') setLegendHidden(false);
    else if (current.interactive) setLegendHidden(true);
  }, [active, step, current.sidebar, current.selector, current.interactive, setSidebarOpen, setLegendHidden]);

  // Tiap ganti langkah: gulir elemen ke layar, lalu tampilkan kartu setelah laci dan sorotan selesai bergerak.
  useEffect(() => {
    if (!active) return;
    // Di HP laci sidebar butuh ±300 ms untuk terbuka sebelum isinya bisa digulir.
    const drawerDelay = current.sidebar && window.innerWidth < 1024 ? 320 : 0;
    const scrollTimer = setTimeout(() => {
      if (current.selector) {
        document
          .querySelector(`[data-tour="${current.selector}"]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    }, drawerDelay);
    const revealTimer = setTimeout(() => setRevealedStep(step), drawerDelay + (current.selector ? 420 : 80));
    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(revealTimer);
    };
  }, [active, step, current.selector, current.sidebar]);

  const finish = useCallback(() => {
    setActive(false);
    setSidebarOpen(false);
    setLegendHidden(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* abaikan */
    }
  }, [setSidebarOpen, setLegendHidden]);

  const start = useCallback(() => {
    setStep(0);
    setActive(true);
  }, []);

  const next = useCallback(() => {
    if (isLast) finish();
    else setStep((s) => s + 1);
  }, [isLast, finish]);

  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  // Ukur ulang tiap frame agar sorotan dan kartu tetap menempel saat sidebar bergeser atau digulir.
  useLayoutEffect(() => {
    if (!active) return;
    let raf = 0;
    const loop = () => {
      const next = computeLayout(current.selector, cardRef.current);
      const serialized = JSON.stringify(next);
      if (serialized !== lastSerialized.current) {
        lastSerialized.current = serialized;
        setLayout(next);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, step, current.selector]);

  // Pintasan keyboard: Esc untuk lewati, panah kiri/kanan untuk pindah langkah.
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

  // Langkah praktik "putar": dianggap berhasil bila peta diputar >18° atau dimiringkan >12°.
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

  // Langkah praktik "klik": dianggap berhasil saat pengguna mengklik zona risiko.
  useEffect(() => {
    if (!active || current.interactive !== 'click' || !mapInstance) return;
    const onZoneClick = () => setDoneStep(step);
    mapInstance.on('click', 'risk-fills', onZoneClick);
    return () => {
      mapInstance.off('click', 'risk-fills', onZoneClick);
    };
  }, [active, step, current.interactive, mapInstance]);

  // Tombol "?" mengambang untuk memutar ulang panduan; selalu tampil.
  const helpButton = (
    <button
      onClick={start}
      aria-label="Buka panduan penggunaan peta"
      title="Panduan Penggunaan"
      className={`absolute bottom-12 left-4 ${sidebarHidden ? '' : 'lg:left-[352px]'} z-50 flex items-center justify-center w-11 h-11 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full shadow-lg text-[#0aab8a] hover:bg-[#0aab8a] hover:text-white transition-all ${sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
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
  const rect = layout?.rect ?? null;

  return (
    <>
      {helpButton}

      {/* Latar gelap dilewati pada langkah praktik agar peta tetap terang dan bisa disentuh. */}
      {!interactive && (
        <>
          {/* Penahan klik layar penuh agar peta tidak tersentuh selama panduan. */}
          <div className="fixed inset-0 z-[60]" />

          {/* Sorotan: kotak transparan dengan bayangan besar yang menggelapkan sisa layar. */}
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

      {interactive && revealed && <GestureDemo kind={current.interactive!} />}

      <TourCard
        cardRef={cardRef}
        step={current}
        index={step}
        total={STEPS.length}
        layout={layout}
        revealed={revealed}
        done={doneStep === step}
        onSkip={finish}
        onBack={back}
        onNext={next}
      />
    </>
  );
});
