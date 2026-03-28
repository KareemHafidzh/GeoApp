export default function Features() {
  const features = [
    {
      title: 'Interactive WebGIS',
      desc: 'High-performance vector tile rendering powered by MapLibre GL JS for smooth panning and zooming.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
      )
    },
    {
      title: 'K-Means ML Clustering',
      desc: 'Automated categorization of disaster risk zones (High, Medium, Low) using Python and K-Means algorithms.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      )
    },
    {
      title: 'Real-time Area Calc',
      desc: 'Instant, precise calculation of administrative land area in hectares utilizing Turf.js geospatial math.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="relative py-10 px-12">
      <div className="relative z-10 max-w-[1240px] mx-auto w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#0aab8a] uppercase font-bold mb-4" 
               style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.12em' }}>
            <span className="w-8 h-px bg-[#0aab8a]" />
            Core Capabilities
            <span className="w-8 h-px bg-[#0aab8a]" />
          </div>
          <h2 className="font-extrabold text-slate-900 leading-[1.1] text-4xl"
              style={{ fontFamily: 'Syne, sans-serif' }}>
            System Features
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-6 group-hover:bg-[#0aab8a] transition-colors duration-300">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
                {feat.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}