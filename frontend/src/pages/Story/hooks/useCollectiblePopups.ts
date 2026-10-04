import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { collect } from '../../../store/storySlice';
import { CollectibleData, StoryFlags } from '../../../types/story';
import { ENGINE_FLAGS } from '../../../config/story/flags';

interface CollectiblePopupsConfig {
  chapterId: string;
  flags: StoryFlags;
  setFlag: (flag: string) => void;
  foundCount: number; // saved so far, the ones in the queue included
  total: number;
}

// The windows that follow a find: one "Collectible found!" per item, in the
// order they were found, then - after the last one of the chapter - the extra
// lore, once.
export const useCollectiblePopups = ({ chapterId, flags, setFlag, foundCount, total }: CollectiblePopupsConfig) => {
  const dispatch = useDispatch<AppDispatch>();
  const [queue, setQueue] = useState<CollectibleData[]>([]);
  const [loreOpen, setLoreOpen] = useState(false);

  /** Save the find and queue its window. */
  const onFind = useCallback(
    (item: CollectibleData) => {
      dispatch(collect({ chapterId, id: item.id }));
      setQueue((q) => [...q, item]);
    },
    [dispatch, chapterId]
  );

  const allFound = total > 0 && foundCount >= total;

  /** "OK" on the front window: the next one, or the lore after the last find. */
  const confirmFound = () => {
    const rest = queue.slice(1);
    setQueue(rest);
    if (rest.length === 0 && allFound && !flags[ENGINE_FLAGS.collectiblesAllFound]) setLoreOpen(true);
  };

  const confirmLore = () => {
    setFlag(ENGINE_FLAGS.collectiblesAllFound);
    setLoreOpen(false);
  };

  return {
    current: queue[0] as CollectibleData | undefined,
    remaining: Math.max(queue.length - 1, 0),
    /** 1-based number of the front window's find, e.g. 3 of "3 / 5". */
    currentNumber: foundCount - queue.length + 1,
    loreOpen,
    isOpen: queue.length > 0 || loreOpen,
    onFind,
    confirmFound,
    confirmLore,
  };
};
