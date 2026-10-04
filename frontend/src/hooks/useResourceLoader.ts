import { useState, useEffect } from 'react';

interface ResourceLoaderConfig {
  images: string[];
  audio?: string[];
  fonts?: string[];
  onProgress?: (loaded: number, total: number) => void;
}

interface LoaderState {
  isLoading: boolean;
  progress: number;
  loaded: number;
  total: number;
  error: string | null;
}

export const useResourceLoader = (config: ResourceLoaderConfig): LoaderState => {
  const [state, setState] = useState<LoaderState>({
    isLoading: true,
    progress: 0,
    loaded: 0,
    total: config.images.length + (config.audio?.length ?? 0) + (config.fonts?.length ?? 0),
    error: null
  });

  useEffect(() => {
    const loadResources = async () => {
      const allResources = [
        ...config.images,
        ...(config.audio || []),
        ...(config.fonts || [])
      ];

      if (allResources.length === 0) {
        setState({ isLoading: false, progress: 100, loaded: 0, total: 0, error: null });
        return;
      }

      let loadedCount = 0;
      const totalCount = allResources.length;

      const updateProgress = () => {
        const progress = Math.round((loadedCount / totalCount) * 100);
        setState(prev => ({ ...prev, progress, loaded: loadedCount, total: totalCount }));
        config.onProgress?.(loadedCount, totalCount);
      };

      const loadPromises = allResources.map(async (resource) => {
        try {
          if (config.images.includes(resource)) {
            await loadImage(resource);
          } else if (config.audio?.includes(resource)) {
            await loadAudio(resource);
          } else if (config.fonts?.includes(resource)) {
            await loadFont(resource);
          }
        } catch (error) {
          console.warn(`Failed to load resource: ${resource}`, error);
        } finally {
          loadedCount++;
          updateProgress();
        }
      });

      try {
        await Promise.all(loadPromises);
        setState(prev => ({ ...prev, isLoading: false }));
      } catch {
        setState(prev => ({
          ...prev,
          error: 'Some resources failed to load',
          isLoading: false
        }));
      }
    };

    void loadResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.images, config.audio, config.fonts]);

  return state;
};

const loadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

const loadAudio = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => resolve();
    audio.onerror = reject;
    audio.src = src;
    audio.load();
  });
};

const loadFont = (fontFamily: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!document.fonts) {
      resolve();
      return;
    }

    void document.fonts.ready.then(() => {
      const fontFace = Array.from(document.fonts).find(
        font => font.family === fontFamily
      );
      if (fontFace) {
        resolve();
      } else {
        reject(new Error(`Font ${fontFamily} not found`));
      }
    });
  });
};