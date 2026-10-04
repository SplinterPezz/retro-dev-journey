import React from 'react';
import { Navigate, useParams } from 'react-router';
import { StoryChapterConfig } from '../../types/story';
import { prologueChapter } from '../../config/story/prologue';
import { eikonyChapter } from '../../config/story/eikony';
import { InDevelopmentRedirect, storyChapterOrder } from '../../config/story/chapters';
import ChapterScenePage from './ChapterScenePage';
import { ROUTES } from '../../config/routes';

// Every playable chapter, by the id used in its URL (/story/<id>).
const chapters: Record<string, StoryChapterConfig> = {
  [prologueChapter.id]: prologueChapter,
  [eikonyChapter.id]: eikonyChapter,
};

const ChapterRoute: React.FC = () => {
  const { chapterId } = useParams();
  const chapter = chapterId ? chapters[chapterId] : undefined;
  if (!chapter) return <Navigate to={ROUTES.storyMap} replace />;
  // not playable yet: back to the map, which tells the player so
  if (storyChapterOrder.find((c) => c.id === chapter.id)?.inDevelopment) {
    const state: InDevelopmentRedirect = { inDevelopment: chapter.id };
    return <Navigate to={ROUTES.storyMap} replace state={state} />;
  }
  // keyed by chapter: moving between chapters starts a fresh scene
  return <ChapterScenePage key={chapter.id} chapter={chapter} />;
};

export default ChapterRoute;
