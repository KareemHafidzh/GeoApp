'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Geoman, type GmOptionsPartial } from '@geoman-io/maplibre-geoman-free';
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css';
import type { DrawMode } from '@/app/types/map';
import type { Map as MapLibreMap } from 'maplibre-gl';

export function useGeoman(mapInstance: MapLibreMap | null) {
  const geomanRef = useRef<Geoman | null>(null);
  const [activeDrawMode, setActiveDrawMode] = useState<DrawMode | null>(null);

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
  }, [mapInstance]);

  const toggleDrawMode = useCallback((mode: DrawMode) => {
    if (activeDrawMode === mode) {
      geomanRef.current?.disableDraw();
      setActiveDrawMode(null);
    } else {
      geomanRef.current?.enableDraw(mode);
      setActiveDrawMode(mode);
    }
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
