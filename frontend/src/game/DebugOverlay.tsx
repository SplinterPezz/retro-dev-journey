import React from 'react';
import { Hitbox, Position } from '../types/game';
import { isDev } from '../config/env';
import './DebugOverlay.css';

interface DebugHitbox {
  id: string;
  position: Position;
  hitbox: Hitbox;
}

interface DebugZone {
  id: string;
  position: Position;
  radius: number;
}

interface DebugRect {
  id: string;
  position: Position;
  width: number;
  height: number;
}

export interface DebugCollectibleZone extends DebugZone {
  variant: 'pickup' | 'trigger';
  label?: string;
}

interface DebugOverlayProps {
  player?: DebugHitbox;
  hitboxes?: DebugHitbox[];
  zones?: DebugZone[];
  rects?: DebugRect[];
  collectibleZones?: DebugCollectibleZone[];
  secretPaths?: DebugRect[];
}

const box = (left: number, top: number, width: number, height: number): React.CSSProperties => ({
  left,
  top,
  width,
  height,
});

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
