import { useEffect, useState } from 'react';
import { useResourceLoader } from './useResourceLoader';

// No minimum time: the splash leaves as soon as everything is loaded. The cap
// keeps a broken network from hiding the scene for good.
const SPLASH_MAX_MS = 15000;
const SPLASH_FADE_MS = 900; // same length as .chapter-splash--leaving in LoadingSplash.css

export const useLoadingSplash = (images: string[]) => {
  const { isLoading, loaded, total } = useResourceLoader(images);
  const [timedOut, setTimedOut] = useState(false);
  const [visible, setVisible] = useState(true);
  const leaving = !isLoading || timedOut;

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), SPLASH_MAX_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => setVisible(false), SPLASH_FADE_MS);
    return () => clearTimeout(timer);
  }, [leaving]);

  return { visible, leaving, loaded, total };
};
