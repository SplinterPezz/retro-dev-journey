import React, { useRef } from 'react';
import { Position } from '../../types/sandbox';
import { MeepDirection, meepSprite } from '../../config/story/sprites';
import './Meep.css';

interface MeepProps {
  position: Position;
}

// where Meep is drawn from the position it follows; the sprite is MEEP_SIZE px square
export const MEEP_OFFSET = { x: 54, y: -70 };
export const MEEP_SIZE = 56;

const FACING_BY_SECTOR: MeepDirection[] = ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'];

const directionFromStep = (dx: number, dy: number): MeepDirection => {
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const sector = Math.round(((angle + 360) % 360) / 45) % 8;
  return FACING_BY_SECTOR[sector];
};

const Meep: React.FC<MeepProps> = ({ position }) => {
  const lastRef = useRef<{ x: number; y: number; direction: MeepDirection }>({
    x: position.x,
    y: position.y,
    direction: 'S',
  });

  const dx = position.x - lastRef.current.x;
  const dy = position.y - lastRef.current.y;
  if (Math.hypot(dx, dy) > 0.5) {
    lastRef.current = { x: position.x, y: position.y, direction: directionFromStep(dx, dy) };
  }
  const direction = lastRef.current.direction;

  return (
    <div
      className="meep-container"
      style={{ left: position.x + MEEP_OFFSET.x, top: position.y + MEEP_OFFSET.y }}
    >
      <div
        className="meep-sprite"
        style={{ backgroundImage: `url(${meepSprite(direction)})` }}
      />
    </div>
  );
};

export default React.memo(Meep);
