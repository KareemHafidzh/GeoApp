export default function Contact() {
  return (
    <section id="contact" className="relative py-10 px-12 border-t border-slate-100/30">
      <div className="relative z-10 max-w-[800px] mx-auto w-full text-center">
        
        <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 rotate-3">
          <span className="text-2xl">👋</span>
        </div>

        <h2 className="font-extrabold text-slate-900 leading-[1.1] text-4xl md:text-5xl mb-6"
            style={{ fontFamily: 'Syne, sans-serif' }}>
          Let's Build Something <br className="hidden md:block" />
          <span className="text-[#0aab8a]">Amazing Together.</span>
        </h2>
        
        <p className="text-slate-500 text-lg mb-10 max-w-[600px] mx-auto">
          Hi, I'm Kareem Abdul Hafidzh. I specialize in Software Engineering, building dynamic platforms from iOS apps to modern Next.js web dashboards.
        </p>

        {/* Social Links */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="mailto:your.email@example.com" 
             className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-md">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            Email Me
          </a>
          
          <a href="https://github.com/yourusername" target="_blank" rel="noreferrer"
             className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:border-slate-300 hover:text-slate-900 hover:-translate-y-0.5 transition-all shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            GitHub
          </a>

          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer"
             className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:border-[#0a66c2] hover:text-[#0a66c2] hover:-translate-y-0.5 transition-all shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}