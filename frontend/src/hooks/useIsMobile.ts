import { useEffect, useState } from 'react';
import { isMobileDevice } from '../Services/tracking/device';

export { isMobileDevice };

// Right from the first render (no desktop flash on phones), re-checked on
// resize so rotating a device updates it.
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(() => isMobileDevice());

  useEffect(() => {
    const check = () => setIsMobile(isMobileDevice());

    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
};
