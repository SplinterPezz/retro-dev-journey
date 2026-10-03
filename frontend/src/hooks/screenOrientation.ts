import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { setOrientation } from '../store/storySlice';
import { StoryOrientation } from '../types/story';
import { isMobileDevice } from './useIsMobile';
import '../Components/Common/ScreenRotation.css';

export const isLandscape = (orientation: StoryOrientation | null): boolean =>
  orientation === 'landscape-primary' || orientation === 'landscape-secondary';

export const isPortraitViewport = (): boolean => window.matchMedia('(orientation: portrait)').matches;

// Asks the browser to lock the screen. Only works in fullscreen on Android
// Chrome, and not at all on iOS Safari - callers fall back to CSS rotation.
export const lockOrientation = async (orientation: StoryOrientation): Promise<boolean> => {
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

// Called from a tap: goes fullscreen first (needed for the lock), then locks.
// True while a landscape request is in progress, so the fallback below does not
// undo it while the phone is still upright.
let landscapeRequestPending = false;

export const enterLandscape = async (orientation: StoryOrientation): Promise<void> => {
  landscapeRequestPending = true;
  try {
    if (document.fullscreenEnabled && !document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    // refused - the lock below may still work, or the CSS fallback applies
  }
  await lockOrientation(orientation);
  landscapeRequestPending = false;
};

// True when the picture has to be turned with CSS: a phone that chose a
// landscape layout but is still held upright. Once the phone is physically
// landscape (or the lock worked) this turns false and nothing is rotated.
export const useCssRotation = (orientation: StoryOrientation | null): boolean => {
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

// Keeps the <html> class in step with the rotation, so ScreenRotation.css can
// turn the whole app. Mounted once at the app root.
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

  // The turned layout is sized from the real visible size, measured here,
  // not from vh/vw - those go stale when the page is reopened.
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

// The size the scene should centre on. When the picture is turned with CSS the
// layout is the device's height by its width, so the two are swapped.
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

// Without fullscreen the screen lock is gone after the browser is reopened or
// fullscreen is left. A phone that is upright while the layout says landscape
// is then shown as portrait. A tap on the rotate button brings landscape back,
// since it is a user gesture that can go fullscreen again.
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
    // The phone turns upright on its own when fullscreen ends (Android back),
    // so the orientation change is checked as well as fullscreen itself.
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
