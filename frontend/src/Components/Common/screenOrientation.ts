import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { StoryOrientation } from '../../types/story';
import { isMobileDevice } from './useIsMobile';
import './ScreenRotation.css';

export const isLandscape = (orientation: StoryOrientation | null): boolean =>
  orientation === 'landscape-primary' || orientation === 'landscape-secondary';

const isPortraitViewport = (): boolean => window.matchMedia('(orientation: portrait)').matches;

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
export const enterLandscape = async (orientation: StoryOrientation): Promise<void> => {
  try {
    if (document.fullscreenEnabled && !document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    // refused - the lock below may still work, or the CSS fallback applies
  }
  await lockOrientation(orientation);
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
