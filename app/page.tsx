'use client';

import Navbar from '@/features/home/components/layout/Navbar';
import HeroDashboard from '@/features/home/components/dashboard/HeroDashboard';
import HowTo from '@/features/home/components/sections/HowTo';
import About from '@/features/home/components/sections/About';
import Features from '@/features/home/components/sections/Features';
import DataSources from '@/features/home/components/sections/DataSources';
import Contact from '@/features/home/components/sections/Contact';
import Footer from '@/features/home/components/layout/Footer';
import { useScrollY } from '@/features/home/hooks/useScrollY';

// Halaman beranda: hero ringkasan risiko, lalu bagian cara pakai, tentang, fitur, sumber data, dan kontak.
export default function Home() {
  const scrollY = useScrollY();
  const navScrolled = scrollY > 30;

  return (
    <div className="relative bg-white min-h-screen overflow-hidden">
      <Navbar isScrolled={navScrolled} />
      
      <div className="relative z-10">
        <HeroDashboard />
        <HowTo />
        <About />
        <Features />
        <DataSources />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}