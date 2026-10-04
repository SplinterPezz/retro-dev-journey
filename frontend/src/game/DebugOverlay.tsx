import React from 'react';
import { Hitbox, Position } from '../types/game';
import { isDev } from '../config/env';
import './DebugOverlay.css';

export interface DebugHitbox {
  id: string;
  position: Position;
  hitbox: Hitbox;
}

export interface DebugZone {
  id: string;
  position: Position;
  radius: number;
}

export interface DebugRect {
  id: string;
  position: Position;
  width: number;
  height: number;
}

// Collectibles, in their own colour: where one is picked up, or the spot its
// sequence or wait needs.
export interface DebugCollectibleZone extends DebugZone {
  variant: 'pickup' | 'trigger';
  label?: string;
}

interface DebugOverlayProps {
  player?: DebugHitbox;
  hitboxes?: DebugHitbox[]; // collision boxes, relative to their position
  zones?: DebugZone[]; // walk-up radius of interactive things
  rects?: DebugRect[]; // picture boxes of visual-only things
  collectibleZones?: DebugCollectibleZone[];
  secretPaths?: DebugRect[]; // walkable strips outside the room
}

const box = (left: number, top: number, width: number, height: number): React.CSSProperties => ({
  left,
  top,
  width,
  height,
});

// Hitboxes and interaction zones of a scene, drawn in development builds only.
const DebugOverlay: React.FC<DebugOverlayProps> = ({
  player,
  hitboxes = [],
  zones = [],
  rects = [],
  collectibleZones = [],
  secretPaths = [],
}) => {
  if (!isDev) return null;
  return (
    <>
      {secretPaths.map((r) => (
        <div key={`secret-${r.id}`} className="debug-box secret-path" style={box(r.position.x, r.position.y, r.width, r.height)} />
      ))}
      {collectibleZones.map((z) => (
        <div
          key={`collectible-${z.id}`}
          className={`debug-box collectible ${z.variant}`}
          style={box(z.position.x - z.radius, z.position.y - z.radius, z.radius * 2, z.radius * 2)}
        >
          {z.label && <span className="debug-label">{z.label}</span>}
        </div>
      ))}
      {zones.map((z) => (
        <div
          key={`zone-${z.id}`}
          className="debug-box zone"
          style={box(z.position.x - z.radius, z.position.y - z.radius, z.radius * 2, z.radius * 2)}
        />
      ))}
      {rects.map((r) => (
        <div key={`rect-${r.id}`} className="debug-box visual" style={box(r.position.x, r.position.y, r.width, r.height)} />
      ))}
      {hitboxes.map((h) => (
        <div
          key={`hitbox-${h.id}`}
          className="debug-box hitbox"
          style={box(h.position.x + h.hitbox.x, h.position.y + h.hitbox.y, h.hitbox.width, h.hitbox.height)}
        />
      ))}
      {player && (
        <div
          className="debug-box player"
          style={box(
            player.position.x + player.hitbox.x,
            player.position.y + player.hitbox.y,
            player.hitbox.width,
            player.hitbox.height
          )}
        />
      )}
    </>
  );
};

export default DebugOverlay;
