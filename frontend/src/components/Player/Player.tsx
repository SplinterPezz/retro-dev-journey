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

const spriteVariables = Object.fromEntries(
  Object.entries(playerSprites).map(([name, url]) => [name, `url('${url}')`])
) as React.CSSProperties;

// West-facing poses mirror the east ones in Player.css.
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
