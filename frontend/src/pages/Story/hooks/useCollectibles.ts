import { useEffect, useRef } from 'react';
import { ChapterCollectibles, CollectibleData, CollectibleSpot, StoryFlags } from '../../../types/story';
import { Position } from '../../../types/game';
import { revealFlag } from '../../../config/story/flags';
import { isWithin } from '../../../game/collision';

/** Walking this close to a collectible picks it up. */
export const PICKUP_RADIUS = 40;
/** A collectible shows (with a sparkle) only within this distance, unless it sets its own revealRadius. */
export const DEFAULT_REVEAL_RADIUS = 180;

const isInSpot = (p: Position, spot: CollectibleSpot) => isWithin(p, spot, spot.radius);

// ---- what each kind of collectible needs (see CollectibleUnlock) ----

/** Ready to be taken: no condition, its flag is set, or its sequence / wait is done. */
const isAvailable = (item: CollectibleData, flags: StoryFlags): boolean => {
  const unlock = item.unlock;
  if (!unlock) return true;
  if (unlock.kind === 'flag') return !!flags[unlock.flag];
  return !!flags[revealFlag(item.id)];
};

/** A 'flag' collectible is handed over directly (a dialogue answer); the others lie on the map. */
const isGivenByFlag = (item: CollectibleData) => item.unlock?.kind === 'flag';

// Progress through a sequence ("coffee, water, coffee"): which step is next,
// and which spot the player is standing in (a step counts on entering a spot).
interface SequenceProgress {
  nextStep: number;
  inSpot: string | null;
}

// Entering the next spot of the order moves on; entering any other spot starts
// over (counting it as step 1 if it is the first spot of the order).
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
  enabled: boolean; // false while a dialogue, popup or cutscene owns the scene
  onFind: (item: CollectibleData) => void;
}

export interface CollectibleOnMap {
  item: CollectibleData;
  near: boolean; // close enough to see it
}

// The chapter's hidden collectibles: what each one needs before it can be
// taken, picking it up by walking over it, and which ones lie on the map now.
//
// The first two effects have no dependency list on purpose: they check the
// player's position, so they run on every step.
export const useCollectibles = ({ collectibles, found, flags, setFlag, playerPosition, isMoving, enabled, onFind }: CollectiblesConfig) => {
  const items = collectibles?.items ?? [];

  // Found = saved, or handed out a moment ago and not saved yet (so nothing is given twice).
  const givenRef = useRef(new Set<string>());
  const isFound = (item: CollectibleData) => found.includes(item.id) || givenRef.current.has(item.id);
  const give = (item: CollectibleData) => {
    givenRef.current.add(item.id);
    onFind(item);
  };

  // Hand over what is available: a flag one at once, the others when walked over.
  useEffect(() => {
    if (!enabled) return;
    for (const item of items) {
      if (isFound(item) || !isAvailable(item, flags)) continue;
      const walkedOver = !!item.position && isWithin(playerPosition, item.position, PICKUP_RADIUS);
      if (isGivenByFlag(item) || walkedOver) give(item);
    }
  });

  // Sequences: follow the player through the spots, reveal the item once the order is done.
  const sequencesRef = useRef<Record<string, SequenceProgress>>({});
  useEffect(() => {
    for (const item of items) {
      const unlock = item.unlock;
      if (unlock?.kind !== 'sequence' || isFound(item) || flags[revealFlag(item.id)]) continue;

      const progress = (sequencesRef.current[item.id] ??= { nextStep: 0, inSpot: null });
      const spot = Object.keys(unlock.spots).find((id) => isInSpot(playerPosition, unlock.spots[id])) ?? null;
      if (spot === progress.inSpot) continue; // still in the same spot (or still outside all of them)
      progress.inSpot = spot;
      if (!spot) continue;

      advanceSequence(unlock.order, progress, spot);
      if (progress.nextStep >= unlock.order.length) setFlag(revealFlag(item.id));
    }
  });

  // Waits: standing still in the spot for `seconds` reveals the item. The timers
  // are re-armed only when who is waiting changes, not on every frame.
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

  // On the map: available, not found, not a flag one. `near` decides if it shows.
  const onMap: CollectibleOnMap[] = items.flatMap((item) => {
    if (!item.position || isFound(item) || !isAvailable(item, flags) || isGivenByFlag(item)) return [];
    const near = isWithin(playerPosition, item.position, item.revealRadius ?? DEFAULT_REVEAL_RADIUS);
    return [{ item, near }];
  });

  return { onMap, total: items.length };
};
