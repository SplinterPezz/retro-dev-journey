import { StoryState } from '../../types/story';

// When things happened in a story, for the elapsed times and the end-of-game stats. The keys are saved in the
// players' progress: never change one.
export const timelineKey = {
  collectible: (collectibleId: string): string => `collectible:${collectibleId}`,
  chapterCompleted: (chapterId: string): string => `chapterCompleted:${chapterId}`,
};

// ms from the start of the story to the event; undefined when either is unknown (saves older than the timeline)
export const elapsedFor = (story: Pick<StoryState, 'startedAt' | 'timeline'>, key: string): number | undefined => {
  const at = story.timeline?.[key];
  if (story.startedAt === undefined || at === undefined || at < story.startedAt) return undefined;
  return at - story.startedAt;
};
