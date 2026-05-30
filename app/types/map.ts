

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
  banjir2020: number;
  banjir2021: number;
  banjir2024: number;
  gempa2020: number;
  gempa2021: number;
  gempa2024: number;
  longsor2020: number;
  longsor2021: number;
  longsor2024: number;
  totalBencana: number;
}

export interface HoverInfo {
  longitude: number;
  latitude: number;
  name: string;
  address: string;
  type: string;
}

export interface DrawnAreaInfo {
  areaKm: string;
  areaM: string;
}

export interface CursorLngLat {
  lng: number;
  lat: number;
}

export type DrawMode = 'marker' | 'line' | 'polygon' | 'circle' | 'rectangle' | 'freehand';

export type RiskLabel = 'Very High Risk' | 'High Risk' | 'Medium Risk' | 'Low Risk';
