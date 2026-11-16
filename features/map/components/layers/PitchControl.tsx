'use client';

import { useControl } from 'react-map-gl/maplibre';
import type { Map as MapLibreMap } from 'maplibre-gl';

// Tombol 3D/2D sekali ketuk, karena memiringkan peta dengan dua jari sulit ditemukan di HP.
export default function PitchControl() {
  useControl(() => {
    const div = document.createElement('div');
    div.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = 'Miringkan peta (3D)';
    btn.style.cssText = 'font: 700 11px system-ui, sans-serif; color: #334155;';
    btn.textContent = '3D';
    div.append(btn);
    let map: MapLibreMap | null = null;
    const sync = () => { if (map) btn.textContent = map.getPitch() > 10 ? '2D' : '3D'; };
    btn.onclick = () => map?.easeTo({ pitch: map.getPitch() > 10 ? 0 : 60, duration: 600 });
    return {
      onAdd(m: MapLibreMap) { map = m; m.on('pitchend', sync); sync(); return div; },
      onRemove() { map?.off('pitchend', sync); div.remove(); },
    };
  }, { position: 'bottom-right' });
  return null;
}
