import React from 'react';
import Link from 'next/link';

export default function Navbar({ isScrolled }: { isScrolled: boolean }) {
    return (
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 h-[68px] transition-all duration-300 ${
          isScrolled
            ? 'bg-white/93 backdrop-blur-xl border-b border-slate-100 shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}>
        
        <Link href="/" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <polygon points="16,2 29,9.5 29,22.5 16,30 3,22.5 3,9.5" fill="none" stroke="#0f172a" strokeWidth="1.8" />
            <circle cx="16" cy="16" r="3" fill="#0f172a" />
          </svg>
          <span className="font-bold text-[13px] tracking-[0.06em] text-slate-800" style={{ fontFamily: 'Syne, sans-serif' }}>BEKASIGIS</span>
        </Link>
        
        {/* Nav */}
        <nav className="flex items-center gap-9">
          {['About', 'Features', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-underline text-slate-500 hover:text-slate-900 transition-colors duration-200 text-[11.5px] tracking-[0.1em] uppercase"
              style={{ fontFamily: 'DM Mono, monospace' }}>
              {item}
            </a>
          ))}

          {/* Divider */}
          <div className="w-px h-4 bg-slate-200" />

          <Link
            href="/map"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-[13px] font-bold rounded-[9px] tracking-wide transition-all duration-200 hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-lg"
            style={{ fontFamily: 'Syne, sans-serif' }}>
            Open Map
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M8 3.5l3 3-3 3"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </nav>
      </header>
    );
};