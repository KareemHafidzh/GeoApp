'use client';

import { useEffect, useState } from 'react';
import type { FeatureCollection, Point } from 'geojson';

// Ambil satu file GeoJSON titik (RS, puskesmas, sekolah) dari folder public saat peta dibuka.
export function useGeoJson(url: string) {
  const [data, setData] = useState<FeatureCollection<Point> | null>(null);
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error(`Gagal memuat ${url}:`, err));
  }, [url]);
  return data;
}
