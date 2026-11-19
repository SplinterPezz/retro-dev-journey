import { completeChapter, resetChapter, resetStory, setFlag } from '../store/storySlice';
import { ROUTES } from '../config/routes';
import { useAppDispatch } from '../store/hooks';

export const useDebugReset = (chapterId?: string) => {
  const dispatch = useAppDispatch();

  const resetAll = () => {
    dispatch(resetStory());
    window.location.href = ROUTES.storyDifficulty;
  };

  const resetCurrentChapter = () => {
    if (!chapterId) return;
    dispatch(resetChapter({ chapterId }));
    window.location.reload();
  };

  const completeCurrentChapter = (requiredFlags: string[], nextUnlockIndex: number) => {
      if (!chapterId) return;
      requiredFlags.forEach((flag) => dispatch(setFlag({ chapterId, flag })));
      dispatch(completeChapter({ chapterId, unlockIndex: nextUnlockIndex }));
      window.location.href = ROUTES.storyMap;
    };

  return { resetAll, resetCurrentChapter, completeCurrentChapter };
};
