'use client';

import { useRef, useState, useEffect } from 'react';
import Map, { Source, Layer, NavigationControl, MapRef, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import GeomanControl from './geomanControl';
import area from '@turf/area';

export default function MapComponent() {
  const mapRef = useRef<MapRef>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const mapStyle = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
  const [showLayer, setShowLayer] = useState(true);
  const [popupInfo, setPopupInfo] = useState<any>(null);

  const onMapLoad = (e: any) => {
    setMapInstance(e.target);
  };

  const onClick = (event: any) => {
    // Only look at the first feature clicked
    const feature = event.features?.[0];
    
    if (feature) {
      const props = feature.properties;
      
      // Calculate Area (since file says 0)
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
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-14 z-10 bg-white p-2 rounded shadow">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" checked={showLayer} onChange={(e) => setShowLayer(e.target.checked)} className="w-4 h-4"/>
          <span className="text-sm font-bold text-gray-700">Show Administrasi Desa Layer</span>
        </label>
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

        <Source  id="my-vector-data" type="vector" 
          tiles={["http://localhost:8080/data/final_tiles/{z}/{x}/{y}.pbf"]} >

          <Layer id="data-fill" type="fill" source-layer="administrasi-desa" 
            layout={{visibility: showLayer ? 'visible' : 'none'}}
            paint={{'fill-color': '#3892b6', 'fill-opacity': 0.4}}/>

          <Layer id="data-line" type="line" source-layer="administrasi-desa" 
            layout={{visibility: showLayer ? 'visible' : 'none'}}
            paint={{'line-color': '#000000', 'line-width': 1.5}}/>
        </Source>
      </Map>
    </div>
  );
}