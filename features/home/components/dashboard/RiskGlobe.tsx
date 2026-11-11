'use client';

import { useRef, useState } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import type { ExpressionSpecification, StyleSpecification } from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import { RISK_LEVELS } from '@/features/map/constants';
import { KECAMATAN } from '@/features/home/data/stats';
import { RISK_HEX } from './ui';

// Same registration as MapDashboard; re-adding the protocol just overwrites it.
maplibregl.addProtocol('pmtiles', new Protocol().tile);

const RISK_FILL: ExpressionSpecification = ['match', ['get', 'Risk_Label'], ...RISK_LEVELS.flatMap((r) => [r.label, r.color]), '#cbd5e1'] as unknown as ExpressionSpecification;

const BEKASI = { longitude: 106.973, latitude: -6.268, zoom: 10.5, pitch: 52, bearing: -12 };

// ponytail: height = kelurahan affected (3 years summed), exaggerated so it reads at city zoom
const BASE_M = 300, PER_KEL_M = 180;
const heightM = (affected: number) => BASE_M + PER_KEL_M * affected;

// Markers sit on the ground, but blocks in front can hide that spot. Lift each pin by its block's
// on-screen height so it lands on the block's top face. ponytail: flat approximation (ignores perspective),
// good to a few px at this fixed camera; the hover lean shifts it slightly.
const metersPerPx = (zoom: number) => (40075016.686 * Math.cos((BEKASI.latitude * Math.PI) / 180)) / (512 * 2 ** zoom);
const liftPx = (affected: number, zoom: number) => Math.round((heightM(affected) / metersPerPx(zoom)) * Math.sin((BEKASI.pitch * Math.PI) / 180));

// No basemap: only our own PMTiles are fetched (no CARTO tiles, fonts or sprites). Transparent so the card gradient shows.
const STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [{ id: 'bg', type: 'background', paint: { 'background-color': 'rgba(0,0,0,0)' } }],
  light: { anchor: 'viewport', position: [1.3, 210, 40], intensity: 0.35 },
};

const ICONS = {
  flood: <path d="M2 15c2 0 2-1.5 4-1.5S8 15 10 15s2-1.5 4-1.5 2 1.5 4 1.5M2 19c2 0 2-1.5 4-1.5S8 19 10 19s2-1.5 4-1.5 2 1.5 4 1.5M10 3 5 10h10z" />,
  slide: <path d="m2 20 7-12 4 6 2-3 5 9zM14 5l2 2M17 3l1 2" />,
  people: <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a2.5 2.5 0 1 0 0-5M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 14c2.8 0 5 2.2 5 5" />,
};

const by = (name: string) => KECAMATAN.find((k) => k.name === name)!;
const CALLOUTS = [
  // stem = px between pin and card; staggered by hand so the cards don't stack on each other.
  { k: by('Bekasi Barat'),   value: '19.1k/km²', label: 'Terpadat', icon: ICONS.people, stem: 80 },
  { k: by('Bekasi Selatan'), value: '15', label: 'Kel. terdampak', icon: ICONS.flood, stem: 24, phone: true },
  { k: by('Bekasi Timur'),   value: '12', label: 'Kel. banjir', icon: ICONS.flood, stem: 60 },
  { k: by('Jatisampurna'),   value: '2', label: 'Kel. longsor', icon: ICONS.slide, stem: 30, phone: true },
];

// A fixed visualization, not a map: no drag/zoom, the camera only leans a few degrees toward the cursor.
export default function RiskGlobe() {
  const mapRef = useRef<MapRef>(null);
  // ponytail: zoom chosen once by viewport width (component is client-only); phones get a wider view and only the callouts marked `phone`, so they don't collide.
  const [view] = useState(() => (window.innerWidth < 640 ? { ...BEKASI, zoom: 9.8, latitude: -6.262, phone: true } : { ...BEKASI, phone: false }));
  const frame = useRef(0);

  const lean = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;  // -0.5 … 0.5
    const dy = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(frame.current); // ponytail: one camera update per frame, MapLibre only repaints on change
    frame.current = requestAnimationFrame(() =>
      mapRef.current?.jumpTo({ bearing: BEKASI.bearing + dx * 16, pitch: BEKASI.pitch - dy * 10 }));
  };
  const reset = () => {
    cancelAnimationFrame(frame.current);
    mapRef.current?.easeTo({ bearing: BEKASI.bearing, pitch: BEKASI.pitch, duration: 600 });
  };

  return (
    <div className="w-full h-full" onMouseMove={lean} onMouseLeave={reset}>
    <Map
      ref={mapRef}
      initialViewState={view}
      mapStyle={STYLE}
      interactive={false}
      attributionControl={false}
      maxTileCacheSize={20}
      style={{ width: '100%', height: '100%' }}
    >
      <Source id="spatial_risk" type="vector" url="pmtiles:///spatial_risk.pmtiles">
        <Layer id="risk-3d" type="fill-extrusion" source-layer="spatial_risk"
          paint={{
            'fill-extrusion-color': RISK_FILL,
            'fill-extrusion-height': ['+', BASE_M, ['*', PER_KEL_M, ['coalesce', ['get', 'Total Bencana (All Years)'], 0]]],
            'fill-extrusion-opacity': 0.85,
          }} />
      </Source>

      {CALLOUTS.filter((c) => !view.phone || c.phone).map(({ k, value, label, icon, stem }, i) => (
        <Marker key={k.name} longitude={k.lng} latitude={k.lat} anchor="bottom" offset={[0, 6 - liftPx(k.affected, view.zoom)]}>
          <div className="anim-fade-up flex flex-col items-center" style={{ animationDelay: `${0.4 + i * 0.15}s` }}>
            <div className={i % 2 ? 'animate-float-slow' : 'animate-float'}>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-2xl pl-1.5 pr-3 py-1.5 shadow-[0_12px_32px_rgba(15,23,42,0.18)] border border-white">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: RISK_HEX[k.risk] === '#fee08b' ? '#f0a30a' : RISK_HEX[k.risk] }}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                </div>
                <div className="leading-tight">
                  <div className="font-bold text-slate-900 text-[13px] whitespace-nowrap tabular-nums">{value} <span className="font-medium text-slate-500 text-[11px]">{label}</span></div>
                  <div className="text-slate-500 text-[11px] whitespace-nowrap">{k.name}</div>
                </div>
              </div>
            </div>
            <div className="w-px bg-slate-900/30" style={{ height: stem }} />
            <div className="relative w-3 h-3">
              <div className="absolute inset-0 rounded-full animate-pulse-ring" style={{ border: `2px solid ${RISK_HEX[k.risk]}` }} />
              <div className="w-3 h-3 rounded-full border-2 border-white" style={{ background: RISK_HEX[k.risk] }} />
            </div>
          </div>
        </Marker>
      ))}
    </Map>
    </div>
  );
}
