'use client';

import { Source, Layer, Marker } from 'react-map-gl/maplibre';
import type { ExpressionSpecification } from 'maplibre-gl';
import type { FeatureCollection, Point } from 'geojson';
import { RISK_LEVELS } from '@/features/map/constants';
import type { LayerKey } from '@/features/map/types';
import type { NearestResult } from '../overlays/MapEmergency';

// Id lapisan titik yang bisa di-hover, beserta nama jenis fasilitasnya untuk tooltip.
export const POI_LAYERS: Record<string, string> = {
  'rumah-sakit-points': 'Rumah Sakit',
  'puskesmas-points': 'Puskesmas',
  'school-points': 'Sekolah',
};

// Warna zona diambil dari RISK_LEVELS supaya legenda dan isi peta tidak pernah berbeda.
const RISK_FILL_COLOR = ['match', ['get', 'Risk_Label'], ...RISK_LEVELS.flatMap((l) => [l.label, l.color]), '#cccccc'] as unknown as ExpressionSpecification;

const show = (on: boolean) => ({ visibility: on ? 'visible' : 'none' } as const);

interface MapLayersProps {
  visible: Record<LayerKey, boolean>;
  hiddenRisks: string[];
  beforeId?: string;
  rumahSakit: FeatureCollection<Point> | null;
  puskesmas: FeatureCollection<Point> | null;
  sekolah: FeatureCollection<Point> | null;
  nearest: NearestResult | null;
}

// Semua sumber data dan lapisan yang digambar di atas peta dasar.
export default function MapLayers({ visible, hiddenRisks, beforeId, rumahSakit, puskesmas, sekolah, nearest }: MapLayersProps) {
  return (
    <>
      {/* Zona risiko dan batas kelurahan (PMTiles), diletakkan di bawah label peta dasar. */}
      <Source id="spatial_risk" type="vector" url="pmtiles:///spatial_risk.pmtiles">
        <Layer id="risk-fills" type="fill" source-layer="spatial_risk" beforeId={beforeId}
          layout={show(visible.risk)}
          filter={['!', ['in', ['get', 'Risk_Label'], ['literal', hiddenRisks]]]}
          paint={{ 'fill-color': RISK_FILL_COLOR, 'fill-opacity': 0.65 }} />
        <Layer id="desa-borders" type="line" source-layer="spatial_risk" beforeId={beforeId}
          layout={show(visible.kelurahan)}
          paint={{ 'line-color': '#1e3a8a', 'line-width': 0.8, 'line-opacity': 0.8 }} />
      </Source>

      <Source id="kecamatan_borders" type="vector" url="pmtiles:///kecamatan_borders.pmtiles">
        <Layer id="district-borders" type="line" source-layer="kecamatan_borders" beforeId={beforeId}
          layout={show(visible.kecamatan)}
          paint={{ 'line-color': '#1e293b', 'line-width': 2.5, 'line-opacity': 1 }} />
      </Source>

      {/* Titik fasilitas (GeoJSON): titik berwarna dengan tepi putih, RS dan sekolah diberi halo. */}
      {rumahSakit && (
        <Source id="rumah_sakit" type="geojson" data={rumahSakit}>
          <Layer id="rumah-sakit-glow" type="circle" layout={show(visible.rumahSakit)}
            paint={{ 'circle-radius': 14, 'circle-color': '#ef4444', 'circle-opacity': 0.25, 'circle-blur': 0.5 }} />
          <Layer id="rumah-sakit-points" type="circle" layout={show(visible.rumahSakit)}
            paint={{ 'circle-radius': 5, 'circle-color': '#ef4444', 'circle-stroke-width': 2, 'circle-stroke-color': '#ffffff', 'circle-pitch-alignment': 'map' }} />
        </Source>
      )}

      {puskesmas && (
        <Source id="puskesmas" type="geojson" data={puskesmas}>
          <Layer id="puskesmas-points" type="circle" layout={show(visible.puskesmas)}
            paint={{ 'circle-radius': 4.5, 'circle-color': '#10b981', 'circle-stroke-width': 1.5, 'circle-stroke-color': '#ffffff', 'circle-pitch-alignment': 'map' }} />
        </Source>
      )}

      {/* Garis lurus dari lokasi pengguna ke fasilitas kesehatan terdekat. */}
      {nearest && (
        <>
          <Source id="nearest-line" type="geojson" data={{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [nearest.from, nearest.to] } }}>
            <Layer id="nearest-line" type="line" paint={{ 'line-color': '#0f172a', 'line-width': 3, 'line-dasharray': [2, 1.5] }} />
          </Source>
          <Marker longitude={nearest.from[0]} latitude={nearest.from[1]}>
            <span className="block w-4 h-4 rounded-full bg-blue-600 border-[3px] border-white shadow-lg" />
          </Marker>
        </>
      )}

      {sekolah && (
        <Source id="school" type="geojson" data={sekolah}>
          <Layer id="school-glow" type="circle" layout={show(visible.sekolah)}
            paint={{ 'circle-radius': 12, 'circle-color': '#3b82f6', 'circle-opacity': 0.25, 'circle-blur': 0.5 }} />
          <Layer id="school-points" type="circle" layout={show(visible.sekolah)}
            paint={{ 'circle-radius': 4.5, 'circle-color': '#3b82f6', 'circle-stroke-width': 1.5, 'circle-stroke-color': '#ffffff', 'circle-pitch-alignment': 'map' }} />
        </Source>
      )}
    </>
  );
}
