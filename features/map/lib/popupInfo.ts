import type { GeoJsonProperties } from 'geojson';
import { RISK_FACTORS } from '@/features/map/constants';
import type { PopupInfo } from '@/features/map/types';

// Ubah properti kelurahan dari tile menjadi isi kartu detail wilayah.
export function toPopupInfo(props: NonNullable<GeoJsonProperties>, longitude: number, latitude: number): PopupInfo {
  return {
    longitude,
    latitude,
    village: props.NAMOBJ || 'Unknown',
    district: props.WADMKC || 'Unknown',
    city: props.WADMKK || 'Unknown',
    totalRS: (props['RS Umum'] || 0) + (props['RS Khusus'] || 0),
    totalSmp: props['Total Sekolah SMP'] || 0,
    totalSma: props['Total Sekolah SMA/K'] || 0,
    totalPenduduk: props['Total Penduduk'] || 0,
    lajuPertumbuhan: props['Laju Pertumbuhan'] || 0,
    luasWilayahKm: props['Luas Area (km²)'] || 0,
    riskLabel: props['Risk_Label'] || 'N/A',
    banjir2021: props['Banjir_2021'] || 0,
    banjir2024: props['Banjir_2024'] || 0,
    banjir2025: props['Banjir_2025'] || 0,
    gempa2021: props['Gempa_2021'] || 0,
    gempa2024: props['Gempa_2024'] || 0,
    gempa2025: props['Gempa_2025'] || 0,
    longsor2021: props['Longsor_2021'] || 0,
    longsor2024: props['Longsor_2024'] || 0,
    longsor2025: props['Longsor_2025'] || 0,
    totalBencana: props['Total Bencana (All Years)'] || 0,
    factors: RISK_FACTORS.filter((f) => typeof props[f.key] === 'number').map((f) => ({
      label: f.label,
      value: props[f.key].toLocaleString('id-ID', { maximumFractionDigits: f.digits }) + ('unit' in f ? f.unit : ''),
      raises: (props[f.key] > f.median) === (f.sign > 0),
    })),
  };
}
