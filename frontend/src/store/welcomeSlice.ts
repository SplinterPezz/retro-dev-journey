import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WelcomeUser } from '../types/tracking';

const initialState: WelcomeUser = {
  tipsAcceptedDesktop: false,
  tipsAcceptedMobile: false,
};

const welcomeSlice = createSlice({
  name: 'welcome',
  initialState,
  reducers: {
    setTipsAcceptedDesktop(state, action: PayloadAction<boolean>) {
      state.tipsAcceptedDesktop = action.payload;
    },
    setTipsAcceptedMobile(state, action: PayloadAction<boolean>) {
      state.tipsAcceptedMobile = action.payload;
    },
  },
});

export const { 
  setTipsAcceptedDesktop, 
  setTipsAcceptedMobile
} = welcomeSlice.actions;

export default welcomeSlice.reducer;