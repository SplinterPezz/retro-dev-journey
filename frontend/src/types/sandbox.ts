import { Position, ShadowInfo, Hitbox, ImageSize } from './game';

// Shared engine types live in ./game; re-exported here for existing imports.
export type { Position, WorldBounds, Hitbox, CollidableEntity, ShadowInfo, ImageSize, EnvironmentData, WorldConfig, Direction } from './game';

export interface StructureData {
  id: string;
  name: string;
  type: 'building' | 'statue';
  position: Position;
  description: string;
  data: CompanyData | TechnologyData;
  interactionRadius: number;
}

export interface CompanyData {
  id: string;
  name: string;
  shortName?: string;
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
  imageSize?: ImageSize;
  interactionRadius?: number;
}

export interface TechnologyData {
  id: string;
  name: string;
  shortName?: string;
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
  imageSize?: ImageSize;
  interactionRadius?: number;
  storyChapter?: string; // Story Mode: finishing this chapter unlocks it, and its statue appears on the map
  learnedText?: string; // Story Mode: shown in the "unlocked" window, how it was learned
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

export interface DailyQuest {
  id: string;
  done: boolean;
  name: string;
  shortName: string;
  icon: string;
  type: 'building' | 'statue' | 'extra';
}