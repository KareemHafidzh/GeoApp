'use client';

import { useEffect, useRef } from 'react';
import { Geoman, type GmOptionsPartial } from '@geoman-io/maplibre-geoman-free';
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css';
import { Map as MapLibreMap } from 'maplibre-gl';

interface GeomanControlProps {
  map: MapLibreMap | null;
}

export default function GeomanControl({ map }: GeomanControlProps) {
  const geomanRef = useRef<Geoman | null>(null);

  useEffect(() => {
    if (!map || geomanRef.current) return;

    
    const gmOptions: GmOptionsPartial = {
      controls: {
        draw: {
          circle: { uiEnabled: false },
          circle_marker: { uiEnabled: false },
          text_marker: { uiEnabled: false },
        },
      },
    };

    const gm = new Geoman(map, gmOptions);
    geomanRef.current = gm;
    return () => {
      geomanRef.current = null;
    };
  }, [map]);
  
  return null;
}