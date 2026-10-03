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
  '--player-sprite-idle-n'?: string;
  '--player-sprite-idle-e'?: string;
  '--player-sprite-idle-ne'?: string;
  '--player-sprite-idle-se'?: string;
  '--player-sprite-walk-s'?: string;
  '--player-sprite-walk-n'?: string;
  '--player-sprite-walk-e'?: string;
  '--player-sprite-walk-ne'?: string;
  '--player-sprite-walk-se'?: string;
}

const Player: React.FC<PlayerProps> = ({ position, isMoving, direction }) => {
  // At rest, face whichever direction `direction` last held (usePlayerMovement
  // keeps it instead of resetting to 'idle') using a static per-direction
  // idle pose - lifted from frame 0 of that direction's walk cycle via the
  // pixel-character skill's idle_from_walk.py, since that frame is already
  // the neutral stance. West/north-west/south-west mirror east/north-east/
  // south-east the same way the walk cycle already does.
  const getSpriteClass = (): string => {
    const baseClass = 'player-sprite';

    if (!isMoving) {
      switch (direction) {
        case 'up': return `${baseClass} idle-up`;
        case 'up-left': return `${baseClass} idle-up-left`;
        case 'up-right': return `${baseClass} idle-up-right`;
        case 'down-left': return `${baseClass} idle-down-left`;
        case 'down-right': return `${baseClass} idle-down-right`;
        case 'left': return `${baseClass} idle-left`;
        case 'right': return `${baseClass} idle-right`;
        case 'down':
        default:
          return `${baseClass} idle-down`;
      }
    }

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
    '--player-sprite-idle-n': `url('/sprites/player/${playerSpritePrefix}_idle_N.gif')`,
    '--player-sprite-idle-e': `url('/sprites/player/${playerSpritePrefix}_idle_E.gif')`,
    '--player-sprite-idle-ne': `url('/sprites/player/${playerSpritePrefix}_idle_NE.gif')`,
    '--player-sprite-idle-se': `url('/sprites/player/${playerSpritePrefix}_idle_SE.gif')`,
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