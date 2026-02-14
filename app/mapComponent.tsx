'use client';

import { useRef, useState } from 'react';
import Map, { Source, Layer, NavigationControl, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

// 1. Import Geoman for MapLibre and its CSS
import { Geoman } from '@geoman-io/maplibre-geoman-free';
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css';

export default function MapComponent() {
  const mapRef = useRef<MapRef>(null);
  const geomanRef = useRef<Geoman | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const onMapLoad = (e: any) => {
    const mapInstance = e.target;
    if (geomanRef.current) return;

    geomanRef.current = new Geoman(mapInstance, {
      // You can put specific Geoman options here if needed
    });

    console.log('Geoman for MapLibre loaded!');
    
    mapInstance.on('gm:create', (e: any) => {
       console.log('New shape drawn:', e);
    });
  };

  const styleLight = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
  const styleDark = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-5 left-15 z-10 rounded shadow flex gap-2">
         <button 
           onClick={() => setIsDarkMode(!isDarkMode)}
           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold"
         >
           {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
         </button>
      </div>

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 106.8, // Jakarta
          latitude: -6.2,
          zoom: 9
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={isDarkMode ? styleDark : styleLight}
        
        // geoman
        onLoad={onMapLoad}
      >
        <NavigationControl position="top-right" />

        <Source 
          id="my-vector-data" 
          type="vector" 
          tiles={["http://localhost:8080/data/final_tiles/{z}/{x}/{y}.pbf"]}
        >
          <Layer
            id="data-fill"
            type="fill"
            source-layer="administrasi-desa" 
            paint={{
              'fill-color': '#3892b6',
              'fill-opacity': 0.4
            }}
          />

          <Layer
            id="data-line"
            type="line"
            source-layer="administrasi-desa"
            paint={{
              'line-color': '#000000',
              'line-width': 1.5
            }}
          />
        </Source>
      </Map>
    </div>
  );
}