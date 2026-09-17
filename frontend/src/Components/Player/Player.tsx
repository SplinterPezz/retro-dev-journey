import React from 'react';
import { Position, Direction } from '../../types/sandbox';
import { playerSpritePrefix, playerName } from '../../config/player';
import './Player.css';

interface PlayerProps {
  position: Position;
  isMoving: boolean;
  direction: Direction;
}

interface PlayerSpriteCSSProperties extends React.CSSProperties {
  '--player-sprite-idle'?: string;
  '--player-sprite-walk-s'?: string;
  '--player-sprite-walk-n'?: string;
  '--player-sprite-walk-e'?: string;
  '--player-sprite-walk-ne'?: string;
  '--player-sprite-walk-se'?: string;
}

const Player: React.FC<PlayerProps> = ({ position, isMoving, direction }) => {
  // Get sprite class based on direction and movement
  const getSpriteClass = (): string => {
    const baseClass = 'player-sprite';

    if (!isMoving) {
      return `${baseClass} idle-down`;
    }

    // Map directions to sprite classes with available sprites
    switch (direction) {
      case 'up':
        return `${baseClass} walking-up`;
      case 'up-left':
        return `${baseClass} walking-up-left`;
      case 'up-right':
        return `${baseClass} walking-up-right`;
      case 'down':
        return `${baseClass} walking-down`;
      case 'down-left':
        return `${baseClass} walking-down-left`;
      case 'down-right':
        return `${baseClass} walking-down-right`;
      case 'left':
        return `${baseClass} walking-left`;
      case 'right':
        return `${baseClass} walking-right`;
      default:
        return `${baseClass} idle-down`;
    }
  };

  const spriteStyle: PlayerSpriteCSSProperties = {
    left: position.x - 64,
    top: position.y - 64,
    '--player-sprite-idle': `url('/sprites/player/${playerSpritePrefix}_idle.gif')`,
    '--player-sprite-walk-s': `url('/sprites/player/${playerSpritePrefix}_walk_S.gif')`,
    '--player-sprite-walk-n': `url('/sprites/player/${playerSpritePrefix}_walk_N.gif')`,
    '--player-sprite-walk-e': `url('/sprites/player/${playerSpritePrefix}_walk_E.gif')`,
    '--player-sprite-walk-ne': `url('/sprites/player/${playerSpritePrefix}_walk_NE.gif')`,
    '--player-sprite-walk-se': `url('/sprites/player/${playerSpritePrefix}_walk_SE.gif')`,
  };

  return (
    <div
      className="player-container"
      style={spriteStyle}
    >
      {/* Player name tag */}
      <div className="player-nametag">
        <span>{playerName}</span>
      </div>

      <div className={getSpriteClass()} />
      <div className="player-shadow" />
    </div>
  );
};

export default Player;