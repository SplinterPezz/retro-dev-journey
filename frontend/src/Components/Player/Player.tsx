import React from 'react';
import { Position, Direction } from '../../types/sandbox';
import './Player.css';

interface PlayerProps {
  position: Position;
  isMoving: boolean;
  direction: Direction;
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

  return (
    <div
      className="player-container"
      style={{
        left: position.x - 64,
        top: position.y - 64,
      }}
    >
      {/* Player name tag */}
      <div className="player-nametag">
        <span>Dude</span>
      </div>

      <div className={getSpriteClass()} />
      <div className="player-shadow" />
    </div>
  );
};

export default Player;