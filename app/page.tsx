'use client';

import Navbar from './components/layout/Navbar';
import Hero from './components/home/hero';
import About from './components/home/about';
import Features from './components/home/features';
import Contact from './components/home/contact';
import Footer from './components/layout/Footer';
import { useScrollY } from './hooks/useScrollY';

export default function Home() {
  const scrollY = useScrollY();
  const navScrolled = scrollY > 30;

  return (
    <div className="relative bg-white min-h-screen overflow-hidden">
      
      {/* ── UNIFIED GLOBAL BACKGROUND ── */}
      <div className="absolute top-[-112px] right-[-112px] w-[760px] h-[760px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, #e0faf4 0%, transparent 62%)', transform: `translateY(${scrollY * 0.11}px)` }} />
      <div className="absolute top-[40vh] -left-16 w-[360px] h-[360px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, #fff1f0 0%, transparent 65%)', transform: `translateY(${scrollY * -0.05}px)` }} />
      <div className="absolute top-[80vh] -left-24 w-[560px] h-[560px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, #fff7ed 0%, transparent 62%)', transform: `translateY(${scrollY * -0.07}px)` }} />

      <svg className="fixed inset-0 w-full h-full opacity-[0.22] pointer-events-none z-0">
        <defs><pattern id="bg-dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.9" fill="#94a3b8" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#bg-dots)" />
      </svg>
      <svg className="fixed top-0 right-[40%] h-full w-0.5 opacity-[0.06] pointer-events-none z-0">
        <line x1="1" y1="0" x2="1" y2="100%" stroke="#0f172a" strokeWidth="1" strokeDasharray="6 6" />
      </svg>

      {/* ── CONTENT ── */}
      <Navbar isScrolled={navScrolled} />
      
      <div className="relative z-10">
        <Hero scrollY={scrollY} />
        <About />
        <Features />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}