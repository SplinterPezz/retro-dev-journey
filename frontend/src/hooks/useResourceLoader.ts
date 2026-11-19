import { useState, useEffect } from 'react';

interface LoaderState {
  isLoading: boolean;
  loaded: number;
  total: number;
}

const loadImage = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });

// `images` must keep its identity between renders: a new array starts the loading again.
export const useResourceLoader = (images: string[]): LoaderState => {
  // progress of one list: a new list reads as "nothing loaded yet" without an extra render
  const [progress, setProgress] = useState<{ images: string[]; loaded: number; done: boolean }>({ images, loaded: 0, done: false });
  const current = progress.images === images ? progress : { loaded: 0, done: false };

  useEffect(() => {
    if (images.length === 0) return;

    let cancelled = false;
    let loaded = 0;

    const loads = images.map(async (src) => {
      try {
        await loadImage(src);
      } catch (error) {
        console.warn(`Failed to load resource: ${src}`, error);
      } finally {
        loaded++;
        if (!cancelled) setProgress({ images, loaded, done: false });
      }
    });

    void Promise.all(loads).then(() => {
      if (!cancelled) setProgress({ images, loaded, done: true });
    });

    return () => {
      cancelled = true;
    };
  }, [images]);

  return { isLoading: images.length > 0 && !current.done, loaded: current.loaded, total: images.length };
};
