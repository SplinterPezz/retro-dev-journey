import { Direction, Position, WorldBounds } from '../types/game';
import { MOVE_KEYS } from '../config/controls';

// Pure movement maths for the player: input -> direction -> next position.

export const getDirectionFromKeys = (keys: ReadonlySet<string>): Direction => {
  const held = (direction: keyof typeof MOVE_KEYS) => MOVE_KEYS[direction].some((k) => keys.has(k));
  const up = held('up');
  const down = held('down');
  const left = held('left');
  const right = held('right');

  if (up && left) return 'up-left';
  if (up && right) return 'up-right';
  if (down && left) return 'down-left';
  if (down && right) return 'down-right';
  if (up) return 'up';
  if (down) return 'down';
  if (left) return 'left';
  if (right) return 'right';
  return 'idle';
};

const JOYSTICK_DEAD_ZONE = 0.2;

// Joystick y grows upwards, unlike screen coordinates.
export const getDirectionFromJoystick = (x: number | null, y: number | null): Direction => {
  if (x === null || y === null) return 'idle';
  const absX = Math.abs(x);
  const absY = Math.abs(y);
  if (absX < JOYSTICK_DEAD_ZONE && absY < JOYSTICK_DEAD_ZONE) return 'idle';
  if (absX > JOYSTICK_DEAD_ZONE && absY > JOYSTICK_DEAD_ZONE) {
    if (x > 0) return y > 0 ? 'up-right' : 'down-right';
    return y > 0 ? 'up-left' : 'down-left';
  }
  if (absX > absY) return x > 0 ? 'right' : 'left';
  return y > 0 ? 'up' : 'down';
};

export const getJoystickIntensity = (x: number | null, y: number | null): number => {
  if (x === null || y === null) return 0;
  return Math.min(Math.hypot(x, y), 1);
};

const STEP: Record<Exclude<Direction, 'idle'>, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  'up-left': { x: -Math.SQRT1_2, y: -Math.SQRT1_2 },
  'up-right': { x: Math.SQRT1_2, y: -Math.SQRT1_2 },
  'down-left': { x: -Math.SQRT1_2, y: Math.SQRT1_2 },
  'down-right': { x: Math.SQRT1_2, y: Math.SQRT1_2 },
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// Moves `distance` pixels towards `dir`, clamped to the world. When the full
// step is blocked it slides along one axis; when both are blocked it stays.
// Returns `current` itself (same reference) when nothing moved.
export const stepPosition = (
  current: Position,
  dir: Direction,
  distance: number,
  bounds: WorldBounds,
  isBlocked: (p: Position) => boolean
): Position => {
  if (dir === 'idle') return current;
  const nx = clamp(current.x + STEP[dir].x * distance, bounds.minX, bounds.maxX);
  const ny = clamp(current.y + STEP[dir].y * distance, bounds.minY, bounds.maxY);
  if (nx === current.x && ny === current.y) return current;

  const candidates: Position[] = [
    { x: nx, y: ny },
    { x: nx, y: current.y },
    { x: current.x, y: ny },
  ];
  // Already inside a box (put there by a teleport or a config slip): let any
  // step through, so the player walks out instead of being stuck for good.
  const stuck = isBlocked(current);
  const free = candidates.find(
    (p) => !(p.x === current.x && p.y === current.y) && (stuck || !isBlocked(p))
  );
  return free ?? current;
};
