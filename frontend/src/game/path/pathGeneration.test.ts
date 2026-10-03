import { createPathGenerator } from './pathGeneration';
import { companies, technologies } from '../../config/career';
import { mainPathConfig, worldConfig } from '../../config/world';

const generate = () =>
  createPathGenerator({
    startPosition: { x: mainPathConfig.startX, y: mainPathConfig.startY },
    endPosition: { x: mainPathConfig.startX, y: mainPathConfig.endY },
    structures: [...companies, ...technologies],
    tileSize: worldConfig.tileSize,
  }).generatePath();

describe('path generation', () => {
  it('starts with a start tile at the configured start', () => {
    const segments = generate();
    expect(segments[0]).toMatchObject({ type: 'start', position: { x: mainPathConfig.startX, y: mainPathConfig.startY } });
  });

  it('gives every segment a unique id (they are React keys)', () => {
    const ids = generate().map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('stays inside the world', () => {
    generate().forEach((s) => {
      expect(s.position.x).toBeGreaterThanOrEqual(0);
      expect(s.position.x).toBeLessThanOrEqual(worldConfig.width);
      expect(s.position.y).toBeGreaterThanOrEqual(0);
      expect(s.position.y).toBeLessThanOrEqual(worldConfig.height);
    });
  });

  it('is deterministic', () => {
    expect(generate()).toEqual(generate());
  });
});
