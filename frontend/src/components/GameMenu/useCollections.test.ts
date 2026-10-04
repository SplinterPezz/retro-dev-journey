import { CHAPTER_IDS } from '../../config/ids';
import { PROLOGUE_FLAGS } from '../../config/story/flags';
import { chapterCollectibles } from '../../config/story/collectibles';
import { isTechnologyUnlocked } from '../../config/story/chapters';
import { ChapterProgress } from '../../types/story';
import { TechnologyData } from '../../types/sandbox';
import { itemEntries, skillEntries } from './useCollections';

const prologueDone: Record<string, ChapterProgress> = {
  [CHAPTER_IDS.prologue]: { completed: true, flags: { [PROLOGUE_FLAGS.prologueEnded]: true }, collectibles: ['floppy'] },
};

describe('isTechnologyUnlocked', () => {
  const java = { storyChapter: CHAPTER_IDS.prologue } as TechnologyData;

  it('unlocks a technology once its chapter is finished', () => {
    expect(isTechnologyUnlocked(java, prologueDone)).toBe(true);
  });

  it('keeps it locked before, and without a chapter at all', () => {
    expect(isTechnologyUnlocked(java, {})).toBe(false);
    expect(isTechnologyUnlocked({} as TechnologyData, prologueDone)).toBe(false);
  });
});

describe('collection entries', () => {
  it('lists every collectible, found or not', () => {
    const items = itemEntries({ chapters: prologueDone });
    expect(items).toHaveLength(chapterCollectibles[CHAPTER_IDS.prologue].items.length);
    expect(items.filter((i) => i.found).map((i) => i.id)).toEqual(['floppy']);
  });

  it('marks the skills of the finished chapters as found', () => {
    const skills = skillEntries({ chapters: prologueDone });
    expect(skills.some((s) => s.found)).toBe(true);
    expect(skills.some((s) => !s.found)).toBe(true);
    expect(skillEntries({ chapters: {} }).every((s) => !s.found)).toBe(true);
  });
});
