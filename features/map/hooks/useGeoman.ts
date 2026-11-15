'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Geoman, type GmOptionsPartial } from '@geoman-io/maplibre-geoman-free';
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css';
import type { MapTool } from '@/features/map/types';
import type { Map as MapLibreMap } from 'maplibre-gl';

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

  const toggleDrawMode = useCallback((mode: MapTool) => {
    const gm = geomanRef.current;
    if (!gm) return;
    gm.disableAllModes();
    if (activeDrawMode === mode) return setActiveDrawMode(null);
    if (mode === 'edit') gm.enableGlobalEditMode();
    else if (mode === 'drag') gm.enableGlobalDragMode();
    else if (mode === 'delete') gm.enableGlobalRemovalMode();
    else gm.enableDraw(mode);
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
