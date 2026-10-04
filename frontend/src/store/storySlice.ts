import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MiniGameScore, StoryDifficulty, StoryOrientation, StoryState } from '../types/story';

const initialState: StoryState = {
  unlockedChapterIndex: 0,
  chapters: {},
  difficulty: null,
  orientation: null,
  discoveriesSeen: [],
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
    // Keeps the best result per mini game.
    recordScore(state, action: PayloadAction<{ chapterId: string; gameId: string; score: MiniGameScore }>) {
      const chapter = ensureChapter(state, action.payload.chapterId);
      const { gameId, score } = action.payload;
      const best = chapter.scores?.[gameId];
      if (!best || score.earned > best.earned) {
        chapter.scores = { ...chapter.scores, [gameId]: score };
      }
    },
    collect(state, action: PayloadAction<{ chapterId: string; id: string }>) {
      const chapter = ensureChapter(state, action.payload.chapterId);
      const found = chapter.collectibles ?? [];
      if (!found.includes(action.payload.id)) chapter.collectibles = [...found, action.payload.id];
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
    markDiscoverySeen(state, action: PayloadAction<string>) {
      const seen = state.discoveriesSeen ?? [];
      if (!seen.includes(action.payload)) state.discoveriesSeen = [...seen, action.payload];
    },
    resetChapter(state, action: PayloadAction<{ chapterId: string }>) {
      delete state.chapters[action.payload.chapterId];
    },
    resetStory(state) {
      // a new story asks for the difficulty again; the screen orientation is kept
      return { ...initialState, orientation: state.orientation };
    },
  },
});

export const {
  setFlag,
  recordScore,
  collect,
  completeChapter,
  setDifficulty,
  setOrientation,
  markDiscoverySeen,
  resetChapter,
  resetStory,
} = storySlice.actions;
export default storySlice.reducer;
