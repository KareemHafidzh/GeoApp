'use client';

import dynamic from "next/dynamic";

const MapDashboard = dynamic(() => import("../components/map/MapDashboard"), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-gray-100 flex items-center justify-center">Loading Map...</div>
});

export default function MapPage() {
  return (
    <MapDashboard />
  );
}