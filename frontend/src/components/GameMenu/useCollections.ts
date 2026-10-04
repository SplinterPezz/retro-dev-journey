import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { technologies } from '../../config/career';
import { chapterCollectibles } from '../../config/story/collectibles';
import { isTechnologyUnlocked, storyChapterOrder } from '../../config/story/chapters';
import { elapsedFor, timelineKey } from '../../config/story/timeline';
import { StoryState } from '../../types/story';
import { TechnologyData } from '../../types/sandbox';
import { Rarity } from '../../types/game';

export interface CollectionEntry {
  id: string;
  name: string;
  image: string;
  description: string;
  rarity: Rarity;
  found: boolean;
  elapsedMs?: number;
}

type StoryProgress = Pick<StoryState, 'chapters' | 'startedAt' | 'timeline'>;

export const itemEntries = (story: StoryProgress): CollectionEntry[] =>
  storyChapterOrder.flatMap((chapter) =>
    (chapterCollectibles[chapter.id]?.items ?? []).map((item) => {
      const found = !!story.chapters[chapter.id]?.collectibles?.includes(item.id);
      return {
        id: item.id,
        name: item.name,
        image: item.image,
        description: item.description,
        rarity: item.rarity,
        found,
        elapsedMs: found ? elapsedFor(story, timelineKey.collectible(item.id)) : undefined,
      };
    })
  );

// a skill is unlocked when the chapter that teaches it is finished
export const skillElapsed = (tech: TechnologyData, story: Pick<StoryState, 'startedAt' | 'timeline'>) =>
  tech.storyChapter ? elapsedFor(story, timelineKey.chapterCompleted(tech.storyChapter)) : undefined;

export const skillEntry = (tech: TechnologyData, found: boolean, elapsedMs?: number): CollectionEntry => ({
  id: tech.id,
  name: tech.name,
  image: tech.image,
  description: tech.learnedText ?? tech.description ?? '',
  rarity: tech.rarity,
  found,
  elapsedMs,
});

export const skillEntries = (story: StoryProgress): CollectionEntry[] =>
  technologies.map((structure) => {
    const tech = structure.data as TechnologyData;
    const found = isTechnologyUnlocked(tech, story.chapters);
    return skillEntry(tech, found, found ? skillElapsed(tech, story) : undefined);
  });

export const useCollection = (kind: 'items' | 'skills'): CollectionEntry[] => {
  const chapters = useSelector((state: RootState) => state.story.chapters);
  const startedAt = useSelector((state: RootState) => state.story.startedAt);
  const timeline = useSelector((state: RootState) => state.story.timeline);
  return useMemo(() => {
    const story = { chapters, startedAt, timeline };
    return kind === 'items' ? itemEntries(story) : skillEntries(story);
  }, [kind, chapters, startedAt, timeline]);
};
