import React from 'react';
import { Navigate, useParams } from 'react-router';
import { StoryChapterConfig } from '../../types/story';
import { prologueChapter } from '../../config/story/prologue';
import { eikonyChapter } from '../../config/story/eikony';
import ChapterScenePage from './ChapterScenePage';

// Every playable chapter, by the id used in its URL (/story/<id>).
const chapters: Record<string, StoryChapterConfig> = {
  [prologueChapter.id]: prologueChapter,
  [eikonyChapter.id]: eikonyChapter,
};

const ChapterRoute: React.FC = () => {
  const { chapterId } = useParams();
  const chapter = chapterId ? chapters[chapterId] : undefined;
  if (!chapter) return <Navigate to="/story" replace />;
  // keyed by chapter: moving between chapters starts a fresh scene
  return <ChapterScenePage key={chapter.id} chapter={chapter} />;
};

export default ChapterRoute;
