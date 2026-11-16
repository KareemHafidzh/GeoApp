'use client';

import { useState, useCallback } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';

// Batas kotak Kota Bekasi (kiri,atas,kanan,bawah): sebaran titik di public/*.geojson ditambah margin ±0,005°.
const BEKASI_VIEWBOX = '106.904,-6.170,107.045,-6.401';

export interface SearchResult {
  name?: string;
  display_name: string;
  lat: string;
  lon: string;
}

// Cari lokasi lewat Nominatim (dibatasi ke Bekasi) lalu terbangkan peta ke hasil terbaik.
export function useMapSearch(mapRef: React.RefObject<MapRef | null>) {
  const [searchQuery, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeResult, setActiveResult] = useState<SearchResult | null>(null);

  const setSearchQuery = useCallback((q: string) => {
    setQuery(q);
    setSearchMessage(null);
    setSearchResults([]);
    setActiveResult(null);
  }, []);

  // Daftar hasil tetap terbuka agar pengguna bisa berpindah antar hasil.
  const selectResult = useCallback((r: SearchResult) => {
    mapRef.current?.flyTo({ center: [parseFloat(r.lon), parseFloat(r.lat)], zoom: 14 });
    setActiveResult(r);
  }, [mapRef]);

  // ponytail: cari hanya saat dikirim; kebijakan Nominatim melarang autocomplete.
  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q || searching) return;
    setSearching(true);
    setSearchMessage(null);
    setSearchResults([]);
    setActiveResult(null);
    try {
      const params = new URLSearchParams({
        q, format: 'json', limit: '5', countrycodes: 'id', viewbox: BEKASI_VIEWBOX, bounded: '1',
      });
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SearchResult[] = await res.json();
      if (data.length === 0) {
        setSearchMessage('Lokasi tidak ditemukan di Bekasi.');
      } else {
        // Langsung terbang ke hasil yang namanya memuat kata kunci, atau ke hasil teratas Nominatim.
        const needle = q.toLowerCase();
        const best = data.find((r) => (r.name || r.display_name.split(',')[0]).toLowerCase().includes(needle)) ?? data[0];
        selectResult(best);
        if (data.length > 1) setSearchResults(data);
      }
    } catch (err) {
      console.error(err);
      setSearchMessage('Pencarian gagal. Periksa koneksi internet lalu coba lagi.');
    } finally {
      setSearching(false);
    }
  }, [searchQuery, searching, selectResult]);

  return { searchQuery, setSearchQuery, handleSearch, searching, searchMessage, searchResults, activeResult, selectResult };
}
