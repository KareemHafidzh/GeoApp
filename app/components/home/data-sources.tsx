'use client';

import { useState } from 'react';

const datasets = [
  {
    id: 'geospatial',
    title: 'Indonesia Geospatial',
    description: 'The Indonesia Geospatial portal serves as the primary national repository for authoritative spatial data. It provides foundational basemaps, administrative boundaries, and essential geographic datasets crucial for accurate regional planning and spatial analysis across the archipelago.',
    url: '#', // dummy link
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    )
  },
  {
    id: 'bps',
    title: 'Bekasi Dalam Angka',
    description: 'Sourced from the Central Bureau of Statistics (BPS), this dataset offers comprehensive socio-economic and demographic statistics specifically tailored for Bekasi City. It is instrumental for assessing population density, infrastructure distribution, and localized developmental metrics.',
    url: '#', // dummy link
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
    )
  },
  {
    id: 'osm',
    title: 'OpenStreetMap',
    description: 'OpenStreetMap (OSM) contributes a rich layer of crowdsourced geographical data. It supplements our core maps with highly detailed, frequently updated information on road networks, local points of interest, and granular urban features that are vital for precision mapping.',
    url: '#', // dummy link
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
    <section id="data-sources" className="relative py-10 px-12">
      <div className="relative z-10 max-w-[1240px] mx-auto w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#0aab8a] uppercase font-bold mb-4" 
               style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.12em' }}>
            <span className="w-8 h-px bg-[#0aab8a]" />
            Data Foundation
            <span className="w-8 h-px bg-[#0aab8a]" />
          </div>
          <h2 className="font-extrabold text-slate-900 leading-[1.1] text-4xl"
              style={{ fontFamily: 'Syne, sans-serif' }}>
            Powered By Reliable Data
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
                Visit Source Website
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
                      {isActive ? 'Currently viewing details' : 'Click to view details'}
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
