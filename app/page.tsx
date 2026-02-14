'use client';

import dynamic from 'next/dynamic';


const MapComponent = dynamic(() => import('./mapComponent'), { 
  ssr: false,
  loading: () => <p>Loading Map...</p>
});

export default function Home() {
  return (
    <MapComponent />
  );
}
