

// Isi kartu detail kelurahan yang dibuka saat zona diklik.
export interface PopupInfo {
  longitude: number;
  latitude: number;
  village: string;
  district: string;
  city: string;
  totalRS: number;
  totalSmp: number;
  totalSma: number;
  totalPenduduk: number;
  lajuPertumbuhan: number;
  luasWilayahKm: number;
  riskLabel: string;
  banjir2021: number;
  banjir2024: number;
  banjir2025: number;
  gempa2021: number;
  gempa2024: number;
  gempa2025: number;
  longsor2021: number;
  longsor2024: number;
  longsor2025: number;
  totalBencana: number;
  /** Input model untuk kecamatan ini; `raises` = ikut menaikkan skor risiko. */
  factors: { label: string; value: string; raises: boolean }[];
}

// Isi tooltip titik fasilitas saat kursor di atasnya.
export interface HoverInfo {
  longitude: number;
  latitude: number;
  name: string;
  address: string;
  type: string;
}

// Luas area gambar dan titik tengahnya, tempat kartu luas ditempel.
export interface DrawnAreaInfo {
  longitude: number;
  latitude: number;
  areaKm: string;
  areaM: string;
}

export interface CursorLngLat {
  lng: number;
  lat: number;
}

type DrawMode = 'marker' | 'line' | 'polygon' | 'circle' | 'rectangle' | 'freehand';
// Alat ukur: gambar bentuk baru, atau ubah bentuk yang sudah ada.
export type MapTool = DrawMode | 'edit' | 'drag' | 'delete';

// Kunci tiap lapisan peta yang bisa dinyalakan/dimatikan dari panel.
export type LayerKey = 'risk' | 'kecamatan' | 'kelurahan' | 'rumahSakit' | 'puskesmas' | 'sekolah';
