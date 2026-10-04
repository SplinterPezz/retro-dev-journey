import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_DIALOGUE_VOLUME, DEFAULT_MUSIC_VOLUME } from '../config/menu';

// Player preferences that hold across pages and visits (saved with the rest
// of the state). Set from the game menu.
export interface SettingsState {
  musicVolume: number; // 0-100
  musicMuted: boolean;
  dialogueVolume: number; // 0-100, the typing sound of the dialogue box
  dialogueMuted: boolean;
  soundAsked: boolean; // the one-time "Do you want sound?" screen has been answered
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
    // the answer to "Do you want sound?": music and dialogue sound together
    chooseSound(state, action: PayloadAction<boolean>) {
      state.musicMuted = !action.payload;
      state.dialogueMuted = !action.payload;
      state.soundAsked = true;
    },
  },
});

// Settings saved before the dialogue sound existed come back without its
// fields (redux-persist restores the saved slice as it was): read them here.
export const selectDialogueSound = (settings: Partial<SettingsState>) => ({
  dialogueVolume: settings.dialogueVolume ?? DEFAULT_DIALOGUE_VOLUME,
  dialogueMuted: settings.dialogueMuted ?? true,
});

export const { setMusicVolume, setMusicMuted, setDialogueVolume, setDialogueMuted, chooseSound } = settingsSlice.actions;
export default settingsSlice.reducer;
