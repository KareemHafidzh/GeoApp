import { useEffect, useState } from 'react';

// Add the 'export' keyword right here!
export function useScrollY() {
  const [y, setY] = useState(0);
  
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  
  return y;
}