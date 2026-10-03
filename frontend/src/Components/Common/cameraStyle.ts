import { CSSProperties } from 'react';
import { Position } from '../../types/sandbox';

// Camera for a scene: the world is scaled around the player and kept centred
// in the viewport. Shared by the Sandbox, the story map and the chapter interiors.
export const cameraStyle = (
  playerPosition: Position,
  viewport: { width: number; height: number },
  zoomScale: number
): CSSProperties => ({
  transformOrigin: '0 0',
  transform: `translate(${viewport.width / 2}px, ${viewport.height / 2}px) scale(${zoomScale}) translate(${-playerPosition.x}px, ${-playerPosition.y}px)`,
});
