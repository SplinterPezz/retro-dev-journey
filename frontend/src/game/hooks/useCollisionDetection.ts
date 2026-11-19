import { useState } from 'react';
import { CollidableEntity, Position } from '../../types/game';
import { findNearest } from '../collision';

interface CollisionDetectionConfig<T extends CollidableEntity> {
  playerPosition: Position;
  structures: readonly T[];
  interactionRadius: number;
}

// Derived during render. The result keeps its identity while the same id stays
// nearby, so effects depending on it re-run only when that entity changes.
export const useCollisionDetection = <T extends CollidableEntity>({
  playerPosition,
  structures,
  interactionRadius,
}: CollisionDetectionConfig<T>) => {
  const nearest = findNearest(playerPosition, structures, interactionRadius);

  const [stable, setStable] = useState<T | null>(nearest);
  if ((stable?.id ?? null) !== (nearest?.id ?? null)) {
    setStable(nearest);
  }

  return { nearbyStructure: stable };
};
