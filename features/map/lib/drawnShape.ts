import { area } from '@turf/area';
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon';
import { centerOfMass } from '@turf/center-of-mass';
import type { Feature, MultiPolygon, Polygon } from 'geojson';
import type { DrawnAreaInfo } from '@/features/map/types';

// Cari area gambar di bawah titik, lalu hitung luas dan titik tengahnya dari geometri asli Geoman
// (bukan dari queryRenderedFeatures, yang terpotong per tile sehingga luasnya kurang ±4–5%).
export function drawnShapeAt(shapes: Feature[], lng: number, lat: number): { key: string; info: DrawnAreaInfo } | null {
  const shape = shapes.find((f) =>
    (f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon') &&
    booleanPointInPolygon([lng, lat], f as Feature<Polygon | MultiPolygon>));
  if (!shape) return null;
  const m2 = area(shape);
  const [longitude, latitude] = centerOfMass(shape).geometry.coordinates;
  return {
    key: String(shape.id ?? JSON.stringify(shape.geometry)),
    info: { longitude, latitude, areaKm: (m2 / 1e6).toFixed(3), areaM: m2.toLocaleString(undefined, { maximumFractionDigits: 2 }) },
  };
}
