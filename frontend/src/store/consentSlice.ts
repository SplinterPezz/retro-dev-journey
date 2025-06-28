import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConsentState {
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
    setConsentLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    resetConsent(state) {
      state.consentGiven = null;
      state.isLoading = true;
      state.lastUpdated = null;
    },
    setConsentWithLoading(state, action: PayloadAction<{ consent: boolean | null; isLoading: boolean }>) {
      state.consentGiven = action.payload.consent;
      state.isLoading = action.payload.isLoading;
      if (action.payload.consent !== null) {
        state.lastUpdated = new Date().toISOString();
      }
    }
  },
});

export const { 
  setConsentGiven, 
  setConsentLoading, 
  resetConsent,
  setConsentWithLoading 
} = consentSlice.actions;

export default consentSlice.reducer;