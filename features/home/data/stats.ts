// ponytail: angka beranda dirangkum manual dari public/spatial_risk.geojson; cek dengan `node tools/check-home-stats.mjs`.
// affected/floods/landslides = jumlah kelurahan terdampak (BPS Podes) 2021 + 2024 + 2025, bukan jumlah kejadian.

export type RiskLabel = 'Risiko Tinggi' | 'Risiko Sedang' | 'Risiko Rendah';

export const KECAMATAN: { name: string; risk: RiskLabel; affected: number; floods: number; landslides: number; density: number }[] = [
  { name: 'Bekasi Selatan', risk: 'Risiko Tinggi', affected: 15, floods: 14, landslides: 1, density: 13506 },
  { name: 'Jatiasih',       risk: 'Risiko Sedang', affected: 13, floods: 10, landslides: 3, density: 11300 },
  { name: 'Bekasi Timur',   risk: 'Risiko Tinggi', affected: 12, floods: 12, landslides: 0, density: 17829 },
  { name: 'Bekasi Barat',   risk: 'Risiko Rendah', affected: 10, floods: 10, landslides: 0, density: 19135 },
  { name: 'Bekasi Utara',   risk: 'Risiko Tinggi', affected: 9,  floods: 8,  landslides: 1, density: 16844 },
  { name: 'Bantar Gebang',  risk: 'Risiko Sedang', affected: 9,  floods: 9,  landslides: 0, density: 5861 },
  { name: 'Rawa Lumbu',     risk: 'Risiko Tinggi', affected: 9,  floods: 9,  landslides: 0, density: 13417 },
  { name: 'Pondok Gede',    risk: 'Risiko Rendah', affected: 9,  floods: 9,  landslides: 0, density: 14488 },
  { name: 'Pondok Melati',  risk: 'Risiko Tinggi', affected: 8,  floods: 7,  landslides: 1, density: 11950 },
  { name: 'Medan Satria',   risk: 'Risiko Tinggi', affected: 8,  floods: 8,  landslides: 0, density: 12261 },
  { name: 'Mustika Jaya',   risk: 'Risiko Sedang', affected: 7,  floods: 6,  landslides: 1, density: 9884 },
  { name: 'Jatisampurna',   risk: 'Risiko Sedang', affected: 2,  floods: 0,  landslides: 2, density: 6664 },
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

// Tahun yang tercatat di sumber data (2022–2023 tidak tersedia).
export const FLOODS_BY_YEAR = [{ year: '2021', value: 45 }, { year: '2024', value: 25 }, { year: '2025', value: 32 }];
export const LANDSLIDES_BY_YEAR = [{ year: '2021', value: 6 }, { year: '2024', value: 3 }, { year: '2025', value: 0 }];
