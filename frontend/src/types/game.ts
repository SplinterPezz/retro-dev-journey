
export interface Position {
  x: number;
  y: number;
}

export interface WorldBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface Hitbox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageSize {
  width: number;
  height: number;
}

export interface ShadowInfo {
  width: number;
  height: number;
  position: Position;
}

export interface WorldConfig {
  width: number;
  height: number;
  tileSize: number;
}

export interface CollidableEntity {
  id: string;
  position: Position;
  interactionRadius?: number;
  data?: { collisionHitbox?: Hitbox };
}

export interface EnvironmentData {
  image: string;
  shadow?: ShadowInfo;
  position: Position;
  imageSize?: ImageSize;
  collisionHitbox?: Hitbox;
}

export type Direction = 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right' | 'idle';
