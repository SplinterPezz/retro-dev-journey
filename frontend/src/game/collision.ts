import { CollidableEntity, EnvironmentData, Hitbox, Position, WorldBounds } from '../types/game';

export const aabbOverlap = (a: Position, ah: Hitbox, b: Position, bh: Hitbox): boolean =>
  a.x + ah.x < b.x + bh.x + bh.width &&
  a.x + ah.x + ah.width > b.x + bh.x &&
  a.y + ah.y < b.y + bh.y + bh.height &&
  a.y + ah.y + ah.height > b.y + bh.y;

export const distance = (a: Position, b: Position): number => Math.hypot(a.x - b.x, a.y - b.y);

export const isWithin = (a: Position, b: Position, radius: number): boolean => distance(a, b) < radius;

export const isInside = (p: Position, b: WorldBounds): boolean => p.x >= b.minX && p.x <= b.maxX && p.y >= b.minY && p.y <= b.maxY;

export interface Blocker {
  position: Position;
  collisionHitbox?: Hitbox;
}

export const hitsAny = (pos: Position, hitbox: Hitbox, blockers: readonly Blocker[]): boolean =>
  blockers.some((b) => !!b.collisionHitbox && aabbOverlap(pos, hitbox, b.position, b.collisionHitbox));

// Structures keep their box under `data`, environments at the top level.
export const toBlockers = (
  structures: readonly CollidableEntity[] = [],
  environments: readonly EnvironmentData[] = []
): Blocker[] => [
  ...structures.map((s) => ({ position: s.position, collisionHitbox: s.data?.collisionHitbox })),
  ...environments,
];

// closest first; a collision box wins over a match by radius alone
export const findNearest = <T extends CollidableEntity>(
  playerPosition: Position,
  entities: readonly T[],
  defaultRadius: number
): T | null => {
  let closest: T | null = null;
  let closestDistance = Infinity;

  entities.forEach((entity) => {
    const d = distance(playerPosition, entity.position);
    if (d > (entity.interactionRadius || defaultRadius)) return;
    const rank = entity.data?.collisionHitbox ? 0 : d;
    if (rank < closestDistance) {
      closestDistance = rank;
      closest = entity;
    }
  });

  return closest;
};
