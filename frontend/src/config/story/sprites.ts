// Where the Story Mode sprites live and how their file names are built.
// Configs and components ask for a sprite by name through these helpers
// instead of writing paths by hand, so a folder move is a one-line change.
//
// No imports on purpose: both the chapter configs and the asset preloader
// read this file, and it must not pull either of them in.

const STORY_SPRITES = '/sprites/story';

/** A prop or tile, e.g. storyProp('desk_student') -> '/sprites/story/props/desk_student.png'. */
export const storyProp = (name: string): string => `${STORY_SPRITES}/props/${name}.png`;

/** A piece of interface art (monitor frame, Meep at work...). */
export const storyUi = (name: string): string => `${STORY_SPRITES}/ui/${name}.png`;

/** A collectible's picture. */
export const storyCollectible = (name: string): string => `${STORY_SPRITES}/collectibles/${name}.png`;

/** Base path of an NPC's sprites, e.g. npcSpriteBase('manuel') -> '/sprites/story/npc/manuel/manuel'. */
export const npcSpriteBase = (name: string): string => `${STORY_SPRITES}/npc/${name}/${name}`;

/** The animations every NPC sheet has. Walking west is walk_E mirrored. */
export type NpcPose = 'idle' | 'walk_E' | 'walk_N' | 'walk_S';

/** One animation of an NPC, or of a portrait-only speaker such as Meep. */
export const npcSprite = (spriteBase: string, pose: NpcPose): string => `${spriteBase}_${pose}.gif`;

// ---- Meep ----

/** Sprite base of Meep, also used as the portrait of Meep's dialogue lines. */
export const MEEP_SPRITE_BASE = `${STORY_SPRITES}/companion/meep/meep`;

/** The eight ways Meep can face. */
export const MEEP_DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
export type MeepDirection = (typeof MEEP_DIRECTIONS)[number];

/** Meep flying in one direction, or idle. */
export const meepSprite = (direction: MeepDirection | 'idle'): string => `${MEEP_SPRITE_BASE}_${direction}.gif`;
