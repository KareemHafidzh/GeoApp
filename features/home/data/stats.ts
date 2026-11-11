// ponytail: aggregated by hand from public/spatial_risk.geojson (per-kecamatan props, deduped across kelurahan).
// Re-run the aggregation when the tiles/GeoJSON are regenerated (same moment you bump DATA_UPDATED).
// affected/floods/landslides = number of kelurahan affected (BPS Podes), summed over 2021, 2024, 2025 — NOT incident counts.

export type RiskLabel = 'Risiko Tinggi' | 'Risiko Sedang' | 'Risiko Rendah';

export const KECAMATAN: { name: string; risk: RiskLabel; affected: number; floods: number; landslides: number; density: number; lng: number; lat: number }[] = [
  { name: 'Bekasi Selatan', risk: 'Risiko Tinggi', affected: 15, floods: 14, landslides: 1, density: 13506, lng: 106.9775, lat: -6.2602 },
  { name: 'Jatiasih',       risk: 'Risiko Sedang', affected: 13, floods: 10, landslides: 3, density: 11300, lng: 106.9533, lat: -6.3078 },
  { name: 'Bekasi Timur',   risk: 'Risiko Tinggi', affected: 12, floods: 12, landslides: 0, density: 17829, lng: 107.0186, lat: -6.2410 },
  { name: 'Bekasi Barat',   risk: 'Risiko Rendah', affected: 10, floods: 10, landslides: 0, density: 19135, lng: 106.9648, lat: -6.2339 },
  { name: 'Bekasi Utara',   risk: 'Risiko Tinggi', affected: 9,  floods: 8,  landslides: 1, density: 16844, lng: 107.0076, lat: -6.2044 },
  { name: 'Bantar Gebang',  risk: 'Risiko Sedang', affected: 9,  floods: 9,  landslides: 0, density: 5861,  lng: 106.9912, lat: -6.3416 },
  { name: 'Rawa Lumbu',     risk: 'Risiko Tinggi', affected: 9,  floods: 9,  landslides: 0, density: 13417, lng: 106.9956, lat: -6.2801 },
  { name: 'Pondok Gede',    risk: 'Risiko Rendah', affected: 9,  floods: 9,  landslides: 0, density: 14488, lng: 106.9292, lat: -6.2724 },
  { name: 'Pondok Melati',  risk: 'Risiko Tinggi', affected: 8,  floods: 7,  landslides: 1, density: 11950, lng: 106.9283, lat: -6.3114 },
  { name: 'Medan Satria',   risk: 'Risiko Tinggi', affected: 8,  floods: 8,  landslides: 0, density: 12261, lng: 106.9811, lat: -6.1999 },
  { name: 'Mustika Jaya',   risk: 'Risiko Sedang', affected: 7,  floods: 6,  landslides: 1, density: 9884,  lng: 107.0185, lat: -6.3091 },
  { name: 'Jatisampurna',   risk: 'Risiko Sedang', affected: 2,  floods: 0,  landslides: 2, density: 6664,  lng: 106.9254, lat: -6.3637 },
];

export const TOTALS = {
  population: 2_648_272,
  areaKm2: 213.1,
  affected: 111,
  floods: 102,
  landslides: 9,
  healthFacilities: 104,
  schools: 556,
};

// Recorded years in the dataset (2022–2023 are not in the source).
export const FLOODS_BY_YEAR = [{ year: '2021', value: 45 }, { year: '2024', value: 25 }, { year: '2025', value: 32 }];
export const LANDSLIDES_BY_YEAR = [{ year: '2021', value: 6 }, { year: '2024', value: 3 }, { year: '2025', value: 0 }];
