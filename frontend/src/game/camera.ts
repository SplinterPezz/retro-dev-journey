import { CSSProperties } from 'react';
import { Position } from '../types/sandbox';

export const cameraStyle = (
  playerPosition: Position,
  viewport: { width: number; height: number },
  zoomScale: number
): CSSProperties => ({
  transformOrigin: '0 0',
  transform: `translate(${viewport.width / 2}px, ${viewport.height / 2}px) scale(${zoomScale}) translate(${-playerPosition.x}px, ${-playerPosition.y}px)`,
});
