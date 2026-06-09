export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="relative border-t border-slate-200/60 bg-white/50 backdrop-blur-md">
      <div className="max-w-[1240px] mx-auto w-full px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2 grayscale opacity-80">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <polygon points="16,2 29,9.5 29,22.5 16,30 3,22.5 3,9.5" fill="none" stroke="#0f172a" strokeWidth="1.8" />
            <circle cx="16" cy="16" r="3" fill="#0f172a" />
          </svg>
          <div className="font-bold text-[13px] tracking-[0.06em] text-slate-800" style={{ fontFamily: 'Syne, sans-serif' }}>
            BEKASIGIS
          </div>
        </div>

        {/* Copyright */}
        <div className="text-slate-400 text-[11px] tracking-wide" style={{ fontFamily: 'DM Mono, monospace' }}>
          &copy; {year} Kareem Abdul Hafidzh. All rights reserved.
        </div>

      </div>
    </footer>
  );
}