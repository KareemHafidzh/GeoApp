'use client';

import { useRef, useState, useEffect } from 'react';
import Map, { Source, Layer, NavigationControl, MapRef, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import GeomanControl from '../geomanControl';
import area from '@turf/area';
import Link from 'next/link';

export default function MapComponent() {
  const mapRef = useRef<MapRef>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const mapStyle = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
  const [showAdministrasiLayer, setShowAdministrasiLayer] = useState(true);
  const [showPendidikanLayer, setShowPendidikanLayer] = useState(true);
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [showRiskLayer, setShowRiskLayer] = useState(false);

  const onMapLoad = (e: any) => {
    setMapInstance(e.target);
  };

  //pop-up map click handler
  const onClick = (event: any) => {
    const feature = event.features?.[0];
    
    if (feature) {
      const props = feature.properties;
      
      // Calculate Area
      const calculatedAreaM2 = area(feature.geometry);
      const calculatedHa = (calculatedAreaM2 / 10000).toFixed(2);

      // Set Popup Data
      setPopupInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        village: props.NAMOBJ,       
        district: props.WADMKC,      
        city: props.WADMKK,          
        province: props.WADMPR,
        areaHa: calculatedHa 
      });
    }else{
      setPopupInfo(null);
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* --- BACK TO DASHBOARD BUTTON --- */}
      <div className="absolute top-4 right-14 z-10">
        <Link 
          href="/" 
          className="bg-white px-4 py-2 rounded shadow text-sm font-bold text-gray-700 hover:bg-gray-50 border border-gray-200 flex items-center transition">
          &larr; Back to Dashboard
        </Link>
      </div>
      {/* Layer Control Container */}
      <div className="absolute top-4 left-14 z-10 flex flex-col gap-2">
        {/* Risk Layer Toggle */}
        <div className="bg-white p-2 rounded shadow">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" checked={showRiskLayer} 
              onChange={(e) => setShowRiskLayer(e.target.checked)}/>
            <span className="text-sm font-bold text-gray-700 font-sans">Show Risk Clustering</span>
          </label>
        </div>
        {/* Administrasi Layer Toggle */}
        <div className="bg-white p-2 rounded shadow">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input className="w-4 h-4" type="checkbox" checked={showAdministrasiLayer} 
              onChange={(e) => setShowAdministrasiLayer(e.target.checked)}/>
            <span className="text-sm font-bold text-gray-700">Show Administrasi Desa Layer</span>
          </label>
        </div>
        {/* Pendidikan Layer Toggle */}
        <div className="bg-white p-2 rounded shadow">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" checked={showPendidikanLayer} 
            onChange={(e) => setShowPendidikanLayer(e.target.checked)}/>
            <span className="text-sm font-bold text-gray-700">Show Pendidikan Dots</span>
          </label>
        </div>
      </div>
      <Map ref={mapRef} initialViewState={{ longitude: 106.8, latitude: -6.2, zoom: 9}}
        style={{ width: '100%', height: '100%' }} mapStyle={mapStyle} onClick={onClick} onLoad={onMapLoad} 
        interactiveLayerIds={['data-fill']} cursor={popupInfo ? 'auto' : 'pointer'}>
        <NavigationControl position="top-right" />
        <GeomanControl map={mapInstance} />

        {popupInfo && (
          <Popup longitude={popupInfo.longitude} latitude={popupInfo.latitude} anchor="bottom" onClose={() => setPopupInfo(null)} closeOnClick={false} maxWidth="300px">
            <div className="p-2 text-sm text-gray-800">
              <h3 className="font-bold text-blue-600 border-b pb-1 mb-1">
                Kel. {popupInfo.village}
              </h3>
              <p><b>Kecamatan:</b> {popupInfo.district}</p>
              <p><b>Kota:</b> {popupInfo.city}</p>
              <div className="mt-2 pt-2 border-t flex justify-between">
                 <span>Luas:</span>
                 <span className="font-bold text-green-600">{popupInfo.areaHa} Ha</span>
              </div>
            </div>
          </Popup>
        )}

        {/* LAYER DISASTER RISK */}
        <Source id="spatial_risk" type="vector" tiles={['http://localhost:8080/data/spatial_risk/{z}/{x}/{y}.pbf']}>
          <Layer id="risk-fills" type="fill" source-layer="spatial_risk"
            layout={{ visibility: showRiskLayer ? 'visible' : 'none' }}
            paint={{
              'fill-color': [
                'match',
                ['get', 'Risk_Label'],
                'Very High Risk', '#a50026',
                'High Risk',      '#f46d43',
                'Medium Risk',    '#fee08b',
                'Low Risk',       '#1a9850',
                '#cccccc'
              ],
              'fill-opacity': 0.7
            }}
          />
          <Layer
            id="risk-borders"
            type="line"
            source-layer="spatial_risk"
            layout={{ visibility: showRiskLayer ? 'visible' : 'none' }}
            paint={{
              'line-color': '#ffffff',
              'line-width': 1
            }}
          />
        </Source>

        <Source  id="my-vector-data" type="vector" 
          tiles={["http://localhost:8080/data/administrasi_desa/{z}/{x}/{y}.pbf"]} >

          <Layer id="data-fill" type="fill" source-layer="administrasi-desa" 
            layout={{visibility: showAdministrasiLayer ? 'visible' : 'none'}}
            paint={{'fill-color': '#3892b6', 'fill-opacity': 0.4}}/>
          <Layer id="data-line" type="line" source-layer="administrasi-desa" 
            layout={{visibility: showAdministrasiLayer ? 'visible' : 'none'}}
            paint={{'line-color': '#000000', 'line-width': 1.5}}/>
        </Source>
        <Source  id="pendidikan" type="vector" tiles={['http://localhost:8080/data/pendidikan/{z}/{x}/{y}.pbf']}>
            <Layer
              id="pendidikan-points"
              source-layer="pendidikan-layer"
              type="circle"
              layout={{ visibility: showPendidikanLayer ? 'visible' : 'none' }}
              paint={{
                'circle-radius': 6,
                'circle-color': '#ff0000',
                'circle-stroke-color': '#ffffff',
                'circle-stroke-width': 1
              }}/>
        </Source>
      </Map>
    </div>
  );
}