import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoryDifficulty, StoryOrientation, StoryState } from '../types/story';

const initialState: StoryState = {
  unlockedChapterIndex: 0,
  chapters: {},
  difficulty: null,
  orientation: null,
};

const ensureChapter = (state: StoryState, chapterId: string) => {
  if (!state.chapters[chapterId]) {
    state.chapters[chapterId] = { completed: false, flags: {} };
  }
  return state.chapters[chapterId];
};

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setFlag(state, action: PayloadAction<{ chapterId: string; flag: string }>) {
      const chapter = ensureChapter(state, action.payload.chapterId);
      chapter.flags[action.payload.flag] = true;
    },
    completeChapter(state, action: PayloadAction<{ chapterId: string; unlockIndex: number }>) {
      const chapter = ensureChapter(state, action.payload.chapterId);
      chapter.completed = true;
      if (action.payload.unlockIndex > state.unlockedChapterIndex) {
        state.unlockedChapterIndex = action.payload.unlockIndex;
      }
    },
    setDifficulty(state, action: PayloadAction<StoryDifficulty>) {
      state.difficulty = action.payload;
    },
    setOrientation(state, action: PayloadAction<StoryOrientation>) {
      state.orientation = action.payload;
    },
    resetChapter(state, action: PayloadAction<{ chapterId: string }>) {
      delete state.chapters[action.payload.chapterId];
    },
    resetStory(state) {
      // keep the chosen difficulty and screen orientation - reset only clears progress
      return { ...initialState, difficulty: state.difficulty, orientation: state.orientation };
    },
  },
});

export const { setFlag, completeChapter, setDifficulty, setOrientation, resetChapter, resetStory } = storySlice.actions;
export default storySlice.reducer;
