import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { technologies } from '../../config/career';
import { chapterCollectibles } from '../../config/story/collectibles';
import { isTechnologyUnlocked, storyChapterOrder } from '../../config/story/chapters';
import { ChapterProgress } from '../../types/story';
import { TechnologyData } from '../../types/sandbox';
import { Rarity } from '../../types/game';

export interface CollectionEntry {
  id: string;
  name: string;
  image: string;
  description: string;
  rarity: Rarity;
  found: boolean;
}

export const itemEntries = (progress: Record<string, ChapterProgress>): CollectionEntry[] =>
  storyChapterOrder.flatMap((chapter) =>
    (chapterCollectibles[chapter.id]?.items ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      description: item.description,
      rarity: item.rarity,
      found: !!progress[chapter.id]?.collectibles?.includes(item.id),
    }))
  );

export const skillEntry = (tech: TechnologyData, found: boolean): CollectionEntry => ({
  id: tech.id,
  name: tech.name,
  image: tech.image,
  description: tech.learnedText ?? tech.description ?? '',
  rarity: tech.rarity,
  found,
});

export const skillEntries = (progress: Record<string, ChapterProgress>): CollectionEntry[] =>
  technologies.map((structure) => {
    const tech = structure.data as TechnologyData;
    return skillEntry(tech, isTechnologyUnlocked(tech, progress));
  });

export const useCollection = (kind: 'items' | 'skills'): CollectionEntry[] => {
  const progress = useSelector((state: RootState) => state.story.chapters);
  return useMemo(() => (kind === 'items' ? itemEntries(progress) : skillEntries(progress)), [kind, progress]);
};
