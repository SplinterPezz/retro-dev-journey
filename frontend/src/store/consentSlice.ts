import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConsentState {
  consentGiven: boolean | null;
  isLoading: boolean;
  lastUpdated: string | null;
}

const initialState: ConsentState = {
  consentGiven: null,
  isLoading: true,
  lastUpdated: null,
};

const consentSlice = createSlice({
  name: 'consent',
  initialState,
  reducers: {
    setConsentGiven(state, action: PayloadAction<boolean>) {
      state.consentGiven = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.isLoading = false;
    },
  },
});

export const { setConsentGiven } = consentSlice.actions;

export default consentSlice.reducer;