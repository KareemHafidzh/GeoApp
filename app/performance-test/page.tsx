'use client';

import dynamic from "next/dynamic";

// Halaman uji performa vektor vs raster vs GeoJSON untuk skripsi (dijalankan tools/run-bench.mjs), tidak ditautkan dari aplikasi.
const BenchMap = dynamic(() => import("./BenchMap"), { ssr: false });

export default function BenchPage() {
  return <BenchMap />;
}
