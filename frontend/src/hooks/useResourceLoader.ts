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

const SEPARATOR = '\n';

// Keyed by the list's content, not its identity: callers build the list during render, and the React Compiler
// does not keep a value stable when it is used past a later hook call.
export const useResourceLoader = (images: string[]): LoaderState => {
  const key = images.join(SEPARATOR);
  // progress of one list: a new list reads as "nothing loaded yet" without an extra render
  const [progress, setProgress] = useState<{ key: string; loaded: number; done: boolean }>({ key, loaded: 0, done: false });
  const current = progress.key === key ? progress : { loaded: 0, done: false };

  useEffect(() => {
    if (!key) return;

    let cancelled = false;
    let loaded = 0;

    const loads = key.split(SEPARATOR).map(async (src) => {
      await loadImage(src).catch((error: unknown) => console.warn(`Failed to load resource: ${src}`, error));
      loaded += 1;
      if (!cancelled) setProgress({ key, loaded, done: false });
    });

    void Promise.all(loads).then(() => {
      if (!cancelled) setProgress({ key, loaded, done: true });
    });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return { isLoading: images.length > 0 && !current.done, loaded: current.loaded, total: images.length };
};
