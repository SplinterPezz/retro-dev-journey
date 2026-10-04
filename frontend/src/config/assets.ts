import { PathSegment } from '../types/sandbox';
import { playerSpritePrefix } from './player';
import { storyUi } from './story/sprites';

// Single list of the sprites that more than one place needs: the components
// that draw them and the loading screens that preload them.

const playerSprite = (name: string) => `/sprites/player/${playerSpritePrefix}_${name}.gif`;

// Keyed by the CSS variable Player.css reads.
export const playerSprites = {
  '--player-sprite-idle': playerSprite('idle'),
  '--player-sprite-idle-n': playerSprite('idle_N'),
  '--player-sprite-idle-e': playerSprite('idle_E'),
  '--player-sprite-idle-ne': playerSprite('idle_NE'),
  '--player-sprite-idle-se': playerSprite('idle_SE'),
  '--player-sprite-walk-s': playerSprite('walk_S'),
  '--player-sprite-walk-n': playerSprite('walk_N'),
  '--player-sprite-walk-e': playerSprite('walk_E'),
  '--player-sprite-walk-ne': playerSprite('walk_NE'),
  '--player-sprite-walk-se': playerSprite('walk_SE'),
} as const;

export const playerTurnSprite = playerSprite('turn');

export const pathSprites: Record<PathSegment['type'], string> = {
  core: '/sprites/terrain/path_core.png',
  start: '/sprites/terrain/path_start.png',
  cross: '/sprites/terrain/path_cross.png',
  t_cross: '/sprites/terrain/path_t_cross.png',
  end: '/sprites/terrain/path_end.png',
};

export const preloadPlayerSprites: string[] = Object.values(playerSprites);
export const preloadPathSprites: string[] = Object.values(pathSprites);

// Floats over the buildings of the story map whose chapter is still locked.
export const lockSprite = storyUi('lock');

// Spins in the corner of the loading screens.
export const loadingIcon = '/favicon.ico';
