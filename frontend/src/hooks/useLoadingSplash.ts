import { useEffect, useState } from 'react';
import { useResourceLoader } from './useResourceLoader';

// The splash stays up at least this long, then until the sprites are loaded
// (or the cap runs out, so a broken network never hides the scene for good).
const SPLASH_MIN_MS = 2600;
const SPLASH_MAX_MS = 15000;
const SPLASH_FADE_MS = 900; // same length as .chapter-splash--leaving in LoadingSplash.css

// The black title screen (components/Common/LoadingSplash) shown while a
// scene's sprites - and its music, if given - load: a Story chapter, the
// Sandbox. `visible` until it has faded out, `leaving` while it fades.
export const useLoadingSplash = (images: string[], audio?: string[]) => {
  const { isLoading, loaded, total } = useResourceLoader({ images, audio });
  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [visible, setVisible] = useState(true);
  const leaving = minElapsed && (!isLoading || timedOut);

  useEffect(() => {
    const minTimer = setTimeout(() => setMinElapsed(true), SPLASH_MIN_MS);
    const maxTimer = setTimeout(() => setTimedOut(true), SPLASH_MAX_MS);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => setVisible(false), SPLASH_FADE_MS);
    return () => clearTimeout(timer);
  }, [leaving]);

  return { visible, leaving, loaded, total };
};
