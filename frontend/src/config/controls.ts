// Keyboard controls. Values are KeyboardEvent.key: lower-cased for the
// movement keys (the game lower-cases what it reads), as-is for the rest.

/** Keys that move the player, by direction: WASD and the arrows. */
export const MOVE_KEYS = {
  up: ['w', 'arrowup'],
  down: ['s', 'arrowdown'],
  left: ['a', 'arrowleft'],
  right: ['d', 'arrowright'],
} as const;

/** Held together with a movement key: run. */
export const RUN_KEYS = ['shift', ' '] as const;

/** Every key the player movement listens to. */
export const GAME_KEYS: readonly string[] = [...Object.values(MOVE_KEYS).flat(), ...RUN_KEYS];

/** Finish the line being typed, then continue, in a dialogue box. */
export const DIALOGUE_ADVANCE_KEYS: readonly string[] = ['Enter', ' '];
