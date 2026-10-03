import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { resetChapter, resetStory } from '../store/storySlice';

// Debug buttons of the Story scenes: wipe the progress and reload.
export const useDebugReset = (chapterId?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const resetAll = useCallback(() => {
    dispatch(resetStory());
    window.location.href = '/story/difficulty';
  }, [dispatch]);

  const resetCurrentChapter = useCallback(() => {
    if (!chapterId) return;
    dispatch(resetChapter({ chapterId }));
    window.location.reload();
  }, [dispatch, chapterId]);

  return { resetAll, resetCurrentChapter };
};
