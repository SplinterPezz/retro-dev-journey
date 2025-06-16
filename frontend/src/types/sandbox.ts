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

export interface StructureData {
  id: string;
  name: string;
  type: 'building' | 'statue';
  position: Position;
  description: string;
  data: CompanyData | TechnologyData;
  interactionRadius: number;
}

export interface ShadowInfo{
  width: number;
  height: number;
  position: Position;
}

export interface EnvironmentData {
  image: string;
  shadow?: ShadowInfo;
  position: Position;
}

export interface EnvironmentDataAnimated {
  image: string;
  imageAnimated: string;
  shadow?: ShadowInfo;
  position: Position;
}

export interface CompanyData {
  id: string;
  name: string;
  role: string;
  period: string;
  technologies: string[];
  description: string;
  website?: string;
  logo?: string;
  position: Position;
  image: string;
  animatedImage?: string;
  cooldownImage?: string;
  signpost?: string;
  easteregg?: string;
  shadow?: ShadowInfo;
  centering?: Position;
  collisionHitbox?: Hitbox;
}

export interface TechnologyData {
  id: string;
  name: string;
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsExperience?: number;
  description?: string;
  projects?: string[];
  position: Position;
  extras?: string[];
  image: string;
  animatedImage?: string;
  cooldownImage?: string;
  signpost?: string;
  shadow?: ShadowInfo;
  centering?: Position;
  collisionHitbox?: Hitbox;
}

export interface WorldConfig {
  width: number;
  height: number;
  tileSize: number;
}

export interface PlayerMovementConfig {
  initialPosition: Position;
  speed: number;
  worldBounds: WorldBounds;
}

export interface CollisionDetectionConfig {
  playerPosition: Position;
  structures: StructureData[];
  interactionRadius: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right' | 'idle';

export interface PlayerState {
  position: Position;
  direction: Direction;
  isMoving: boolean;
}

export interface GameState {
  player: PlayerState;
  structures: StructureData[];
  selectedStructure: StructureData | null;
  dialogOpen: boolean;
}

export interface PathSegment {
  id: string;
  position: Position;
  type: 'core' | 'start' | 'cross' | 't_cross' | 'end';
  rotation: number;
  zIndex: number;
}

export interface PathGenerationConfig {
  startPosition: Position;
  endPosition: Position;
  structures: StructureData[];
  tileSize: number;
}

export interface IntersectionInfo {
  count: number;
  directions: ('left' | 'right')[];
}