'use client';

import Link from 'next/link';
import MapViz from '../map/MapViz';

export default function Hero({ scrollY }: { scrollY: number }) {
    return (
      <section className="relative min-h-screen flex items-center px-12 pb-10 pt-10">
        
        {/* Two-column content grid */}
        <div className="relative z-10 max-w-[1240px] mx-auto w-full grid grid-cols-2 gap-20 items-center">
          <div>
            <div className="anim-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 uppercase mb-7"
              style={{ fontFamily: 'DM Mono, monospace', fontSize: 10.5, letterSpacing: '0.12em' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-blink" />
              Geospatial Intelligence · Kota Bekasi
            </div>

            <h1 className="anim-fade-up font-extrabold text-slate-900 leading-[1.03] tracking-[-0.03em] mb-6"
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.6rem, 4.8vw, 4.6rem)', animationDelay: '0.08s' }}>
              Disaster Risk<br />
              <span className="reveal-underline text-[#0aab8a]">Mapping</span>{' '}
              <span className="text-slate-300">&amp;</span><br />
              Spatial Analysis
            </h1>

            <p className="anim-fade-up text-slate-500 leading-[1.8] max-w-[490px] mb-9"
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, animationDelay: '0.16s' }}>
              An interactive platform using{' '}
              <strong className="text-slate-900 font-bold">Shapefile (.SHP) geodata</strong> and{' '}
              <strong className="text-slate-900 font-bold">K-Means ML clustering</strong> to identify
              and visualize disaster-prone zones across all 12 kecamatan of Kota Bekasi.
            </p>

            {/* CTAs */}
            <div className="anim-fade-up flex flex-wrap gap-3 mb-11" style={{ animationDelay: '0.24s' }}>
              <Link href="/map" className="inline-flex items-center gap-2.5 px-8 py-4 bg-slate-900 text-white font-bold text-[15px] rounded-xl tracking-wide transition-all duration-200 hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-2xl"
                style={{ fontFamily: 'Syne, sans-serif' }}>
                Open Spatial Map
              </Link>
            </div>
          </div>

          <div className="anim-fade-in relative" style={{ animationDelay: '0.2s', transform: `translateY(${scrollY * -0.07}px)` }}>
            <MapViz />
          </div>
        </div>
      </section>
    );
}