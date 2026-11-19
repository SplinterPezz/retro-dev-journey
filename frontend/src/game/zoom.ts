import { useAppSelector } from '../store/hooks';

export { ZOOM_LEVEL_COUNT } from '../store/zoomSlice';

const ZOOM_SCALES = [0.6, 0.8, 1, 1.25, 1.5];
const UNZOOMED = 1;

export const useZoomLevel = (): number => useAppSelector((state) => state.zoom.level);

export const useZoomScale = (): number => ZOOM_SCALES[useZoomLevel() - 1] ?? UNZOOMED;
