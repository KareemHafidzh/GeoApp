'use client';

import dynamic from "next/dynamic";

// Halaman peta; MapLibre dan PMTiles butuh browser, jadi dimuat tanpa SSR.
const MapDashboard = dynamic(() => import("@/features/map/components/MapDashboard"), {
  ssr: false,
  loading: () => <div className="w-full h-dvh bg-gray-100 flex items-center justify-center">Loading Map...</div>
});

export default function MapPage() {
  return (
    <MapDashboard />
  );
}