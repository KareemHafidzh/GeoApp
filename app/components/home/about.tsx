'use client';

// No more scrollY prop needed here!
export default function About() {
  return (
    // Removed the border-t, bg-white, and overflow-hidden
    <section id="about" className="relative py-10 px-12">
      
      {/* Content Container */}
      <div className="relative z-10 max-w-[1240px] mx-auto w-full">
        
        {/* Section Header */}
        <div className="mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[#0aab8a] uppercase font-bold mb-4" 
               style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '0.12em' }}>
            <span className="w-8 h-px bg-[#0aab8a]" />
            About The Project
          </div>
          <h2 className="font-extrabold text-slate-900 leading-[1.1] tracking-[-0.02em] text-4xl md:text-5xl"
              style={{ fontFamily: 'Syne, sans-serif' }}>
            Transforming Data into <br />
            <span className="text-slate-400">Actionable Intelligence.</span>
          </h2>
        </div>

        {/* Two-Column Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          
          {/* Left Text */}
          <div className="space-y-6 text-slate-500 leading-relaxed" style={{ fontSize: 16 }}>
            <p>
              BekasiGIS was developed to address the growing need for accurate, accessible, and dynamic disaster risk mapping in Kota Bekasi. By leveraging modern web technologies and geospatial data, we aim to provide local authorities and citizens with clear insights into vulnerable zones.
            </p>
            <p>
              Using <strong>Machine Learning (K-Means Clustering)</strong>, our system analyzes multi-variable data from Shapefiles (.SHP) to group districts into High, Medium, and Low risk categories. This automated approach ensures that resource allocation and emergency planning are driven by pure data.
            </p>
          </div>

          {/* Right Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0aab8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Multi-Layer Mapping</h3>
              <p className="text-sm text-slate-500">View administrative boundaries intersecting with education and risk data.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Data-Driven Insights</h3>
              <p className="text-sm text-slate-500">Calculate exact land area (Hectares) automatically via Turf.js.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}