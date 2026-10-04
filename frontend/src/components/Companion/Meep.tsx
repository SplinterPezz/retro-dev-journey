import React, { useRef } from 'react';
import { Position } from '../../types/sandbox';
import { MeepDirection, meepSprite } from '../../config/story/sprites';
import './Meep.css';

interface MeepProps {
  position: Position; // already-lagged position, e.g. from useLaggedPosition - so anything else anchored to Meep (its speech bubble) can share the exact same point
}

// The facings clockwise from east, one per 45° sector of the screen angle.
const FACING_BY_SECTOR: MeepDirection[] = ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'];

// Eight-way facing from a movement vector in screen space (y grows downwards).
const directionFromStep = (dx: number, dy: number): MeepDirection => {
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI; // 0 = east, 90 = south
  const sector = Math.round(((angle + 360) % 360) / 45) % 8;
  return FACING_BY_SECTOR[sector];
};

// Renders Meep at a caller-supplied (lag-followed) position and faces the way
// it is drifting. Standing still keeps the last facing, so it doesn't snap.
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
      style={{ left: position.x + 54, top: position.y - 70 }}
    >
      <div
        className="meep-sprite"
        style={{ backgroundImage: `url(${meepSprite(direction)})` }}
      />
    </div>
  );
};

export default React.memo(Meep);
