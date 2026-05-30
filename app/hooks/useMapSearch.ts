'use client';

import { useState, useCallback } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';

export function useMapSearch(mapRef: React.RefObject<MapRef | null>) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}+Bekasi&format=json&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        mapRef.current?.flyTo({ center: [parseFloat(lon), parseFloat(lat)], zoom: 14 });
      } else {
        alert('Lokasi tidak ditemukan di Bekasi.');
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchQuery, mapRef]);

  return { searchQuery, setSearchQuery, handleSearch };
}
