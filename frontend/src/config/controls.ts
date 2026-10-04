// KeyboardEvent.key values; movement keys lower-cased, as the game lower-cases what it reads.

export const MOVE_KEYS = {
  up: ['w', 'arrowup'],
  down: ['s', 'arrowdown'],
  left: ['a', 'arrowleft'],
  right: ['d', 'arrowright'],
} as const;

export const RUN_KEYS = ['shift', ' '] as const;

export const GAME_KEYS: readonly string[] = [...Object.values(MOVE_KEYS).flat(), ...RUN_KEYS];

export const DIALOGUE_ADVANCE_KEYS: readonly string[] = ['Enter', ' '];
