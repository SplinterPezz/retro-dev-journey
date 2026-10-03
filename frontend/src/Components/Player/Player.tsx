import React from 'react';
import { Position, Direction } from '../../types/game';
import { playerName } from '../../config/player';
import { playerSprites } from '../../config/assets';
import './Player.css';

interface PlayerProps {
  position: Position;
  isMoving: boolean;
  direction: Direction;
}

// Sprite URLs as CSS variables, read by Player.css. Built once.
const spriteVariables = Object.fromEntries(
  Object.entries(playerSprites).map(([name, url]) => [name, `url('${url}')`])
) as React.CSSProperties;

// At rest the player keeps facing the last direction (usePlayerMovement does
// not reset it), with a static idle pose per direction. West-facing poses
// mirror the east-facing ones in Player.css, like the walk cycle.
const spriteClass = (isMoving: boolean, direction: Direction): string => {
  const facing = direction === 'idle' ? 'down' : direction;
  return `player-sprite ${isMoving && direction !== 'idle' ? 'walking' : 'idle'}-${facing}`;
};

const Player: React.FC<PlayerProps> = ({ position, isMoving, direction }) => (
  <div
    className="player-container"
    style={{ ...spriteVariables, left: position.x - 64, top: position.y - 64 }}
  >
    <div className="player-nametag">
      <span>{playerName}</span>
    </div>
    <div className={spriteClass(isMoving, direction)} />
    <div className="player-shadow" />
  </div>
);

export default React.memo(Player);
