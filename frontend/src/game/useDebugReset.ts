import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { completeChapter, resetChapter, resetStory, setFlag } from '../store/storySlice';
import { ROUTES } from '../config/routes';

export const useDebugReset = (chapterId?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const resetAll = useCallback(() => {
    dispatch(resetStory());
    window.location.href = ROUTES.storyDifficulty;
  }, [dispatch]);

  const resetCurrentChapter = useCallback(() => {
    if (!chapterId) return;
    dispatch(resetChapter({ chapterId }));
    window.location.reload();
  }, [dispatch, chapterId]);

  const completeCurrentChapter = useCallback(
    (requiredFlags: string[], nextUnlockIndex: number) => {
      if (!chapterId) return;
      requiredFlags.forEach((flag) => dispatch(setFlag({ chapterId, flag })));
      dispatch(completeChapter({ chapterId, unlockIndex: nextUnlockIndex }));
      window.location.href = ROUTES.storyMap;
    },
    [dispatch, chapterId]
  );

  return { resetAll, resetCurrentChapter, completeCurrentChapter };
};
