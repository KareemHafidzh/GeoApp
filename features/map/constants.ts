// Peta dasar CartoCDN Positron dan posisi awal kamera (pusat Kota Bekasi).
export const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

export const DEFAULT_VIEW_STATE = {
  longitude: 106.9896,
  latitude: -6.2335,
  zoom: 11,
};

// Kelas Tailwind untuk lencana risiko di kartu detail; samakan dengan RISK_LEVELS bila kelas berubah.
export function getRiskColor(label: string): string {
  switch (label) {
    case 'Risiko Tinggi': return 'bg-red-50 text-red-700 border-red-200';
    case 'Risiko Sedang': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'Risiko Rendah': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

// Sumber tunggal warna kelas risiko: dipakai legenda, filter, dan warna isi zona di peta.
export const RISK_LEVELS = [
  { color: '#d73027', label: 'Risiko Tinggi' },
  { color: '#fee08b', label: 'Risiko Sedang' },
  { color: '#1a9850', label: 'Risiko Rendah' },
];

// Tujuh input K-Means (notebook skripsi GeoAI4). `median` = median 12 kecamatan, titik tengah RobustScaler,
// jadi "di atas median" berarti menaikkan skor risiko (menurunkan bila sign = -1).
// ponytail: median ditulis manual dari spatial_risk.geojson; hitung ulang bila data model diperbarui.
export const RISK_FACTORS = [
  { key: 'Indeks_Bahaya_Bencana', label: 'Rawan bencana', median: 0.1967, sign: 1, digits: 3 },
  { key: 'Density', label: 'Warga per km²', median: 12839, sign: 1, digits: 0 },
  { key: 'Laju Pertumbuhan', label: 'Pertumbuhan warga', median: 0.465, sign: 1, digits: 2, unit: '%/thn' },
  { key: 'SMAK_per_100k', label: 'SMA/SMK', median: 10.52, sign: 1, digits: 1 },
  { key: 'SMP_per_100k', label: 'SMP', median: 11.4, sign: 1, digits: 1 },
  { key: 'Guru_per_100k', label: 'Guru', median: 412.4, sign: 1, digits: 0 },
  { key: 'Health_per_100k', label: 'RS & puskesmas', median: 3.47, sign: -1, digits: 1 },
];

// ponytail: diisi manual, perbarui saat tiles/GeoJSON dibuat ulang.
export const DATA_UPDATED = 'November 2026';
export const DATA_CREDITS = `Data: Indonesia Geospasial · BPS Kota Bekasi (Kota Bekasi Dalam Angka 2026) · inaRISK BNPB · OpenStreetMap · Diperbarui ${DATA_UPDATED}`;

// Nomor darurat nasional; tambahkan nomor BPBD Kota Bekasi setelah diverifikasi.
export const EMERGENCY_CONTACTS = [
  { label: 'Panggilan Darurat', number: '112' },
  { label: 'Ambulans (PSC)', number: '119' },
  { label: 'Pemadam Kebakaran', number: '113' },
  { label: 'Polisi', number: '110' },
  { label: 'Basarnas (SAR)', number: '115' },
];
