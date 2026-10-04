import { useEffect, useRef } from 'react';
import { ChapterCollectibles, CollectibleData, CollectibleSpot, StoryFlags } from '../../../types/story';
import { Position } from '../../../types/game';
import { revealFlag } from '../../../config/story/flags';
import { isWithin } from '../../../game/collision';

export const PICKUP_RADIUS = 40;
const DEFAULT_REVEAL_RADIUS = 180;

const isInSpot = (p: Position, spot: CollectibleSpot) => isWithin(p, spot, spot.radius);

const isAvailable = (item: CollectibleData, flags: StoryFlags): boolean => {
  const unlock = item.unlock;
  if (!unlock) return true;
  if (unlock.kind === 'flag') return !!flags[unlock.flag];
  return !!flags[revealFlag(item.id)];
};

const isGivenByFlag = (item: CollectibleData) => item.unlock?.kind === 'flag';

interface SequenceProgress {
  nextStep: number;
  inSpot: string | null;
}

// any other spot starts over (as step 1 if it is the first of the order)
const advanceSequence = (order: string[], progress: SequenceProgress, spot: string): void => {
  if (spot === order[progress.nextStep]) progress.nextStep += 1;
  else progress.nextStep = spot === order[0] ? 1 : 0;
};

interface CollectiblesConfig {
  collectibles?: ChapterCollectibles;
  found: string[];
  flags: StoryFlags;
  setFlag: (flag: string) => void;
  playerPosition: Position;
  isMoving: boolean;
  enabled: boolean;
  onFind: (item: CollectibleData) => void;
}

interface CollectibleOnMap {
  item: CollectibleData;
  near: boolean;
}

// The first two effects have no dependency list on purpose: they run on every step.
export const useCollectibles = ({ collectibles, found, flags, setFlag, playerPosition, isMoving, enabled, onFind }: CollectiblesConfig) => {
  const items = collectibles?.items ?? [];

  // given a moment ago and not saved yet: nothing is given twice
  const givenRef = useRef(new Set<string>());
  const isFound = (item: CollectibleData) => found.includes(item.id) || givenRef.current.has(item.id);
  const give = (item: CollectibleData) => {
    givenRef.current.add(item.id);
    onFind(item);
  };

  useEffect(() => {
    if (!enabled) return;
    for (const item of items) {
      if (isFound(item) || !isAvailable(item, flags)) continue;
      const walkedOver = !!item.position && isWithin(playerPosition, item.position, PICKUP_RADIUS);
      if (isGivenByFlag(item) || walkedOver) give(item);
    }
  });

  const sequencesRef = useRef<Record<string, SequenceProgress>>({});
  useEffect(() => {
    for (const item of items) {
      const unlock = item.unlock;
      if (unlock?.kind !== 'sequence' || isFound(item) || flags[revealFlag(item.id)]) continue;

      const progress = (sequencesRef.current[item.id] ??= { nextStep: 0, inSpot: null });
      const spot = Object.keys(unlock.spots).find((id) => isInSpot(playerPosition, unlock.spots[id])) ?? null;
      if (spot === progress.inSpot) continue;
      progress.inSpot = spot;
      if (!spot) continue;

      advanceSequence(unlock.order, progress, spot);
      if (progress.nextStep >= unlock.order.length) setFlag(revealFlag(item.id));
    }
  });

  // timers re-armed only when who is waiting changes, not on every frame
  const waiting = items.filter((item) => {
    const unlock = item.unlock;
    if (unlock?.kind !== 'idle' || isFound(item) || flags[revealFlag(item.id)]) return false;
    return !isMoving && isInSpot(playerPosition, unlock.spot);
  });
  const waitingKey = waiting.map((item) => item.id).join(',');
  useEffect(() => {
    if (!enabled || !waitingKey) return;
    const timers = waiting.map((item) => {
      const seconds = item.unlock?.kind === 'idle' ? item.unlock.seconds : 0;
      return setTimeout(() => setFlag(revealFlag(item.id)), seconds * 1000);
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitingKey, enabled]);

  const onMap: CollectibleOnMap[] = items.flatMap((item) => {
    if (!item.position || isFound(item) || !isAvailable(item, flags) || isGivenByFlag(item)) return [];
    const near = isWithin(playerPosition, item.position, item.revealRadius ?? DEFAULT_REVEAL_RADIUS);
    return [{ item, near }];
  });

  return { onMap, total: items.length };
};
