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
  const [state, setState] = useState<LoaderState>({ isLoading: images.length > 0, loaded: 0, total: images.length });

  useEffect(() => {
    if (images.length === 0) {
      setState({ isLoading: false, loaded: 0, total: 0 });
      return;
    }

    let cancelled = false;
    let loaded = 0;
    setState({ isLoading: true, loaded: 0, total: images.length });

    const loads = images.map(async (src) => {
      try {
        await loadImage(src);
      } catch (error) {
        console.warn(`Failed to load resource: ${src}`, error);
      } finally {
        loaded++;
        if (!cancelled) setState((prev) => ({ ...prev, loaded }));
      }
    });

    void Promise.all(loads).then(() => {
      if (!cancelled) setState((prev) => ({ ...prev, isLoading: false }));
    });

    return () => {
      cancelled = true;
    };
  }, [images]);

  return state;
};
