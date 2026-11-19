import { renderHook, waitFor } from '@testing-library/react';
import { useResourceLoader } from './useResourceLoader';

// jsdom never loads images: this one loads right away and counts how often each source is asked for
const requested: string[] = [];
class InstantImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  set src(value: string) {
    requested.push(value);
    queueMicrotask(() => this.onload?.());
  }
}

describe('useResourceLoader', () => {
  beforeEach(() => {
    requested.length = 0;
    vi.stubGlobal('Image', InstantImage);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('loads every image once and finishes', async () => {
    const { result } = renderHook(() => useResourceLoader(['/a.png', '/b.png']));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current).toEqual({ isLoading: false, loaded: 2, total: 2 });
    expect(requested).toEqual(['/a.png', '/b.png']);
  });

  it('finishes when the caller builds a new array with the same images on every render', async () => {
    const { result } = renderHook(() => useResourceLoader(['/a.png', '/b.png'].map((src) => src)));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(requested).toEqual(['/a.png', '/b.png']);
  });

  it('starts again when the images change', async () => {
    const { result, rerender } = renderHook(({ images }) => useResourceLoader(images), { initialProps: { images: ['/a.png'] } });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    rerender({ images: ['/a.png', '/c.png'] });
    expect(result.current).toEqual({ isLoading: true, loaded: 0, total: 2 });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.loaded).toBe(2);
  });

  it('has nothing to load for an empty list', () => {
    const { result } = renderHook(() => useResourceLoader([]));
    expect(result.current).toEqual({ isLoading: false, loaded: 0, total: 0 });
  });
});
