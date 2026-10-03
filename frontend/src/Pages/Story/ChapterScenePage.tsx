import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { setFlag } from '../../store/storySlice';
import { StoryChapterConfig } from '../../types/story';
import { getChapterIndex } from '../../config/story/chapters';
import InteriorScene from './InteriorScene';
import StoryIntroDialog from '../../Components/Story/dialogue/StoryIntroDialog';

interface ChapterScenePageProps {
  chapter: StoryChapterConfig;
}

// Shared page for every chapter: redirects back to the map while the chapter
// is still locked, shows the chapter's one-time intro (if it has one), then
// hands the world to InteriorScene. Unlocking the next chapter is driven by
// the chapter's position in storyChapterOrder.
const ChapterScenePage: React.FC<ChapterScenePageProps> = ({ chapter }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const unlockedChapterIndex = useSelector((state: RootState) => state.story.unlockedChapterIndex);
  const introSeen = useSelector(
    (state: RootState) => !!state.story.chapters[chapter.id]?.flags.introSeen
  );
  const chapterIndex = getChapterIndex(chapter.id);
  const isLocked = unlockedChapterIndex < chapterIndex;

  useEffect(() => {
    if (isLocked) {
      navigate('/story', { replace: true });
    }
  }, [isLocked, navigate]);

  const handleIntroComplete = useCallback(() => {
    dispatch(setFlag({ chapterId: chapter.id, flag: 'introSeen' }));
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
