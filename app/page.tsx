'use client';

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./mapComponent"), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-gray-100">Loading Map...</div>
});

export default function Home() {
  return (
    <MapComponent />
  );
}
