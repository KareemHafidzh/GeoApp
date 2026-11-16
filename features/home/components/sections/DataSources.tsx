'use client';

import { useState } from 'react';

const datasets = [
  {
    id: 'geospatial',
    title: 'Indonesia Geospasial',
    description: 'Sumber batas wilayah kelurahan dan kecamatan Kota Bekasi. Batas inilah yang membentuk area berwarna pada peta.',
    url: 'https://www.indonesia-geospasial.com/',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    )
  },
  {
    id: 'bps',
    title: 'Kota Bekasi Dalam Angka 2026',
    description: 'Diterbitkan BPS Kota Bekasi. Berisi data 2025 tiap kecamatan: jumlah penduduk, luas wilayah, fasilitas kesehatan, sekolah, dan jumlah kelurahan yang terdampak bencana pada 2021, 2024, dan 2025. Data penduduk, fasilitas kesehatan, dan sekolah dipakai untuk menentukan tingkat risiko. Data kelurahan terdampak hanya ditampilkan saat kamu mengklik wilayah di peta.',
    url: 'https://bekasikota.bps.go.id/',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
    )
  },
  {
    id: 'inarisk',
    title: 'inaRISK BNPB',
    description: 'inaRISK dari BNPB (Badan Nasional Penanggulangan Bencana) menyediakan indeks tingkat bahaya bencana (skala 0–1). Rata-rata dari sebelas jenis bahaya di tiap kecamatan dipakai sebagai salah satu dasar penentuan tingkat risiko.',
    url: 'https://inarisk.bnpb.go.id/',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 2 20h20z"></path>
        <line x1="12" y1="10" x2="12" y2="14"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    )
  },
  {
    id: 'osm',
    title: 'OpenStreetMap',
    description: 'Sumber titik lokasi sekolah dan puskesmas, serta mesin pencarian lokasi (Nominatim). Peta dasar CARTO Positron juga dibuat dari data OSM.',
    url: 'https://www.openstreetmap.org/',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
        <line x1="9" y1="3" x2="9" y2="21"></line>
        <line x1="15" y1="3" x2="15" y2="21"></line>
      </svg>
    )
  }
];

export default function DataSources() {
  const [activeDataset, setActiveDataset] = useState(datasets[0]);

  return (
    <section id="data-sources" className="relative py-10 px-5 sm:px-8 lg:px-12">
      <div className="relative z-10 max-w-[1240px] mx-auto w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#0aab8a] uppercase font-bold mb-4" 
               style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.12em' }}>
            <span className="w-8 h-px bg-[#0aab8a]" />
            Sumber Data
            <span className="w-8 h-px bg-[#0aab8a]" />
          </div>
          <h2 className="font-extrabold text-slate-900 leading-[1.1] text-4xl"
              style={{ fontFamily: 'Syne, sans-serif' }}>
            Data dari Sumber Terpercaya
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Description */}
          <div className="bg-white/70 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-slate-200/60 shadow-sm transition-all duration-500 ease-in-out h-full flex flex-col justify-center">
            <div className="w-16 h-16 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-6 transition-colors duration-300">
              {activeDataset.icon}
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
              {activeDataset.title}
            </h3>
            <p className="text-slate-500 leading-relaxed text-lg mb-8 min-h-[120px]">
              {activeDataset.description}
            </p>
            <div>
              <a 
                href={activeDataset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#0aab8a] font-semibold hover:text-emerald-700 transition-colors"
              >
                Kunjungi Situs Sumber
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column: Dataset Selectors */}
          <div className="flex flex-col gap-4">
            {datasets.map((dataset) => {
              const isActive = activeDataset.id === dataset.id;
              return (
                <button
                  key={dataset.id}
                  onClick={() => setActiveDataset(dataset)}
                  className={`flex items-center gap-6 p-6 rounded-2xl border transition-all duration-300 text-left w-full ${
                    isActive 
                      ? 'bg-slate-900 border-slate-900 shadow-xl -translate-x-2' 
                      : 'bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0 ${
                    isActive ? 'bg-[#0aab8a] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {dataset.icon}
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-slate-900'
                    }`} style={{ fontFamily: 'Syne, sans-serif' }}>
                      {dataset.title}
                    </h4>
                    <p className={`text-sm mt-1 transition-colors duration-300 ${
                      isActive ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {isActive ? 'Sedang ditampilkan' : 'Klik untuk melihat detail'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
