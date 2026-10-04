import { useEffect, useState } from 'react';
import { isMobileDevice } from '../services/tracking/device';

export { isMobileDevice };

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(() => isMobileDevice());

  useEffect(() => {
    const check = () => setIsMobile(isMobileDevice());

    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
};
