'use client';

import dynamic from "next/dynamic";

// Vector-vs-raster FPS benchmark (driven by bench-tools/run-bench.mjs). Not linked from the app.
const BenchMap = dynamic(() => import("./BenchMap"), { ssr: false });

export default function BenchPage() {
  return <BenchMap />;
}
