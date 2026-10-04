import { StoryDifficulty } from '../../types/story';

// Used until the player picks one, and for questions written without a level.
export const DEFAULT_DIFFICULTY: StoryDifficulty = 'junior';

export const storyDifficultyLabels: Record<StoryDifficulty, string> = {
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
};

// Mistakes allowed in one topic before it resets to question 1 (null = unlimited).
export const maxMistakesByDifficulty: Record<StoryDifficulty, number | null> = {
  junior: null,
  middle: 2,
  senior: 1,
};

// One rule for quizzes and mini games: `limit` mistakes are allowed, the next
// one restarts. null = unlimited.
export const exceedsMistakeLimit = (mistakes: number, limit: number | null): boolean =>
  limit !== null && mistakes > limit;
