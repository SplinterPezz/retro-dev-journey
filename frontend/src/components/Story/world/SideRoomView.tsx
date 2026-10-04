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
    {/* 1px wider: neighbouring shades overlap instead of leaving a hairline when zoomed */}
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
