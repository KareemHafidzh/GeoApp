export const TILE_SERVER_URL = process.env.NEXT_PUBLIC_TILE_SERVER_URL || 'http://localhost:8080';

export const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

export const DEFAULT_VIEW_STATE = {
  longitude: 106.9896,
  latitude: -6.2335,
  zoom: 11,
};

export function getRiskColor(label: string): string {
  switch (label) {
    case 'Risiko Tinggi': return 'bg-red-50 text-red-700 border-red-200';
    case 'Risiko Sedang': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'Risiko Rendah': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

// Single source for risk class colors: drives the legend/filter and the MapLibre fill paint.
export const RISK_LEVELS = [
  { color: '#d73027', label: 'Risiko Tinggi' },
  { color: '#fee08b', label: 'Risiko Sedang' },
  { color: '#1a9850', label: 'Risiko Rendah' },
];

// ponytail: hand-maintained, bump when the tiles/GeoJSON are regenerated.
export const DATA_UPDATED = 'Oktober 2026';
export const DATA_CREDITS = `Data: Indonesia Geospatial · BPS Kota Bekasi (Kota Bekasi Dalam Angka 2026) · OpenStreetMap · Diperbarui ${DATA_UPDATED}`;

// National emergency numbers (Indonesia). Add the local BPBD Kota Bekasi line once verified.
export const EMERGENCY_CONTACTS = [
  { label: 'Panggilan Darurat', number: '112' },
  { label: 'Ambulans (PSC)', number: '119' },
  { label: 'Pemadam Kebakaran', number: '113' },
  { label: 'Polisi', number: '110' },
  { label: 'Basarnas (SAR)', number: '115' },
];
