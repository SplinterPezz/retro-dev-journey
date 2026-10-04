import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { setOrientation } from '../store/storySlice';
import { StoryOrientation } from '../types/story';
import { isMobileDevice } from './useIsMobile';
import '../components/Common/ScreenRotation.css';

export const isLandscape = (orientation: StoryOrientation | null): boolean =>
  orientation === 'landscape-primary' || orientation === 'landscape-secondary';

export const isPortraitViewport = (): boolean => window.matchMedia('(orientation: portrait)').matches;

// only works in fullscreen on Android Chrome, never on iOS Safari: callers fall back to CSS rotation
const lockOrientation = async (orientation: StoryOrientation): Promise<boolean> => {
  if (orientation === 'portrait') return false;
  try {
    await window.screen.orientation.lock(orientation);
    return true;
  } catch {
    return false;
  }
};

export const unlockOrientation = (): void => {
  try {
    window.screen.orientation.unlock();
  } catch {
    // nothing was locked
  }
};

// true while a landscape request runs, so the portrait fallback does not undo it
let landscapeRequestPending = false;

export const enterLandscape = async (orientation: StoryOrientation): Promise<void> => {
  landscapeRequestPending = true;
  try {
    if (document.fullscreenEnabled && !document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    // refused: the lock may still work, otherwise the CSS rotation applies
  }
  await lockOrientation(orientation);
  landscapeRequestPending = false;
};

// a phone that chose landscape but is still held upright
const useCssRotation = (orientation: StoryOrientation | null): boolean => {
  const [rotated, setRotated] = useState(false);

  useEffect(() => {
    const check = () => setRotated(isMobileDevice() && isLandscape(orientation) && isPortraitViewport());
    check();

    const query = window.matchMedia('(orientation: portrait)');
    query.addEventListener('change', check);
    window.addEventListener('resize', check);
    return () => {
      query.removeEventListener('change', check);
      window.removeEventListener('resize', check);
    };
  }, [orientation]);

  return rotated;
};

export const useScreenRotation = (): void => {
  const orientation = useSelector((state: RootState) => state.story.orientation);
  const rotated = useCssRotation(orientation);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('rotate-landscape-primary', 'rotate-landscape-secondary');
    if (rotated && orientation && isLandscape(orientation)) {
      root.classList.add(`rotate-${orientation}`);
    }
  }, [rotated, orientation]);

  // measured, not vh/vw: those go stale when the page is reopened
  useEffect(() => {
    const root = document.documentElement;
    const measure = () => {
      root.style.setProperty('--rot-w', `${window.innerWidth}px`);
      root.style.setProperty('--rot-h', `${window.innerHeight}px`);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
};

// width and height swap while the picture is turned with CSS
export const useLogicalViewport = (): { width: number; height: number } => {
  const orientation = useSelector((state: RootState) => state.story.orientation);
  const rotated = useCssRotation(orientation);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return rotated ? { width: size.height, height: size.width } : size;
};

// Reopening the browser or leaving fullscreen drops the lock: an upright phone goes back to portrait.
export const useFallbackToPortrait = (): void => {
  const dispatch = useDispatch<AppDispatch>();
  const orientation = useSelector((state: RootState) => state.story.orientation);
  const orientationRef = useRef(orientation);
  orientationRef.current = orientation;

  useEffect(() => {
    const check = () => {
      if (landscapeRequestPending) return;
      if (isLandscape(orientationRef.current) && !document.fullscreenElement && isMobileDevice() && isPortraitViewport()) {
        dispatch(setOrientation('portrait'));
      }
    };
    // leaving fullscreen (Android back) also turns the phone upright
    const query = window.matchMedia('(orientation: portrait)');
    check();
    document.addEventListener('fullscreenchange', check);
    query.addEventListener('change', check);
    return () => {
      document.removeEventListener('fullscreenchange', check);
      query.removeEventListener('change', check);
    };
  }, [dispatch]);
};
