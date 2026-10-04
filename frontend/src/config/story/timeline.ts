import { StoryState } from '../../types/story';

// When things happened in a story, for the elapsed times and the end-of-game stats. The keys are saved in the
// players' progress: never change one.
export const timelineKey = {
  collectible: (collectibleId: string): string => `collectible:${collectibleId}`,
  chapterCompleted: (chapterId: string): string => `chapterCompleted:${chapterId}`,
  flag: (chapterId: string, flag: string): string => `flag:${chapterId}:${flag}`,
  miniGame: (chapterId: string, gameId: string): string => `miniGame:${chapterId}:${gameId}`,
};

// the flag and mini game events of a chapter (its collectibles are keyed by their own id)
export const isChapterEvent = (key: string, chapterId: string): boolean =>
  key === timelineKey.chapterCompleted(chapterId) ||
  key.startsWith(timelineKey.flag(chapterId, '')) ||
  key.startsWith(timelineKey.miniGame(chapterId, ''));

// ms from the start of the story to the event; undefined when either is unknown (saves older than the timeline)
export const elapsedFor = (story: Pick<StoryState, 'startedAt' | 'timeline'>, key: string): number | undefined => {
  const at = story.timeline?.[key];
  if (story.startedAt === undefined || at === undefined || at < story.startedAt) return undefined;
  return at - story.startedAt;
};
