import { StoryDifficulty } from '../../types/story';

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
