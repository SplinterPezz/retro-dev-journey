import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Five zoom levels for the scenes: 1 is the furthest out, 5 the closest in.
// Level 3 is the normal 1:1 view, the default. Kept in the store and persisted,
// so the chosen zoom survives a reload.
export const ZOOM_LEVEL_COUNT = 5;
const DEFAULT_LEVEL = 3;

interface ZoomState {
  level: number;
}

const initialState: ZoomState = {
  level: DEFAULT_LEVEL,
};

const zoomSlice = createSlice({
  name: 'zoom',
  initialState,
  reducers: {
    setZoom(state, action: PayloadAction<number>) {
      state.level = Math.min(ZOOM_LEVEL_COUNT, Math.max(1, Math.round(action.payload)));
    },
  },
});

export const { setZoom } = zoomSlice.actions;
export default zoomSlice.reducer;
