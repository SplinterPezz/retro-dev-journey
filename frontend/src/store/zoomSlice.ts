import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Level 3 is the 1:1 view.
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
