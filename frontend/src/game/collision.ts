import { CollidableEntity, EnvironmentData, Hitbox, Position } from '../types/game';

// Pure geometry shared by the player, the NPC patrols and the proximity
// triggers. Hitboxes are relative to the entity's position.

export const aabbOverlap = (a: Position, ah: Hitbox, b: Position, bh: Hitbox): boolean =>
  a.x + ah.x < b.x + bh.x + bh.width &&
  a.x + ah.x + ah.width > b.x + bh.x &&
  a.y + ah.y < b.y + bh.y + bh.height &&
  a.y + ah.y + ah.height > b.y + bh.y;

export const distance = (a: Position, b: Position): number => Math.hypot(a.x - b.x, a.y - b.y);

// Anything with a position and an optional collision box.
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

// The entity whose interaction radius the player stands in, closest first.
// An entity with a collision box wins over one matched by radius alone.
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
