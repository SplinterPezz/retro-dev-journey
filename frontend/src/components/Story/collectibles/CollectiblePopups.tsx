import React from 'react';
import UnlockPopup from '../hud/UnlockPopup';
import { useAppSelector } from '../../../store/hooks';
import { collectibleCheer, collectibleIcon } from '../../../config/story/collectibles';
import { elapsedFor, timelineKey } from '../../../config/story/timeline';
import { CollectibleData } from '../../../types/story';

interface CollectiblePopupsProps {
  current?: CollectibleData;
  currentNumber: number;
  remaining: number;
  total: number;
  onConfirmFound: () => void;
  // the extra lore shown once every collectible of the chapter is found
  allFoundText?: string;
  onConfirmLore: () => void;
}

const CollectiblePopups: React.FC<CollectiblePopupsProps> = ({
  current,
  currentNumber,
  remaining,
  total,
  onConfirmFound,
  allFoundText,
  onConfirmLore,
}) => {
  const startedAt = useAppSelector((state) => state.story.startedAt);
  const timeline = useAppSelector((state) => state.story.timeline);

  return (
    <>
      {current && (
        <UnlockPopup
          kicker="Collectible found!"
          image={current.image}
          title={current.name}
          subtitle={`${currentNumber} / ${total}`}
          text={current.description}
          cornerImage={collectibleCheer}
          rarity={current.rarity}
          elapsedMs={elapsedFor({ startedAt, timeline }, timelineKey.collectible(current.id))}
          remaining={remaining}
          onConfirm={onConfirmFound}
        />
      )}
      {allFoundText && (
        <UnlockPopup
          kicker="All collectibles found!"
          image={collectibleIcon}
          title={`${total} / ${total}`}
          text={allFoundText}
          cornerImage={collectibleCheer}
          remaining={0}
          onConfirm={onConfirmLore}
        />
      )}
    </>
  );
};

export default CollectiblePopups;
