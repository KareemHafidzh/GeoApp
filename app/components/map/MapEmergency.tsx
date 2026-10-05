'use client';

import { useState } from 'react';
import { nearestPoint, point } from '@turf/turf';
import type { FeatureCollection, Point } from 'geojson';
import { EMERGENCY_CONTACTS } from '@/app/constants/map';

export interface NearestResult {
  from: [number, number];
  to: [number, number];
  name: string;
  km: number;
}

interface MapEmergencyProps {
  facilities: FeatureCollection<Point> | null;
  nearest: NearestResult | null;
  onNearest: (result: NearestResult | null) => void;
  sidebarOpen: boolean;
}

/**
 * Floating "Darurat" button (bottom-left, above the feedback button) with
 * emergency phone numbers and a straight-line nearest-facility finder.
 */
export default function MapEmergency({ facilities, nearest, onNearest, sidebarOpen }: MapEmergencyProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const findNearest = () => {
    if (!facilities?.features.length) return setStatus('Data fasilitas belum dimuat.');
    if (!navigator.geolocation) return setStatus('Browser tidak mendukung geolokasi.');
    setStatus('Mencari lokasi Anda…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const from: [number, number] = [coords.longitude, coords.latitude];
        // ponytail: straight-line distance, not road routing — add OSRM if routes are needed.
        const hit = nearestPoint(point(from), facilities);
        onNearest({
          from,
          to: hit.geometry.coordinates as [number, number],
          name: hit.properties.nama_rs || hit.properties.name || 'Fasilitas',
          km: hit.properties.distanceToPoint,
        });
        setStatus(null);
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? 'Izin lokasi ditolak.' : 'Lokasi tidak dapat ditemukan.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className={`absolute bottom-[10rem] left-4 lg:left-[352px] z-50 flex flex-col items-start gap-2 transition-opacity ${sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {open && (
        <div className="w-[280px] max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl p-4 flex flex-col gap-3">
          <h3 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase" style={{ fontFamily: 'Syne, sans-serif' }}>Kontak Darurat</h3>
          <div className="grid grid-cols-2 gap-2">
            {EMERGENCY_CONTACTS.map((c) => (
              <a key={c.number} href={`tel:${c.number}`} className="flex flex-col p-2 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 transition-colors">
                <span className="text-lg font-extrabold text-red-600 leading-none" style={{ fontFamily: 'DM Mono, monospace' }}>{c.number}</span>
                <span className="text-[11px] font-bold text-slate-600 mt-1">{c.label}</span>
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={findNearest}
              className="w-full py-2.5 bg-[#0aab8a] text-white font-bold text-[13px] rounded-xl hover:bg-[#088c71] transition-colors"
              style={{ fontFamily: 'Syne, sans-serif' }}>
              Cari Faskes Terdekat
            </button>
            {status && <p className="text-[12px] text-slate-500">{status}</p>}
            {nearest && !status && (
              <div className="text-[12px] text-slate-600 leading-relaxed">
                <strong className="text-slate-800">{nearest.name}</strong>
                <br />± {nearest.km.toFixed(2)} km (jarak lurus)
                <button onClick={() => onNearest(null)} className="block mt-1 text-[11px] font-bold text-slate-400 hover:text-slate-600">Hapus garis</button>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2 pl-3 pr-4 py-2.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <span className="text-[13px] font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>Darurat</span>
      </button>
    </div>
  );
}
