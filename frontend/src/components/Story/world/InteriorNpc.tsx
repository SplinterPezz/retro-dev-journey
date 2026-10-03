import React from 'react';
import { Position } from '../../../types/sandbox';
import { NpcDirection, StoryNpcData } from '../../../types/story';
import './InteriorNpc.css';

interface InteriorNpcProps {
  npc: StoryNpcData;
  position: Position; // live position - differs from npc.position for NPCs that patrol
  moving?: boolean;
  direction?: NpcDirection;
  isNearby: boolean;
}

// Stationary or patrolling NPC sprite for interior scenes - same 128x128
// visual language as Player.tsx. Walking uses the walk sprites, the same way
// the player does: profile E for both sideways directions (W is E mirrored),
// S / N for vertical steps. Standing still shows the idle sprite.
const InteriorNpc: React.FC<InteriorNpcProps> = ({ npc, position, moving = false, direction = 'S', isNearby }) => {
  const sprite = (() => {
    if (!moving) return { url: `${npc.spriteBase}_idle.gif`, flip: false };
    if (direction === 'E') return { url: `${npc.spriteBase}_walk_E.gif`, flip: false };
    if (direction === 'W') return { url: `${npc.spriteBase}_walk_E.gif`, flip: true };
    if (direction === 'N') return { url: `${npc.spriteBase}_walk_N.gif`, flip: false };
    return { url: `${npc.spriteBase}_walk_S.gif`, flip: false };
  })();

  return (
    <div
      className={`interior-npc-container${isNearby ? ' nearby' : ''}`}
      style={{ left: position.x - 64, top: position.y - 64 }}
    >
      <div className="interior-npc-label">
        <span>{npc.name}</span>
      </div>
      <div
        className="interior-npc-sprite"
        style={{
          backgroundImage: `url(${sprite.url})`,
          transform: sprite.flip ? 'scaleX(-1)' : undefined,
        }}
      />
      <div className="interior-npc-shadow" />
    </div>
  );
};

export default React.memo(InteriorNpc);
