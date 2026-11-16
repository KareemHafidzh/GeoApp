'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Geoman, type GmOptionsPartial } from '@geoman-io/maplibre-geoman-free';
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css';
import type { MapTool } from '@/features/map/types';
import type { Map as MapLibreMap, MapMouseEvent, MapTouchEvent, GeoJSONSource } from 'maplibre-gl';

const FREEHAND = 'freehand-preview';
const strokeLine = (coordinates: number[][]) => ({ type: 'Feature' as const, properties: {}, geometry: { type: 'LineString' as const, coordinates } });

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

    // A finished shape goes straight into resize mode: its handles appear, so it's obvious it can
    // still be adjusted. (Deferred: Geoman is still mid-event when gm:create fires.)
    const onCreate = () => setTimeout(() => {
      gm.disableAllModes();
      gm.enableGlobalEditMode();
      setActiveDrawMode('edit');
    }, 0);
    mapInstance.on('gm:create', onCreate);
    return () => { mapInstance.off('gm:create', onCreate); };
  }, [mapInstance]);

  // Freehand ("Bebas"): Geoman's free build has no freehand mode, so the stroke is collected here
  // and handed to Geoman as an ordinary polygon — it then measures, moves and deletes like the rest.
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
      // A second finger means pinch-zoom, not drawing.
      if ('touches' in e.originalEvent && e.originalEvent.touches.length > 1) { ring = null; preview.setData(strokeLine([])); return; }
      e.preventDefault(); // the drag draws instead of panning the map
      ring = [e.lngLat.toArray()];
      last = e.point;
    };
    const move = (e: MapMouseEvent | MapTouchEvent) => {
      if (!ring || Math.hypot(e.point.x - last.x, e.point.y - last.y) < 6) return; // a vertex every 6px is plenty
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
      setActiveDrawMode(null); // one stroke = one area; tap it to read its size
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
    else if (mode !== 'freehand') gm.enableDraw(mode); // freehand is handled by the effect above
    setActiveDrawMode(mode);
  }, [activeDrawMode]);

  const clearAll = useCallback(() => {
    geomanRef.current?.disableDraw();
    setActiveDrawMode(null);
    // Ideally we should use geoman API to remove layers, 
    // but preserving the original behavior here:
    window.location.reload();
  }, []);

  return { activeDrawMode, toggleDrawMode, clearAll, geomanRef };
}
