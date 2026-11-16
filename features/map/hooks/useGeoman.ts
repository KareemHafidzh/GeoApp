'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Geoman, type GmOptionsPartial } from '@geoman-io/maplibre-geoman-free';
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css';
import type { MapTool } from '@/features/map/types';
import type { Map as MapLibreMap, MapMouseEvent, MapTouchEvent, GeoJSONSource } from 'maplibre-gl';

const FREEHAND = 'freehand-preview';
const strokeLine = (coordinates: number[][]) => ({ type: 'Feature' as const, properties: {}, geometry: { type: 'LineString' as const, coordinates } });

// Hubungkan Geoman ke peta untuk alat ukur: gambar bentuk, ubah, geser, hapus, dan gambar bebas.
export function useGeoman(mapInstance: MapLibreMap | null) {
  const geomanRef = useRef<Geoman | null>(null);
  const [activeDrawMode, setActiveDrawMode] = useState<MapTool | null>(null);

  useEffect(() => {
    if (!mapInstance || geomanRef.current) return;
    const gmOptions: GmOptionsPartial = {
      controls: {
        draw: {
          polygon: { uiEnabled: false },
          line: { uiEnabled: false },
          circle: { uiEnabled: false },
          marker: { uiEnabled: false },
          circle_marker: { uiEnabled: false },
          text_marker: { uiEnabled: false },
          rectangle: { uiEnabled: false },
          freehand: { uiEnabled: false },
          custom_shape: { uiEnabled: false },
        },
        edit: {
          change: { uiEnabled: false },
          copy: { uiEnabled: false },
          cut: { uiEnabled: false },
          drag: { uiEnabled: false },
          delete: { uiEnabled: false },
        },
        helper: {
          shape_markers: { uiEnabled: false },
          pin: { uiEnabled: false },
          snapping: { uiEnabled: false },
          snap_guides: { uiEnabled: false },
          click_to_edit: { uiEnabled: false },
        }
      },
    };
    const gm = new Geoman(mapInstance, gmOptions);
    geomanRef.current = gm;

    // Bentuk yang selesai digambar langsung masuk mode ubah ukuran agar pegangannya terlihat.
    // (Ditunda satu tick karena Geoman masih memproses event saat gm:create terpicu.)
    const onCreate = () => setTimeout(() => {
      gm.disableAllModes();
      gm.enableGlobalEditMode();
      setActiveDrawMode('edit');
    }, 0);
    mapInstance.on('gm:create', onCreate);
    return () => { mapInstance.off('gm:create', onCreate); };
  }, [mapInstance]);

  // Gambar bebas: versi gratis Geoman tidak punya mode ini, jadi goresan dikumpulkan di sini lalu
  // dimasukkan ke Geoman sebagai poligon biasa yang bisa diukur, digeser, dan dihapus.
  useEffect(() => {
    const map = mapInstance;
    const gm = geomanRef.current;
    if (activeDrawMode !== 'freehand' || !map || !gm) return;

    map.addSource(FREEHAND, { type: 'geojson', data: strokeLine([]) });
    map.addLayer({ id: FREEHAND, type: 'line', source: FREEHAND, paint: { 'line-color': '#0aab8a', 'line-width': 3 } });
    const preview = map.getSource(FREEHAND) as GeoJSONSource;

    let ring: number[][] | null = null;
    let last = { x: 0, y: 0 };
    const down = (e: MapMouseEvent | MapTouchEvent) => {
      // Jari kedua berarti cubit-zoom, bukan menggambar.
      if ('touches' in e.originalEvent && e.originalEvent.touches.length > 1) { ring = null; preview.setData(strokeLine([])); return; }
      e.preventDefault(); // seretan dipakai untuk menggambar, bukan menggeser peta
      ring = [e.lngLat.toArray()];
      last = e.point;
    };
    const move = (e: MapMouseEvent | MapTouchEvent) => {
      if (!ring || Math.hypot(e.point.x - last.x, e.point.y - last.y) < 6) return; // satu titik tiap 6px sudah cukup halus
      last = e.point;
      ring.push(e.lngLat.toArray());
      preview.setData(strokeLine(ring));
    };
    const up = () => {
      const done = ring;
      ring = null;
      preview.setData(strokeLine([]));
      if (!done || done.length < 3) return;
      gm.features.importGeoJson({ type: 'Feature', properties: { shape: 'polygon' }, geometry: { type: 'Polygon', coordinates: [[...done, done[0]]] } });
      setActiveDrawMode(null); // satu goresan = satu area; ketuk untuk melihat luasnya
    };
    map.on('mousedown', down); map.on('touchstart', down);
    map.on('mousemove', move); map.on('touchmove', move);
    map.on('mouseup', up); map.on('touchend', up);
    return () => {
      map.off('mousedown', down); map.off('touchstart', down);
      map.off('mousemove', move); map.off('touchmove', move);
      map.off('mouseup', up); map.off('touchend', up);
      if (map.getLayer(FREEHAND)) map.removeLayer(FREEHAND);
      if (map.getSource(FREEHAND)) map.removeSource(FREEHAND);
    };
  }, [activeDrawMode, mapInstance]);

  const toggleDrawMode = useCallback((mode: MapTool) => {
    const gm = geomanRef.current;
    if (!gm) return;
    gm.disableAllModes();
    if (activeDrawMode === mode) return setActiveDrawMode(null);
    if (mode === 'edit') gm.enableGlobalEditMode();
    else if (mode === 'drag') gm.enableGlobalDragMode();
    else if (mode === 'delete') gm.enableGlobalRemovalMode();
    else if (mode !== 'freehand') gm.enableDraw(mode); // gambar bebas ditangani efek di atas
    setActiveDrawMode(mode);
  }, [activeDrawMode]);

  const clearAll = useCallback(() => {
    geomanRef.current?.disableDraw();
    setActiveDrawMode(null);
    // ponytail: muat ulang halaman sebagai cara cepat menghapus semua gambar; ganti dengan gm.features.deleteAll() bila perlu.
    window.location.reload();
  }, []);

  return { activeDrawMode, toggleDrawMode, clearAll, geomanRef };
}
