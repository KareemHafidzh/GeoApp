'use client';

import Link from 'next/link';
import MapViz from '../../map/MapViz';

export default function Hero() {
    return (
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white px-12 pb-20">
        {/* ── Parallax color washes (dynamic Y → must be inline) ── */}
        {/* Teal — top right */}
        <div className="absolute -top-28 -right-28 w-[760px] h-[760px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #e0faf4 0%, transparent 62%)',
            transform: `translateY(${scrollY * 0.11}px)`,
          }}
        />
        {/* Amber — bottom left */}
        <div
          className="absolute -bottom-16 -left-24 w-[560px] h-[560px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #fff7ed 0%, transparent 62%)',
            transform: `translateY(${scrollY * -0.07}px)`,
          }}
        />
        {/* Red — mid left */}
        <div
          className="absolute top-[40%] -left-16 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #fff1f0 0%, transparent 65%)',
            transform: `translateY(${scrollY * -0.05}px)`,
          }}
        />

        {/* Background dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.22] pointer-events-none">
          <defs>
            <pattern id="bg-dots" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.9" fill="#94a3b8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg-dots)" />
        </svg>

        {/* Dashed vertical accent */}
        <svg className="absolute top-0 right-[40%] h-full w-0.5 opacity-[0.06] pointer-events-none">
          <line x1="1" y1="0" x2="1" y2="100%"
            stroke="#0f172a" strokeWidth="1" strokeDasharray="6 6" />
        </svg>

        {/* ── Two-column content grid ── */}
        <div className="relative z-10 max-w-[1240px] mx-auto w-full grid grid-cols-2 gap-20 items-center pt-[68px]">

          {/* ────── LEFT: Copy ────── */}
          <div>

            {/* Live badge */}
            <div
              className="anim-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 uppercase mb-7"
              style={{ fontFamily: 'DM Mono, monospace', fontSize: 10.5, letterSpacing: '0.12em' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-blink" />
              Geospatial Intelligence · Kota Bekasi
            </div>

            {/* Headline */}
            <h1
              className="anim-fade-up font-extrabold text-slate-900 leading-[1.03] tracking-[-0.03em] mb-6"
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.6rem, 4.8vw, 4.6rem)', animationDelay: '0.08s' }}
            >
              Disaster Risk<br />
              <span className="reveal-underline text-[#0aab8a]">Mapping</span>{' '}
              <span className="text-slate-300">&amp;</span><br />
              Spatial Analysis
            </h1>

            {/* Description */}
            <p
              className="anim-fade-up text-slate-500 leading-[1.8] max-w-[490px] mb-9"
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, animationDelay: '0.16s' }}
            >
              An interactive platform using{' '}
              <strong className="text-slate-900 font-bold">Shapefile (.SHP) geodata</strong> and{' '}
              <strong className="text-slate-900 font-bold">K-Means ML clustering</strong> to identify
              and visualize disaster-prone zones across all 12 kecamatan of Kota Bekasi.
            </p>

            {/* CTAs */}
            <div className="anim-fade-up flex flex-wrap gap-3 mb-11" style={{ animationDelay: '0.24s' }}>
              <Link href="/map"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-slate-900 text-white font-bold text-[15px] rounded-xl tracking-wide transition-all duration-200 hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-2xl"
                style={{ fontFamily: 'Syne, sans-serif' }}>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <rect x="1.5" y="3" width="14" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5.5 3V1.5M11.5 3V1.5M1.5 7.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="5.5" cy="11" r="1.2" fill="currentColor" />
                  <circle cx="8.5" cy="11" r="1.2" fill="currentColor" />
                  <circle cx="11.5" cy="11" r="1.2" fill="currentColor" />
                </svg>
                Open Spatial Map
              </Link>
              <a
                href="#clusters"
                className="inline-flex items-center gap-2 px-7 py-4 border border-slate-200 text-slate-500 font-semibold text-[14px] rounded-xl tracking-wide transition-all duration-200 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50 hover:-translate-y-0.5"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                View Clusters
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 2v9M3.5 8l3 3 3-3"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Stats row */}
            <div
              className="anim-fade-up flex flex-wrap border-t border-b border-slate-100 py-5 mb-6"
              style={{ animationDelay: '0.32s' }}
            >
              {[
                { value: '12',  label: 'Kecamatan'      },
                { value: '3',   label: 'Risk Clusters'   },
                { value: '97%', label: 'ML Accuracy'     },
                { value: 'SHP', label: 'Shapefile Input' },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`px-6 ${i === 0 ? 'pl-0' : 'border-l border-slate-200'}`}
                >
                  <div
                    className="font-extrabold text-[22px] text-slate-900 leading-none tracking-tight"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-[10px] text-slate-400 uppercase tracking-[0.1em] mt-1"
                    style={{ fontFamily: 'DM Mono, monospace' }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tech chips */}
            <div className="anim-fade-up flex flex-wrap gap-2" style={{ animationDelay: '0.4s' }}>
              {['Shapefile .SHP', 'K-Means', 'Next.js', 'Leaflet.js', 'Python · GeoPandas'].map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-400 text-[11px] tracking-[0.05em] transition-all duration-200 hover:border-[#0aab8a44] hover:text-[#0aab8a] hover:bg-emerald-50 cursor-default"
                  style={{ fontFamily: 'DM Mono, monospace' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ────── RIGHT: Map ────── */}
          {/* Parallax float on scroll → inline transform */}
          <div
            className="anim-fade-in relative"
            style={{ animationDelay: '0.2s', transform: `translateY(${scrollY * -0.07}px)` }}
          >
            {/* Floating card — top left */}
            <div className="animate-float absolute -top-5 -left-8 z-20 flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.10)] min-w-[180px]">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="#0aab8a" strokeWidth="1.5" />
                  <circle cx="9" cy="9" r="2.5" fill="#0aab8a" />
                  <path d="M9 2v2M9 14v2M2 9h2M14 9h2"
                    stroke="#0aab8a" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-[13px] text-slate-900" style={{ fontFamily: 'Syne, sans-serif' }}>
                  K-Means Active
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5" style={{ fontFamily: 'DM Mono, monospace' }}>
                  k = 3 clusters
                </div>
              </div>
            </div>

            {/* Floating card — bottom right */}
            <div className="animate-float-slow absolute -bottom-5 -right-7 z-20 bg-white border border-slate-200 rounded-2xl px-4 py-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.10)]">
              <div className="flex gap-4 mb-2">
                {[
                  { label: 'High', color: '#e8392d', count: 4 },
                  { label: 'Med',  color: '#f0900a', count: 4 },
                  { label: 'Low',  color: '#0aab8a', count: 4 },
                ].map((c) => (
                  <div key={c.label} className="text-center">
                    <div
                      className="font-extrabold text-xl leading-none"
                      style={{ fontFamily: 'Syne, sans-serif', color: c.color }}
                    >
                      {c.count}
                    </div>
                    <div
                      className="text-[9px] text-slate-400 tracking-[0.08em] mt-0.5"
                      style={{ fontFamily: 'DM Mono, monospace' }}
                    >
                      {c.label}
                    </div>
                    <div
                      className="h-[2.5px] rounded mt-1 w-full"
                      style={{ background: c.color }}
                    />
                  </div>
                ))}
              </div>
              <div
                className="text-center text-[9px] text-slate-300 tracking-[0.1em]"
                style={{ fontFamily: 'DM Mono, monospace' }}>
                RISK DISTRIBUTION
              </div>
            </div>

            <MapViz />
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-300"
          style={{ opacity: scrollY > 60 ? 0 : 1 }}
        >
          <span
            className="text-slate-300 tracking-[0.2em]"
            style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}
          >
            SCROLL
          </span>
          <div className="w-6 h-[38px] rounded-xl border border-slate-200 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-sm bg-slate-300 animate-scroll-dot" />
          </div>
        </div>
      </section>
    );
}