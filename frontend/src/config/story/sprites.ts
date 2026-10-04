// No imports on purpose: the chapter configs and the asset preloader both read this file.

const STORY_SPRITES = '/sprites/story';

export const storyProp = (name: string): string => `${STORY_SPRITES}/props/${name}.png`;

export const storyUi = (name: string): string => `${STORY_SPRITES}/ui/${name}.png`;

export const storyCollectible = (name: string): string => `${STORY_SPRITES}/collectibles/${name}.png`;

export const npcSpriteBase = (name: string): string => `${STORY_SPRITES}/npc/${name}/${name}`;

// Walking west is walk_E mirrored.
export type NpcPose = 'idle' | 'walk_E' | 'walk_N' | 'walk_S';

export const npcSprite = (spriteBase: string, pose: NpcPose): string => `${spriteBase}_${pose}.gif`;

export const MEEP_SPRITE_BASE = `${STORY_SPRITES}/companion/meep/meep`;

export const MEEP_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
export type MeepDirection = (typeof MEEP_DIRECTIONS)[number];

export const meepSprite = (direction: MeepDirection | 'idle'): string => `${MEEP_SPRITE_BASE}_${direction}.gif`;
