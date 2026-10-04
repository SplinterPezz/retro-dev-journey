import { useEffect, useRef } from 'react';
import { ChapterCollectibles, CollectibleData, CollectibleSpot } from '../../../types/story';
import { Position } from '../../../types/game';

export const PICKUP_RADIUS = 40;
export const DEFAULT_REVEAL_RADIUS = 180;

// Flag that keeps a collectible available once its sequence or wait is done.
export const revealFlag = (id: string) => `collectible_${id}_revealed`;

const inSpot = (p: Position, s: CollectibleSpot) => Math.hypot(p.x - s.x, p.y - s.y) < s.radius;

interface CollectiblesConfig {
  collectibles?: ChapterCollectibles;
  found: string[];
  flags: Record<string, boolean>;
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
// taken (see CollectibleUnlock), picking it up by walking over it, and which
// ones lie on the map right now.
export const useCollectibles = ({ collectibles, found, flags, setFlag, playerPosition, isMoving, enabled, onFind }: CollectiblesConfig) => {
  const items = collectibles?.items ?? [];
  // found plus the ones handed out but not saved yet, so nothing is given twice
  const givenRef = useRef(new Set<string>());
  const isFound = (item: CollectibleData) => found.includes(item.id) || givenRef.current.has(item.id);
  const give = (item: CollectibleData) => {
    givenRef.current.add(item.id);
    onFind(item);
  };

  const available = (item: CollectibleData) => {
    const unlock = item.unlock;
    if (!unlock) return true;
    if (unlock.kind === 'flag') return !!flags[unlock.flag];
    return !!flags[revealFlag(item.id)];
  };

  // Given by a flag (a dialogue answer) or picked up by walking over it.
  useEffect(() => {
    if (!enabled) return;
    for (const item of items) {
      if (isFound(item) || !available(item)) continue;
      const byFlag = item.unlock?.kind === 'flag';
      const reached = item.position && Math.hypot(playerPosition.x - item.position.x, playerPosition.y - item.position.y) < PICKUP_RADIUS;
      if (byFlag || reached) give(item);
    }
  });

  // Sequences: entering the next spot moves on, any other spot starts over.
  const sequenceRef = useRef<Record<string, { index: number; inside: string | null }>>({});
  useEffect(() => {
    for (const item of items) {
      const unlock = item.unlock;
      if (unlock?.kind !== 'sequence' || isFound(item) || flags[revealFlag(item.id)]) continue;
      const progress = (sequenceRef.current[item.id] ??= { index: 0, inside: null });
      const spot = Object.keys(unlock.spots).find((id) => inSpot(playerPosition, unlock.spots[id])) ?? null;
      if (spot === progress.inside) continue;
      progress.inside = spot;
      if (!spot) continue;
      if (spot === unlock.order[progress.index]) progress.index += 1;
      else progress.index = spot === unlock.order[0] ? 1 : 0;
      if (progress.index >= unlock.order.length) setFlag(revealFlag(item.id));
    }
  });

  // Waits: standing still in the spot long enough.
  const waiting = items.filter((item) => {
    const unlock = item.unlock;
    return unlock?.kind === 'idle' && !isFound(item) && !flags[revealFlag(item.id)] && !isMoving && inSpot(playerPosition, unlock.spot);
  });
  const waitingKey = waiting.map((item) => item.id).join(',');
  useEffect(() => {
    if (!enabled || !waitingKey) return;
    const timers = waiting.map((item) =>
      setTimeout(() => setFlag(revealFlag(item.id)), (item.unlock?.kind === 'idle' ? item.unlock.seconds : 0) * 1000)
    );
    return () => timers.forEach(clearTimeout);
    // Re-armed only when who is waiting changes, not on every frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitingKey, enabled]);

  const onMap: CollectibleOnMap[] = items.flatMap((item) => {
    const at = item.position;
    if (!at || isFound(item) || !available(item) || item.unlock?.kind === 'flag') return [];
    const near = Math.hypot(playerPosition.x - at.x, playerPosition.y - at.y) < (item.revealRadius ?? DEFAULT_REVEAL_RADIUS);
    return [{ item, near }];
  });

  return { onMap, total: items.length };
};
