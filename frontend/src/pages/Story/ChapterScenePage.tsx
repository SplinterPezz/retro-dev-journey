import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { setFlag } from '../../store/storySlice';
import { StoryChapterConfig } from '../../types/story';
import { getChapterIndex } from '../../config/story/chapters';
import { ENGINE_FLAGS } from '../../config/story/flags';
import InteriorScene from './InteriorScene';
import StoryIntroDialog from '../../components/Story/dialogue/StoryIntroDialog';
import { ROUTES } from '../../config/routes';

interface ChapterScenePageProps {
  chapter: StoryChapterConfig;
}

const ChapterScenePage: React.FC<ChapterScenePageProps> = ({ chapter }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const unlockedChapterIndex = useSelector((state: RootState) => state.story.unlockedChapterIndex);
  const introSeen = useSelector(
    (state: RootState) => !!state.story.chapters[chapter.id]?.flags[ENGINE_FLAGS.introSeen]
  );
  const chapterIndex = getChapterIndex(chapter.id);
  const isLocked = unlockedChapterIndex < chapterIndex;

  useEffect(() => {
    if (isLocked) {
      void navigate(ROUTES.storyMap, { replace: true });
    }
  }, [isLocked, navigate]);

  const handleIntroComplete = useCallback(() => {
    dispatch(setFlag({ chapterId: chapter.id, flag: ENGINE_FLAGS.introSeen }));
  }, [dispatch, chapter.id]);

  if (isLocked) {
    return null;
  }

  const showIntro = !!chapter.intro && !introSeen;

  return (
    <div className="rpgui-content">
      <InteriorScene
        chapter={chapter}
        nextUnlockIndex={chapterIndex + 1}
        introPending={showIntro}
      />
      {showIntro && chapter.intro && (
        <StoryIntroDialog title={chapter.intro.title} pages={chapter.intro.pages} onComplete={handleIntroComplete} />
      )}
    </div>
  );
};

export default ChapterScenePage;
