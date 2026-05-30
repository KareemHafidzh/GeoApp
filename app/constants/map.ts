export const TILE_SERVER_URL = process.env.NEXT_PUBLIC_TILE_SERVER_URL || 'http://localhost:8080';

export const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

export const DEFAULT_VIEW_STATE = {
  longitude: 106.9896,
  latitude: -6.2335,
  zoom: 11,
};

export function getRiskColor(label: string): string {
  switch (label) {
    case 'Very High Risk': return 'bg-red-50 text-red-700 border-red-200';
    case 'High Risk': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Medium Risk': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'Low Risk': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}
