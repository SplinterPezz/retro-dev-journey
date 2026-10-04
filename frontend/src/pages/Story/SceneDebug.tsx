import React from 'react';
import DebugOverlay, { DebugCollectibleZone } from '../../game/DebugOverlay';
import { NpcPatrolState } from '../../game/hooks/useNpcPatrol';
import { Hitbox, Position, WorldBounds } from '../../types/game';
import { ChapterCollectibles, CollectibleData, StoryChapterConfig, StoryFlags } from '../../types/story';
import { PICKUP_RADIUS } from './hooks/useCollectibles';
import { DEFAULT_NPC_REACH, DEFAULT_STATION_REACH, npcStandingPosition } from './sceneRules';

const PLAYER_DEBUG_ID = 'player';

// Circles of one collectible: the spot to wait in, one per spot of a sequence
// (labelled with the steps that happen there), or else where it is picked up.
const collectibleZones = (item: CollectibleData): DebugCollectibleZone[] => {
  const unlock = item.unlock;
  if (unlock?.kind === 'sequence') {
    return Object.entries(unlock.spots).map(([spotId, spot]) => {
      const steps = unlock.order.flatMap((id, i) => (id === spotId ? [i + 1] : [])).join('·');
      return { id: `${item.id}-${spotId}`, position: spot, radius: spot.radius, variant: 'trigger', label: `${item.id} ${steps} ${spotId}` };
    });
  }
  if (unlock?.kind === 'idle') {
    return [{ id: item.id, position: unlock.spot, radius: unlock.spot.radius, variant: 'trigger', label: `${item.id} wait ${unlock.seconds}s` }];
  }
  return item.position ? [{ id: item.id, position: item.position, radius: PICKUP_RADIUS, variant: 'pickup', label: item.id }] : [];
};

const toRect = (bounds: WorldBounds, i: number) => ({
  id: String(i),
  position: { x: bounds.minX, y: bounds.minY },
  width: bounds.maxX - bounds.minX,
  height: bounds.maxY - bounds.minY,
});

interface SceneDebugProps {
  chapter: StoryChapterConfig;
  collectibles?: ChapterCollectibles;
  foundIds: string[];
  flags: StoryFlags;
  npcStates: Record<string, NpcPatrolState>;
  playerPosition: Position;
  playerHitbox: Hitbox;
}

// Development builds only: walk-up zones (dashed circles), collision boxes,
// the picture box of flag-gated props, collectible spots and the walkable
// strips outside the room.
const SceneDebug: React.FC<SceneDebugProps> = ({ chapter, collectibles, foundIds, flags, npcStates, playerPosition, playerHitbox }) => {
  const notFound = (collectibles?.items ?? []).filter((item) => !foundIds.includes(item.id));
  const outsideTheRoom = [...(collectibles?.secretPaths ?? []), ...(chapter.sideRooms ?? []).flatMap((r) => r.walkable)];

  return (
    <DebugOverlay
      collectibleZones={notFound.flatMap(collectibleZones)}
      secretPaths={outsideTheRoom.map(toRect)}
      player={{ id: PLAYER_DEBUG_ID, position: playerPosition, hitbox: playerHitbox }}
      zones={[
        ...chapter.quizzes.map((q) => ({ id: q.id, position: q.position, radius: q.interactionRadius ?? DEFAULT_STATION_REACH })),
        ...(chapter.miniGames ?? []).map((m) => ({ id: m.id, position: m.position, radius: m.interactionRadius ?? DEFAULT_STATION_REACH })),
        ...chapter.npcs.map((n) => ({
          id: n.id,
          position: npcStandingPosition(n, flags, npcStates[n.id]?.position),
          radius: n.interactionRadius ?? DEFAULT_NPC_REACH,
        })),
      ]}
      rects={chapter.props.flatMap((p) =>
        p.visibleWhenFlag && p.imageSize ? [{ id: p.id, position: p.position, width: p.imageSize.width, height: p.imageSize.height }] : []
      )}
      hitboxes={[...chapter.props, ...chapter.npcs].flatMap((item) =>
        item.collisionHitbox ? [{ id: item.id, position: item.position, hitbox: item.collisionHitbox }] : []
      )}
    />
  );
};

export default SceneDebug;
