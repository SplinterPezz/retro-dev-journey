import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export { ZOOM_LEVEL_COUNT } from '../store/zoomSlice';

// Scale for each zoom level: index 0 is level 1 (furthest out).
const ZOOM_SCALES = [0.6, 0.8, 1, 1.25, 1.5];

export const useZoomLevel = (): number => useSelector((state: RootState) => state.zoom.level);

export const useZoomScale = (): number => ZOOM_SCALES[useZoomLevel() - 1];
