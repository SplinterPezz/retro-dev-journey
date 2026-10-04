import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MiniGameScore, StoryDifficulty, StoryOrientation, StoryState } from '../types/story';
import { timelineKey } from '../config/story/timeline';

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

// the first time only: a found-again collectible or a replayed chapter keeps its original time
const recordOnce = (state: StoryState, key: string, at: number) => {
  if (state.timeline?.[key] === undefined) state.timeline = { ...state.timeline, [key]: at };
};

const withTime = <T>(payload: T) => ({ payload: { ...payload, at: Date.now() } });

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setFlag(state, action: PayloadAction<{ chapterId: string; flag: string }>) {
      const chapter = ensureChapter(state, action.payload.chapterId);
      chapter.flags[action.payload.flag] = true;
    },
    recordScore(state, action: PayloadAction<{ chapterId: string; gameId: string; score: MiniGameScore }>) {
      const chapter = ensureChapter(state, action.payload.chapterId);
      const { gameId, score } = action.payload;
      const best = chapter.scores?.[gameId];
      if (!best || score.earned > best.earned) {
        chapter.scores = { ...chapter.scores, [gameId]: score };
      }
    },
    collect: {
      reducer(state, action: PayloadAction<{ chapterId: string; id: string; at: number }>) {
        const chapter = ensureChapter(state, action.payload.chapterId);
        const found = chapter.collectibles ?? [];
        if (!found.includes(action.payload.id)) chapter.collectibles = [...found, action.payload.id];
        recordOnce(state, timelineKey.collectible(action.payload.id), action.payload.at);
      },
      prepare: (payload: { chapterId: string; id: string }) => withTime(payload),
    },
    completeChapter: {
      reducer(state, action: PayloadAction<{ chapterId: string; unlockIndex: number; at: number }>) {
        const chapter = ensureChapter(state, action.payload.chapterId);
        chapter.completed = true;
        if (action.payload.unlockIndex > state.unlockedChapterIndex) {
          state.unlockedChapterIndex = action.payload.unlockIndex;
        }
        recordOnce(state, timelineKey.chapterCompleted(action.payload.chapterId), action.payload.at);
      },
      prepare: (payload: { chapterId: string; unlockIndex: number }) => withTime(payload),
    },
    // choosing the difficulty is what starts a new story
    setDifficulty: {
      reducer(state, action: PayloadAction<{ difficulty: StoryDifficulty; at: number }>) {
        state.difficulty = action.payload.difficulty;
        state.startedAt = action.payload.at;
      },
      prepare: (difficulty: StoryDifficulty) => withTime({ difficulty }),
    },
    setOrientation(state, action: PayloadAction<StoryOrientation>) {
      state.orientation = action.payload;
    },
    markDiscoverySeen(state, action: PayloadAction<string>) {
      const seen = state.discoveriesSeen ?? [];
      if (!seen.includes(action.payload)) state.discoveriesSeen = [...seen, action.payload];
    },
    resetChapter(state, action: PayloadAction<{ chapterId: string }>) {
      const { chapterId } = action.payload;
      const dropped = [
        timelineKey.chapterCompleted(chapterId),
        ...(state.chapters[chapterId]?.collectibles ?? []).map(timelineKey.collectible),
      ];
      dropped.forEach((key) => delete state.timeline?.[key]);
      delete state.chapters[chapterId];
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
