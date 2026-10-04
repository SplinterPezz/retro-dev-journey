import { ChapterProgress } from '../../types/story';
import { TechnologyData } from '../../types/sandbox';
import { CHAPTER_IDS, COMPANY_IDS } from '../ids';
import { companies } from '../career';
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
const isChapterFinished = (chapter: ChapterMeta, progress: Record<string, ChapterProgress>): boolean => {
  const own = progress[chapter.id];
  return !!own?.completed && (!chapter.endFlag || !!own.flags[chapter.endFlag]);
};

export const isTechnologyUnlocked = (tech: TechnologyData, progress: Record<string, ChapterProgress>): boolean => {
  if (!tech.storyChapter) return false;
  const chapter = storyChapterOrder.find((c) => c.id === tech.storyChapter) ?? { id: tech.storyChapter };
  return isChapterFinished(chapter, progress);
};

// "Eikony (IT)" -> "Eikony"
export const companyDisplayName = (companyName: string): string => companyName.replace(/ \(IT\)$/, '');

export const chapterDisplayName = (chapterId: string): string => {
  const chapter = storyChapterOrder.find((c) => c.id === chapterId);
  const company = chapter?.companyId && companies.find((co) => co.id === chapter.companyId);
  if (company) return companyDisplayName(company.name);
  return chapter?.name ?? chapterId;
};
