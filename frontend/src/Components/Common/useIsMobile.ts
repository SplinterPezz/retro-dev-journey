import { useEffect, useState } from 'react';

const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];

// True on phones and tablets: a mobile user agent, or a touch device with a
// small viewport. Synchronous, so screens can decide once on mount.
export const isMobileDevice = (): boolean => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUA = mobileKeywords.some((keyword) => userAgent.includes(keyword));
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  return isMobileUA || (isTouchDevice && isSmallScreen);
};

// Re-checked on resize so rotating a device updates it.
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(isMobileDevice());

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
};
