import { ChapterProgress } from '../../types/story';
import { CHAPTER_IDS, COMPANY_IDS } from '../ids';
import { PROLOGUE_FLAGS } from './flags';
import { storyUi } from './sprites';

// A chapter without companyId has no building on the overworld and plays on its own map.
export interface ChapterMeta {
  id: string;
  name?: string;
  companyId?: string;
  endFlag?: string;
  inDevelopment?: boolean;
}

export const storyChapterOrder: ChapterMeta[] = [
  { id: CHAPTER_IDS.prologue, name: 'Prologue', endFlag: PROLOGUE_FLAGS.prologueEnded },
  { id: CHAPTER_IDS.eikony, companyId: COMPANY_IDS.eikony, inDevelopment: true },
];

export const inDevelopmentSprite = storyUi('meep_working');

export const storyMapAudioTrack = '/audio/story_map_placeholder.wav';

export interface InDevelopmentRedirect {
  inDevelopment: string;
}

export const getChapterIndex = (chapterId: string): number =>
  storyChapterOrder.findIndex((c) => c.id === chapterId);

// Older saves can be completed without having seen the closing scene.
export const isChapterFinished = (chapter: ChapterMeta, progress: Record<string, ChapterProgress>): boolean => {
  const own = progress[chapter.id];
  return !!own?.completed && (!chapter.endFlag || !!own.flags[chapter.endFlag]);
};
