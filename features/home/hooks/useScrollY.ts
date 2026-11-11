import { useEffect, useState } from 'react';

export function useScrollY() {
  const [y, setY] = useState(0);
  
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  
  return y;
}