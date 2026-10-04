import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserTrackingState } from '../types/tracking';

const initialState: UserTrackingState = {
  uuid: '',
  interactions: []
};

const extractDateFromKey = (key: string): string | null => {
  const parts = key.split('-');
  if (parts.length >= 3) {
    // YYYY-MM-DD
    const dateParts = parts.slice(-3);
    if (dateParts.length === 3 && 
        dateParts[0].length === 4 &&
        dateParts[1].length === 2 &&
        dateParts[2].length === 2) {
      return dateParts.join('-');
    }
  }
  return null;
};

const isInteractionOlderThanToday = (key: string): boolean => {
  const interactionDate = extractDateFromKey(key);
  if (!interactionDate) return false;
  
  const today = new Date().toISOString().slice(0, 10);
  return interactionDate < today;
};

const cleanOldInteractionsFunction = (interactions: string[]): string[] => {
  return interactions.filter(key => !isInteractionOlderThanToday(key));
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
    cleanOldInteractions(state) {
      state.interactions = cleanOldInteractionsFunction(state.interactions);
    },
    clearAllTrackingData(state) {
      state.uuid = '';
      state.interactions = [];
    },
  },
});

export const { setUUID, addInteraction, cleanOldInteractions, clearAllTrackingData } = trackingSlice.actions;

export default trackingSlice.reducer;