import React from 'react';
import { WorldBounds } from '../../../types/game';
import { SideRoom } from '../../../types/story';
import './SideRoomView.css';

interface SideRoomViewProps {
  room: SideRoom;
  lit: boolean;
}

const boundsStyle = (b: WorldBounds, grow = 0): React.CSSProperties => ({
  left: b.minX - grow,
  top: b.minY - grow,
  width: b.maxX - b.minX + grow * 2,
  height: b.maxY - b.minY + grow * 2,
});

// Surfaces, open door and, for a dark room, the shade over it: the shade fades
// out (with a short neon flicker) while the player stands in the room. The
// doorway is see-through in the door sprite, so it darkens and lights with the room.
const SideRoomView: React.FC<SideRoomViewProps> = ({ room, lit }) => (
  <>
    {room.surfaces.map((s, i) => (
      <div
        key={i}
        className="side-room-surface"
        style={{
          ...boundsStyle(s.bounds),
          backgroundImage: `url(${s.image})`,
          backgroundSize: `${s.tile.width}px ${s.tile.height}px`,
        }}
      />
    ))}
    {/* 1px wider than the surfaces: neighbouring shades overlap instead of leaving a hairline between them when zoomed */}
    {room.dark &&
      room.surfaces.map((s, i) => (
        <div key={i} className={`side-room-shade${lit ? ' side-room-shade--lit' : ''}`} style={boundsStyle(s.bounds, 1)} />
      ))}
    <img
      alt=""
      src={room.door.image}
      className="side-room-door"
      style={{ left: room.door.position.x, top: room.door.position.y, ...room.door.imageSize }}
    />
  </>
);

export default React.memo(SideRoomView);
