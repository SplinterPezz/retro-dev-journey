import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserTrackingState } from '../types/tracking';

const initialState: UserTrackingState = {
  uuid: '',
  interactions: []
};

const extractDateFromKey = (key: string): string | null => {
  const [year, month, day] = key.split('-').slice(-3);
  return year?.length === 4 && month?.length === 2 && day?.length === 2 ? `${year}-${month}-${day}` : null;
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