import { getDirectionFromJoystick, getDirectionFromKeys, getJoystickIntensity, stepPosition } from './movement';

const bounds = { minX: 0, minY: 0, maxX: 100, maxY: 100 };
const never = () => false;

describe('getDirectionFromKeys', () => {
  it('maps WASD and arrows, diagonals included', () => {
    expect(getDirectionFromKeys(new Set(['w']))).toBe('up');
    expect(getDirectionFromKeys(new Set(['arrowdown']))).toBe('down');
    expect(getDirectionFromKeys(new Set(['w', 'd']))).toBe('up-right');
    expect(getDirectionFromKeys(new Set(['s', 'arrowleft']))).toBe('down-left');
    expect(getDirectionFromKeys(new Set(['shift']))).toBe('idle');
  });
});

describe('joystick', () => {
  it('ignores the dead zone', () => {
    expect(getDirectionFromJoystick(0.1, -0.1)).toBe('idle');
    expect(getDirectionFromJoystick(null, null)).toBe('idle');
  });

  it('has y growing upwards', () => {
    expect(getDirectionFromJoystick(0, 0.9)).toBe('up');
    expect(getDirectionFromJoystick(0.6, -0.6)).toBe('down-right');
  });

  it('caps the intensity at 1', () => {
    expect(getJoystickIntensity(1, 1)).toBe(1);
    expect(getJoystickIntensity(0.3, 0.4)).toBeCloseTo(0.5);
  });
});

describe('stepPosition', () => {
  it('moves by the distance, diagonals normalised', () => {
    expect(stepPosition({ x: 50, y: 50 }, 'right', 10, bounds, never)).toEqual({ x: 60, y: 50 });
    const diag = stepPosition({ x: 50, y: 50 }, 'down-right', 10, bounds, never);
    expect(Math.hypot(diag.x - 50, diag.y - 50)).toBeCloseTo(10);
  });

  it('clamps to the world bounds', () => {
    expect(stepPosition({ x: 95, y: 50 }, 'right', 10, bounds, never)).toEqual({ x: 100, y: 50 });
  });

  it('returns the same object when nothing moved', () => {
    const at = { x: 100, y: 50 };
    expect(stepPosition(at, 'right', 10, bounds, never)).toBe(at);
    expect(stepPosition(at, 'idle', 10, bounds, never)).toBe(at);
  });

  it('slides along a wall when the diagonal is blocked', () => {
    // wall on the right: any x > 55 is blocked
    const wall = (p: { x: number }) => p.x > 55;
    const next = stepPosition({ x: 50, y: 50 }, 'down-right', 10, bounds, wall);
    expect(next.x).toBe(50);
    expect(next.y).toBeCloseTo(50 + 10 * Math.SQRT1_2);
  });

  it('stays put when every move is blocked', () => {
    const at = { x: 50, y: 50 };
    const everywhereElse = (p: { x: number; y: number }) => p.x !== at.x || p.y !== at.y;
    expect(stepPosition(at, 'up-left', 10, bounds, everywhereElse)).toBe(at);
  });

  it('walks out of a box it is already inside', () => {
    // box around x 40..60: the player starts inside it
    const box = (p: { x: number }) => p.x > 40 && p.x < 60;
    expect(stepPosition({ x: 50, y: 50 }, 'right', 5, bounds, box)).toEqual({ x: 55, y: 50 });
  });
});
