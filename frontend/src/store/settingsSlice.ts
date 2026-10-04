import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_DIALOGUE_VOLUME, DEFAULT_MUSIC_VOLUME } from '../config/menu';

export interface SettingsState {
  musicVolume: number;
  musicMuted: boolean;
  dialogueVolume: number;
  dialogueMuted: boolean;
  soundAsked: boolean;
}

const initialState: SettingsState = {
  musicVolume: DEFAULT_MUSIC_VOLUME,
  musicMuted: true,
  dialogueVolume: DEFAULT_DIALOGUE_VOLUME,
  dialogueMuted: true,
  soundAsked: false,
};

const clampVolume = (volume: number) => Math.min(100, Math.max(0, volume));

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setMusicVolume(state, action: PayloadAction<number>) {
      state.musicVolume = clampVolume(action.payload);
    },
    setMusicMuted(state, action: PayloadAction<boolean>) {
      state.musicMuted = action.payload;
    },
    setDialogueVolume(state, action: PayloadAction<number>) {
      state.dialogueVolume = clampVolume(action.payload);
    },
    setDialogueMuted(state, action: PayloadAction<boolean>) {
      state.dialogueMuted = action.payload;
    },
    chooseSound(state, action: PayloadAction<boolean>) {
      state.musicMuted = !action.payload;
      state.dialogueMuted = !action.payload;
      state.soundAsked = true;
    },
  },
});

// settings saved before these fields existed come back without them
export const selectDialogueSound = (settings: Partial<SettingsState>) => ({
  dialogueVolume: settings.dialogueVolume ?? DEFAULT_DIALOGUE_VOLUME,
  dialogueMuted: settings.dialogueMuted ?? true,
});

export const { setMusicVolume, setMusicMuted, setDialogueVolume, setDialogueMuted, chooseSound } = settingsSlice.actions;
export default settingsSlice.reducer;
