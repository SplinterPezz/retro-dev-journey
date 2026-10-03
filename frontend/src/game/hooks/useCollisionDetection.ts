import { useMemo, useRef } from 'react';
import { CollidableEntity, Position } from '../../types/game';
import { findNearest } from '../collision';

interface CollisionDetectionConfig<T extends CollidableEntity> {
  playerPosition: Position;
  structures: readonly T[];
  interactionRadius: number;
}

// The entity whose interaction radius the player is standing in, if any.
//
// Derived during render (no effect + setState round trip). The returned
// object keeps its identity while the same id stays nearby, even if the
// caller rebuilds the list (e.g. a patrolling NPC moving), so effects that
// depend on it only re-run when the nearby entity actually changes. Use it
// for its id; its position may be the one it had when it came into range.
export const useCollisionDetection = <T extends CollidableEntity>({
  playerPosition,
  structures,
  interactionRadius,
}: CollisionDetectionConfig<T>) => {
  const nearest = useMemo(
    () => findNearest(playerPosition, structures, interactionRadius),
    [playerPosition, structures, interactionRadius]
  );

  const stableRef = useRef<T | null>(null);
  if ((stableRef.current?.id ?? null) !== (nearest?.id ?? null)) {
    stableRef.current = nearest;
  }

  return { nearbyStructure: stableRef.current };
};
