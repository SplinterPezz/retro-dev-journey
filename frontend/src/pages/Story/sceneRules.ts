import { CollidableEntity, Hitbox, Position, WorldBounds } from '../../types/game';
import { SideRoom, StoryChapterConfig, StoryFlags, StoryNpcData, StoryPropData } from '../../types/story';
import { isInside, isWithin } from '../../game/collision';

// The rules of a chapter scene that do not need React.

export const PLAYER_SPEED = 220; // px per second
export const MEEP_LAG_MS = 450;
export const DEFAULT_NPC_REACH = 50;
export const DEFAULT_STATION_REACH = 70;
const ROOM_WALL = 40;

// bottom centre of the 128x128 door sprite
const DOOR_THRESHOLD = { x: 64, y: 100 };
const DOOR_REACH = 70;

export const DOOR_TRIGGER_ID = 'door';
const EXIT_OBJECTIVE_ID = 'exit';

export const isUnlocked = (flags: StoryFlags, requiredFlag?: string): boolean => !requiredFlag || !!flags[requiredFlag];

export const isSeatedNpc = (npc: StoryNpcData, flags: StoryFlags): boolean => !!npc.seatedFlag && !!flags[npc.seatedFlag];

export const npcStandingPosition = (npc: StoryNpcData, flags: StoryFlags, live?: Position): Position =>
  isSeatedNpc(npc, flags) && npc.seatedPosition ? npc.seatedPosition : live ?? npc.position;

export const isPropVisible = (prop: StoryPropData, flags: StoryFlags): boolean => {
  const shown = !prop.visibleWhenFlag || flags[prop.visibleWhenFlag];
  const hidden = !!prop.hiddenWhenFlag && flags[prop.hiddenWhenFlag];
  return !!shown && !hidden;
};

export interface WalkableWorld {
  worldBounds: WorldBounds;
  walkableAreas?: WorldBounds[];
}

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

export const isAtExitDoor = (chapter: StoryChapterConfig, player: Position): boolean => {
  const threshold = { x: chapter.doorPosition.x + DOOR_THRESHOLD.x, y: chapter.doorPosition.y + DOOR_THRESHOLD.y };
  return isWithin(player, threshold, DOOR_REACH);
};

export const litSideRoomId = (sideRooms: SideRoom[] | undefined, player: Position): string | undefined =>
  sideRooms?.find((room) => room.dark && room.surfaces.some((s) => isInside(player, s.bounds)))?.id;

const toCollidable = (id: string, position: Position, interactionRadius?: number, collisionHitbox?: Hitbox): CollidableEntity => ({
  id,
  position,
  interactionRadius,
  data: { collisionHitbox },
});

// What the player can walk up to (NPCs, quiz stations, mini-game spots) and what blocks the way.
export const sceneCollidables = (
  chapter: StoryChapterConfig,
  flags: StoryFlags,
  npcPositions: Record<string, Position | undefined>
) => {
  const npcs = chapter.npcs.map((npc) =>
    toCollidable(npc.id, npcStandingPosition(npc, flags, npcPositions[npc.id]), npc.interactionRadius ?? DEFAULT_NPC_REACH, npc.collisionHitbox)
  );
  return {
    npcs,
    quizzes: chapter.quizzes.map((q) => toCollidable(q.id, q.position, q.interactionRadius ?? DEFAULT_STATION_REACH)),
    miniGames: (chapter.miniGames ?? []).map((m) => toCollidable(m.id, m.position, m.interactionRadius ?? DEFAULT_STATION_REACH)),
    blockers: [...npcs, ...chapter.props.map((p) => toCollidable(p.id, p.position, 0, p.collisionHitbox))],
  };
};

// The chapter's objectives, plus the way out once the closing scene is over.
export const chapterObjectives = (chapter: StoryChapterConfig, flags: StoryFlags, exitObjective?: string) => {
  const list = chapter.objectives?.map((o) => ({ id: o.id, label: o.label, done: !!flags[o.flag] }));
  return list && exitObjective ? [...list, { id: EXIT_OBJECTIVE_ID, label: exitObjective, done: false }] : list;
};
