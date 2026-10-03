import { aabbOverlap, distance, findNearest, hitsAny, toBlockers } from './collision';

const box = { x: -10, y: -10, width: 20, height: 20 };

describe('aabbOverlap', () => {
  it('detects overlapping boxes', () => {
    expect(aabbOverlap({ x: 0, y: 0 }, box, { x: 15, y: 0 }, box)).toBe(true);
  });

  it('treats touching edges as not overlapping', () => {
    expect(aabbOverlap({ x: 0, y: 0 }, box, { x: 20, y: 0 }, box)).toBe(false);
  });

  it('uses the hitbox offset relative to the position', () => {
    const feet = { x: -5, y: 30, width: 10, height: 5 };
    expect(aabbOverlap({ x: 0, y: 0 }, feet, { x: 0, y: 32 }, { x: -1, y: -1, width: 2, height: 2 })).toBe(true);
    expect(aabbOverlap({ x: 0, y: 0 }, feet, { x: 0, y: 0 }, { x: -1, y: -1, width: 2, height: 2 })).toBe(false);
  });
});

describe('distance', () => {
  it('is euclidean', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
});

describe('hitsAny / toBlockers', () => {
  it('ignores blockers without a collision box', () => {
    const blockers = toBlockers([{ id: 'a', position: { x: 0, y: 0 } }], [{ image: 'x', position: { x: 0, y: 0 } }]);
    expect(hitsAny({ x: 0, y: 0 }, box, blockers)).toBe(false);
  });

  it('reads structure boxes under data and environment boxes at the top level', () => {
    const structures = [{ id: 's', position: { x: 100, y: 0 }, data: { collisionHitbox: box } }];
    const environments = [{ image: 'tree', position: { x: 0, y: 100 }, collisionHitbox: box }];
    const blockers = toBlockers(structures, environments);
    expect(hitsAny({ x: 100, y: 0 }, box, blockers)).toBe(true);
    expect(hitsAny({ x: 0, y: 100 }, box, blockers)).toBe(true);
    expect(hitsAny({ x: 50, y: 50 }, box, blockers)).toBe(false);
  });
});

describe('findNearest', () => {
  const entities = [
    { id: 'far', position: { x: 60, y: 0 } },
    { id: 'near', position: { x: 20, y: 0 } },
    { id: 'big', position: { x: 300, y: 0 }, interactionRadius: 400 },
  ];

  it('returns the closest entity within its radius', () => {
    expect(findNearest({ x: 0, y: 0 }, entities, 70)?.id).toBe('near');
  });

  it('honours a per-entity radius over the default', () => {
    expect(findNearest({ x: 0, y: 0 }, [entities[2]], 70)?.id).toBe('big');
  });

  it('returns null when nothing is in range', () => {
    expect(findNearest({ x: 1000, y: 1000 }, entities.slice(0, 2), 70)).toBeNull();
  });

  it('prefers an entity with a collision box', () => {
    const withBox = { id: 'boxed', position: { x: 50, y: 0 }, data: { collisionHitbox: box } };
    expect(findNearest({ x: 0, y: 0 }, [entities[1], withBox], 70)?.id).toBe('boxed');
  });
});
