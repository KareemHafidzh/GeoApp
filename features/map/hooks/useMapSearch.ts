'use client';

import { useState, useCallback } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';

// Kota Bekasi bbox (left,top,right,bottom): extent of public/{rumah_sakit,puskesmas,school}.geojson
// (106.909..107.039, -6.396..-6.175) plus ~0.005° margin.
const BEKASI_VIEWBOX = '106.904,-6.170,107.045,-6.401';

export interface SearchResult {
  name?: string;
  display_name: string;
  lat: string;
  lon: string;
}

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

  // The list stays open so the user can switch between results.
  const selectResult = useCallback((r: SearchResult) => {
    mapRef.current?.flyTo({ center: [parseFloat(r.lon), parseFloat(r.lat)], zoom: 14 });
    setActiveResult(r);
  }, [mapRef]);

  // ponytail: submit-only search; Nominatim's usage policy forbids autocomplete.
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
        // Fly straight to the best match: the first result whose own name contains the query, else Nominatim's top hit.
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
