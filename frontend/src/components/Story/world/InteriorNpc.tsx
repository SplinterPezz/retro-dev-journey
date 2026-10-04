import React from 'react';
import { Position } from '../../../types/sandbox';
import { NpcDirection, StoryNpcData } from '../../../types/story';
import { NpcPose, npcSprite } from '../../../config/story/sprites';
import './InteriorNpc.css';

interface InteriorNpcProps {
  npc: StoryNpcData;
  position: Position;
  moving?: boolean;
  direction?: NpcDirection;
  isNearby: boolean;
}

const WALK_POSE: Record<NpcDirection, { pose: NpcPose; flip: boolean }> = {
  E: { pose: 'walk_E', flip: false },
  W: { pose: 'walk_E', flip: true },
  N: { pose: 'walk_N', flip: false },
  S: { pose: 'walk_S', flip: false },
};
const IDLE_POSE = { pose: 'idle' as NpcPose, flip: false };

const InteriorNpc: React.FC<InteriorNpcProps> = ({ npc, position, moving = false, direction = 'S', isNearby }) => {
  const { pose, flip } = moving ? WALK_POSE[direction] : IDLE_POSE;
  const sprite = { url: npcSprite(npc.spriteBase, pose), flip };

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
