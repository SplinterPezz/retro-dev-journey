import type { ChapterId, CompanyId } from '../config/ids';
import { Position, ShadowInfo, Hitbox, ImageSize, Rarity } from './game';

// Shared engine types live in ./game; re-exported here for existing imports.
export type { Position, EnvironmentData } from './game';

interface StructureBase {
  id: string;
  name: string;
  position: Position;
  description: string;
  interactionRadius: number;
}

export interface BuildingStructure extends StructureBase {
  type: 'building';
  data: CompanyData;
}

export interface StatueStructure extends StructureBase {
  type: 'statue';
  data: TechnologyData;
}

export type StructureData = BuildingStructure | StatueStructure;

interface DownloadButtonData {
  id: string;
  name: string;
  position: Position;
  image: string;
  animatedImage?: string;
  cooldownImage?: string;
  centering?: Position;
  collisionHitbox?: Hitbox;
}

export interface DownloadButtonStructure extends StructureBase {
  type: 'statue';
  data: DownloadButtonData;
}

export interface CompanyData {
  id: CompanyId;
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
  storyChapter?: ChapterId;
  learnedText?: string;
  rarity: Rarity;
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