'use client';

import { useState } from 'react';

/* ─────────────────────────────────────────────
   TYPES & DATA
───────────────────────────────────────────── */
interface District {
  name: string;
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
  x: number;
  y: number;
  cluster: number;
}

const DISTRICTS: District[] = [
  { name: 'Bekasi Barat',   risk: 'HIGH',   x: 22, y: 38, cluster: 0 },
  { name: 'Bekasi Timur',   risk: 'MEDIUM', x: 68, y: 32, cluster: 1 },
  { name: 'Bekasi Selatan', risk: 'HIGH',   x: 42, y: 62, cluster: 0 },
  { name: 'Bekasi Utara',   risk: 'LOW',    x: 55, y: 18, cluster: 2 },
  { name: 'Pondok Gede',    risk: 'MEDIUM', x: 30, y: 55, cluster: 1 },
  { name: 'Jatiasih',       risk: 'LOW',    x: 72, y: 58, cluster: 2 },
  { name: 'Rawalumbu',      risk: 'HIGH',   x: 60, y: 45, cluster: 0 },
  { name: 'Bantargebang',   risk: 'MEDIUM', x: 78, y: 72, cluster: 1 },
  { name: 'Mustika Jaya',   risk: 'LOW',    x: 84, y: 42, cluster: 2 },
  { name: 'Jatisampurna',   risk: 'HIGH',   x: 46, y: 76, cluster: 0 },
  { name: 'Pondok Melati',  risk: 'MEDIUM', x: 18, y: 68, cluster: 1 },
  { name: 'Medan Satria',   risk: 'LOW',    x: 35, y: 22, cluster: 2 },
];

const RISK_COLOR: Record<string, string> = {
  HIGH:   '#e8392d',
  MEDIUM: '#f0900a',
  LOW:    '#0aab8a',
};

/* ─────────────────────────────────────────────
   MAP VISUALIZATION
───────────────────────────────────────────── */
export default function MapViz() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full rounded-[24px] border border-slate-200 overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.10),0_8px_24px_rgba(0,0,0,0.06)] bg-gradient-to-br from-slate-50 to-slate-100"
        style={{ paddingBottom: '72%' }}>

        {/* Dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none">
          <defs>
            <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#94a3b8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Scanline */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-0 right-0 h-px animate-scanline"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(10,171,138,0.4), transparent)' }} />
        </div>

        {/* Bekasi boundary + connectors */}
        <svg viewBox="0 0 100 72" className="absolute inset-0 w-full h-full">
          <polygon
            points="10,15 90,10 95,36 88,65 55,69 20,63 8,42"
            fill="rgba(10,171,138,0.03)"
            stroke="#cbd5e1"
            strokeWidth="0.8"
            strokeDasharray="3 2"
          />
          {DISTRICTS.map((d, i) =>
            DISTRICTS.slice(i + 1, i + 3).map((d2, j) => (
              <line key={`${i}-${j}`}
                x1={d.x} y1={d.y} x2={d2.x} y2={d2.y}
                stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2 3"
              />
            ))
          )}
        </svg>

        {/* District nodes */}
        {DISTRICTS.map((d, idx) => (
          <div
            key={d.name}
            onMouseEnter={() => setHovered(d.name)}
            onMouseLeave={() => setHovered(null)}
            className="absolute z-10 cursor-pointer"
            style={{ left: `${d.x}%`, top: `${d.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {/* Pulse ring — inline because color is dynamic */}
            <div
              className="absolute -inset-2 rounded-full animate-pulse-ring pointer-events-none"
              style={{
                border: `1.5px solid ${RISK_COLOR[d.risk]}`,
                opacity: hovered === d.name ? 0.7 : 0.2,
                animationDelay: `${idx * 0.22}s`,
              }}
            />
            {/* Dot */}
            <div
              className="rounded-full border-2 border-white transition-all duration-200"
              style={{
                width: hovered === d.name ? 14 : 9,
                height: hovered === d.name ? 14 : 9,
                background: RISK_COLOR[d.risk],
                boxShadow: `0 2px 12px ${RISK_COLOR[d.risk]}66`,
              }}
            />
            {/* Tooltip */}
            {hovered === d.name && (
              <div
                className="absolute z-20 bottom-[130%] left-1/2 -translate-x-1/2 bg-white rounded-lg px-3 py-1.5 whitespace-nowrap text-slate-800"
                style={{
                  border: `1.5px solid ${RISK_COLOR[d.risk]}`,
                  fontSize: 11,
                  fontFamily: 'DM Mono, monospace',
                  boxShadow: `0 8px 24px rgba(0,0,0,0.12), 0 0 0 4px ${RISK_COLOR[d.risk]}18`,
                }}
              >
                <div className="font-semibold mb-0.5" style={{ color: RISK_COLOR[d.risk] }}>{d.name}</div>
                <div className="text-slate-400" style={{ fontSize: 10 }}>Risk: {d.risk} · C{d.cluster + 1}</div>
              </div>
            )}
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-3.5 left-3.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl px-3.5 py-2.5 shadow-sm"
          style={{ fontFamily: 'DM Mono, monospace', fontSize: 10 }}>
          {(['HIGH', 'MEDIUM', 'LOW'] as const).map((r) => (
            <div key={r} className="flex items-center gap-1.5 mb-1 last:mb-0">
              <div className="w-2 h-2 rounded-full" style={{ background: RISK_COLOR[r] }} />
              <span className="text-slate-500">{r}</span>
            </div>
          ))}
        </div>

        {/* Live badge */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full px-3 py-1.5 shadow-sm"
          style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#0aab8a' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-blink" />
          LIVE · {DISTRICTS.length} nodes
        </div>

        {/* Bottom label */}
        <div className="absolute bottom-3.5 right-3.5 text-slate-400 tracking-widest"
          style={{ fontFamily: 'DM Mono, monospace', fontSize: 9 }}>
          KOTA BEKASI · SHP LAYER
        </div>
      </div>
  );
}