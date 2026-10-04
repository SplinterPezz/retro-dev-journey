import { StoryDifficulty } from '../../types/story';

export const DEFAULT_DIFFICULTY: StoryDifficulty = 'junior';

export const storyDifficultyLabels: Record<StoryDifficulty, string> = {
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
};

// null = unlimited
export const maxMistakesByDifficulty: Record<StoryDifficulty, number | null> = {
  junior: null,
  middle: 2,
  senior: 1,
};

export const exceedsMistakeLimit = (mistakes: number, limit: number | null): boolean =>
  limit !== null && mistakes > limit;
