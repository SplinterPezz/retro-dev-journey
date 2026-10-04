import { Position, WorldBounds } from '../../types/game';
import { SideRoom, StoryChapterConfig, StoryFlags, StoryNpcData, StoryPropData } from '../../types/story';
import { isInside, isWithin } from '../../game/collision';

// The rules of a chapter scene that do not need React: where things are,
// what is visible, where the player may walk. InteriorScene wires them up.

// ---- tuning ----

/** Player walking speed, px per second. */
export const PLAYER_SPEED = 220;
/** How far behind the player Meep flies, in ms of the player's path. */
export const MEEP_LAG_MS = 450;
/** Walk-up distance of an NPC without its own interactionRadius. */
export const DEFAULT_NPC_REACH = 50;
/** Walk-up distance of a quiz station or a mini-game spot without its own interactionRadius. */
export const DEFAULT_STATION_REACH = 70;
/** The walls: how far from the room's edge the player's position can go. */
const ROOM_WALL = 40;

// The exit door sprite is drawn 128x128 from chapter.doorPosition; the player
// reaches it at its threshold, the bottom centre.
const DOOR_THRESHOLD = { x: 64, y: 100 };
const DOOR_REACH = 70;

// ---- ids of things the scene makes up itself (not from the chapter config) ----

/** The exit door, as a walk-up trigger. */
export const DOOR_TRIGGER_ID = 'door';
/** The "leave the room" objective added once the closing scene is over. */
export const EXIT_OBJECTIVE_ID = 'exit';

// ---- flags ----

/** A thing gated by `requiredFlag` is available once that flag is set (or right away without one). */
export const isUnlocked = (flags: StoryFlags, requiredFlag?: string): boolean => !requiredFlag || !!flags[requiredFlag];

// ---- NPCs ----

/** Once the NPC's seatedFlag is set, it stays at its seat. */
export const isSeatedNpc = (npc: StoryNpcData, flags: StoryFlags): boolean => !!npc.seatedFlag && !!flags[npc.seatedFlag];

/** Where an NPC stands right now: at its seat once seated, otherwise where its patrol (`live`) has it. */
export const npcStandingPosition = (npc: StoryNpcData, flags: StoryFlags, live?: Position): Position =>
  isSeatedNpc(npc, flags) && npc.seatedPosition ? npc.seatedPosition : live ?? npc.position;

// ---- props ----

/** A prop with visibleWhenFlag / hiddenWhenFlag shows only in that window of the story. */
export const isPropVisible = (prop: StoryPropData, flags: StoryFlags): boolean => {
  const shown = !prop.visibleWhenFlag || flags[prop.visibleWhenFlag];
  const hidden = !!prop.hiddenWhenFlag && flags[prop.hiddenWhenFlag];
  return !!shown && !hidden;
};

// ---- where the player may walk ----

export interface WalkableWorld {
  worldBounds: WorldBounds; // the box the player is clamped to
  walkableAreas?: WorldBounds[]; // the position must stay inside one of these; undefined = the whole box
}

/** The room, plus any secret path or side room outside its walls. */
export const walkableWorld = (chapter: StoryChapterConfig, secretPaths: WorldBounds[] = []): WalkableWorld => {
  const { width, height } = chapter.worldConfig;
  const room = { minX: ROOM_WALL, minY: ROOM_WALL, maxX: width - ROOM_WALL, maxY: height - ROOM_WALL };
  const outside = [...secretPaths, ...(chapter.sideRooms ?? []).flatMap((r) => r.walkable)];
  if (outside.length === 0) return { worldBounds: room };

  const areas = [room, ...outside];
  return {
    worldBounds: {
      minX: Math.min(...areas.map((a) => a.minX)),
      minY: Math.min(...areas.map((a) => a.minY)),
      maxX: Math.max(...areas.map((a) => a.maxX)),
      maxY: Math.max(...areas.map((a) => a.maxY)),
    },
    walkableAreas: areas,
  };
};

// ---- doors and rooms ----

export const isAtExitDoor = (chapter: StoryChapterConfig, player: Position): boolean => {
  const threshold = { x: chapter.doorPosition.x + DOOR_THRESHOLD.x, y: chapter.doorPosition.y + DOOR_THRESHOLD.y };
  return isWithin(player, threshold, DOOR_REACH);
};

/** The dark side room the player is standing in, if any: its light is on. */
export const litSideRoomId = (sideRooms: SideRoom[] | undefined, player: Position): string | undefined =>
  sideRooms?.find((room) => room.dark && room.surfaces.some((s) => isInside(player, s.bounds)))?.id;
