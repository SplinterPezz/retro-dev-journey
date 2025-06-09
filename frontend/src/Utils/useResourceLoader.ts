import { useState, useEffect } from 'react';

interface ResourceLoaderConfig {
  images: string[];
  audio?: string[];
  fonts?: string[];
  onProgress?: (loaded: number, total: number) => void;
  minDuration?: number;
}

interface LoaderState {
  isLoading: boolean;
  progress: number;
  error: string | null;
}

export const useResourceLoader = (config: ResourceLoaderConfig): LoaderState => {
  const [state, setState] = useState<LoaderState>({
    isLoading: true,
    progress: 0,
    error: null
  });

  useEffect(() => {
    const loadResources = async () => {
      const allResources = [
        ...config.images,
        ...(config.audio || []),
        ...(config.fonts || [])
      ];

      const startTime = Date.now();
      const minDuration = config.minDuration || 0;

      if (allResources.length === 0) {
        if (minDuration > 0) {
          await simulateLoadingAnimation(minDuration);
        }
        setState({ isLoading: false, progress: 100, error: null });
        return;
      }

      let loadedCount = 0;
      const totalCount = allResources.length;

      const updateProgress = (forceProgress?: number) => {
        const resourceProgress = forceProgress !== undefined ? forceProgress : Math.round((loadedCount / totalCount) * 100);
        setState(prev => ({ ...prev, progress: resourceProgress }));
        config.onProgress?.(loadedCount, totalCount);
      };

      // Load all resources
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
          // Only update progress immediately if no minimum duration is set
          if (minDuration === 0) {
            updateProgress();
          }
        }
      });

      try {
        await Promise.all(loadPromises);
        
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minDuration - elapsed);

        if (remainingTime > 0) {
          await simulateLoadingAnimation(remainingTime, updateProgress);
        } else {
          updateProgress(100);
        }

        setState(prev => ({ ...prev, isLoading: false }));
        
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Some resources failed to load',
          isLoading: false
        }));
      }
    };

    const simulateLoadingAnimation = (duration: number, progressCallback?: (progress: number) => void): Promise<void> => {
      return new Promise(resolve => {
        const startTime = Date.now();
        const interval = 30; // Update every 30ms
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min((elapsed / duration) * 100, 100);
          
          if (progressCallback) {
            progressCallback(Math.round(progress));
          } else {
            setState(prev => ({ ...prev, progress: Math.round(progress) }));
          }
          
          if (progress >= 100) {
            resolve();
          } else {
            setTimeout(animate, interval);
          }
        };
        
        animate();
      });
    };

    loadResources();
  }, [config.images, config.audio, config.fonts, config.minDuration]);

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

    document.fonts.ready.then(() => {
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