import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_MUSIC_VOLUME } from '../config/menu';

// Player preferences that hold across pages and visits (saved with the rest
// of the state). Set from the game menu.
export interface SettingsState {
  musicVolume: number; // 0-100
  musicMuted: boolean;
}

const initialState: SettingsState = {
  musicVolume: DEFAULT_MUSIC_VOLUME,
  musicMuted: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setMusicVolume(state, action: PayloadAction<number>) {
      state.musicVolume = Math.min(100, Math.max(0, action.payload));
    },
    setMusicMuted(state, action: PayloadAction<boolean>) {
      state.musicMuted = action.payload;
    },
  },
});

export const { setMusicVolume, setMusicMuted } = settingsSlice.actions;
export default settingsSlice.reducer;
