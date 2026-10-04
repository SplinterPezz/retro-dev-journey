import { ChapterProgress } from '../../types/story';
import { CHAPTER_IDS, COMPANY_IDS } from '../ids';
import { PROLOGUE_FLAGS } from './flags';
import { storyUi } from './sprites';

// Chapter order for Story Mode. `companyId` maps a chapter onto a building
// already positioned in config/career.ts's `companies` array, so it shows
// up on the shared overworld map; omit it for a chapter that plays on its
// own standalone map instead (the Prologue has no employer yet, so there's
// no building for it in the world).
export interface ChapterMeta {
  id: string;
  name?: string; // shown in the map's chapter list; a chapter with a company uses the company's name
  companyId?: string;
  // Flag set when the chapter's last scene is over. Until then the map sends
  // the player back to it, even if a save made under older rules already
  // unlocked the next chapter. Kept here so the map does not load the chapter config.
  endFlag?: string;
  // Not playable yet: reaching it shows the "still in development" window on
  // the map instead of entering. Remove it once the chapter is ready.
  inDevelopment?: boolean;
}

export const storyChapterOrder: ChapterMeta[] = [
  { id: CHAPTER_IDS.prologue, name: 'Prologue', endFlag: PROLOGUE_FLAGS.prologueEnded }, // the outro's endFlag in prologue.ts
  { id: CHAPTER_IDS.eikony, companyId: COMPANY_IDS.eikony, inDevelopment: true },
];

// Meep coding at a laptop, in the "still in development" window.
export const inDevelopmentSprite = storyUi('meep_working');

// Background music of the story map, between chapters (placeholder until the real track).
export const storyMapAudioTrack = '/audio/story_map_placeholder.wav';

// Navigation state of a redirect to the map from a chapter that is not ready:
// the map opens its "still in development" window.
export interface InDevelopmentRedirect {
  inDevelopment: string; // the chapter id
}

export const getChapterIndex = (chapterId: string): number =>
  storyChapterOrder.findIndex((c) => c.id === chapterId);

// Finished = completed and, for a chapter with a closing scene, that scene seen
// (a save made under older rules can be completed without it).
export const isChapterFinished = (chapter: ChapterMeta, progress: Record<string, ChapterProgress>): boolean => {
  const own = progress[chapter.id];
  return !!own?.completed && (!chapter.endFlag || !!own.flags[chapter.endFlag]);
};
