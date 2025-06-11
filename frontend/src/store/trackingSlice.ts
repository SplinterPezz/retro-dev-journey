import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserTrackingState } from '../types/tracking';

const initialState: UserTrackingState = {
  uuid: '',
  interactions: []
};

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    setUUID(state, action: PayloadAction<string>) {
      state.uuid = action.payload;
    },
    addInteraction(state, action: PayloadAction<string>) {
      if (!state.interactions.includes(action.payload)) {
        state.interactions.push(action.payload);
      }
    },
    resetInteractions(state) {
      state.interactions = [];
    }
  },
});

export const { setUUID, addInteraction, resetInteractions } = trackingSlice.actions;
export default trackingSlice.reducer;