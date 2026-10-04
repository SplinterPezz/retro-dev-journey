import { Position, Hitbox, WorldConfig, ImageSize, WorldBounds, Rarity } from './game';

// Flag names live in config/story/flags.ts.
export type StoryFlags = Record<string, boolean>;

export interface MiniGameScore {
  earned: number;
  max: number;
}

export interface ChapterProgress {
  completed: boolean;
  flags: Record<string, boolean>;
  scores?: Record<string, MiniGameScore>;
  collectibles?: string[];
}

export type StoryDifficulty = 'junior' | 'middle' | 'senior';

export type ScoreTierId = 'perfect' | 'great' | 'good' | 'low' | 'zero';

// Two landscape values so the player can flip a picture that came out upside down.
export type StoryOrientation = 'portrait' | 'landscape-primary' | 'landscape-secondary';

export interface StoryState {
  unlockedChapterIndex: number;
  chapters: Record<string, ChapterProgress>;
  difficulty: StoryDifficulty | null;
  orientation: StoryOrientation | null;
  discoveriesSeen?: string[];
  startedAt?: number;
  timeline?: Record<string, number>;
}

export interface DialogueChoiceOption {
  text: string;
  // an array picks one node at random each time; omitted closes the dialogue
  next?: string | string[];
  setFlag?: string;
  isAnswer?: boolean;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  choices?: DialogueChoiceOption[];
  next?: string;
  nextNpcId?: string;
  portrait?: string;
  setFlag?: string;
}

interface DialogueScript {
  startNodeId: string;
  nodes: Record<string, DialogueNode>;
}

export type NpcDirection = 'N' | 'S' | 'E' | 'W';

// Walks back and forth between the waypoints. A step into a prop's hitbox is
// refused and the NPC turns around, so routes must follow the aisles.
interface NpcPatrol {
  waypoints: Position[];
  speed: number;
  pauseMs: number;
}

export interface StoryNpcData {
  id: string;
  name: string;
  spriteBase: string;
  position: Position;
  interactionRadius?: number;
  collisionHitbox?: Hitbox;
  dialogue: DialogueScript;
  requiredFlag?: string;
  patrol?: NpcPatrol;
  seatedFlag?: string;
  seatedPosition?: Position;
  autoStartFlag?: string;
  autoStartNodeId?: string;
  answeredFlag?: string;
  afterAnswerNodeId?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  onWrongText?: string;
  difficulty?: StoryDifficulty;
  codeSnippet?: string;
  expectedCode?: string;
}

export interface QuizCategory {
  id: string;
  label: string;
  hint?: string;
  questions: QuizQuestion[];
  completionFlag: string;
}

export interface QuizData {
  id: string;
  title: string;
  introTitle: string;
  introPages: string[];
  introSeenFlag: string;
  categories: QuizCategory[];
  position: Position;
  interactionRadius?: number;
  requiredFlag?: string;
  completionFlag: string;
}

export interface StoryPropData {
  id: string;
  image: string;
  position: Position;
  imageSize?: ImageSize;
  collisionHitbox?: Hitbox;
  visibleWhenFlag?: string;
  hiddenWhenFlag?: string;
}

export interface MeepBeat {
  id: string;
  trigger: 'onEnter' | 'onFlag' | 'onComplete';
  flag?: string;
  text: string;
}

export interface CollectibleSpot {
  x: number;
  y: number;
  radius: number;
}

// Without an unlock a collectible lies at its position from the start.
type CollectibleUnlock =
  | { kind: 'flag'; flag: string }
  | { kind: 'sequence'; spots: Record<string, CollectibleSpot>; order: string[] }
  | { kind: 'idle'; spot: CollectibleSpot; seconds: number };

export interface CollectibleData {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: Rarity;
  position?: Position;
  revealRadius?: number;
  unlock?: CollectibleUnlock;
}

export interface ChapterCollectibles {
  items: CollectibleData[];
  allFoundText: string;
  secretPaths?: WorldBounds[];
}

export interface MiniGameMarker {
  id: string;
  position: Position;
  interactionRadius?: number;
  completionFlag: string;
  requiredFlag?: string;
  resultsDialogue?: { npcId: string; nodes: Record<ScoreTierId, string> };
}

// Once afterFlag is set: fade to black, seat the player, play the dialogue.
// After endFlag the player has to walk out of the door to move the story on.
export interface ChapterOutro {
  afterFlag: string;
  subtitle: string;
  playerPosition: Position;
  dialogue: { npcId: string; nodeId: string };
  startedFlag: string;
  endFlag: string;
  exitObjective: string;
  exitBlockedLine: string;
}

export interface IntroPage {
  text: string;
}

interface SideRoomSurface {
  bounds: WorldBounds;
  image: string;
  tile: ImageSize;
}

export interface SideRoom {
  id: string;
  surfaces: SideRoomSurface[];
  walkable: WorldBounds[];
  door: { image: string; position: Position; imageSize: ImageSize };
  dark?: boolean;
}

export interface StoryChapterConfig {
  id: string;
  title: string;
  audioTrack?: string;
  splashTitle?: string;
  intro?: { title: string; pages: IntroPage[] };
  worldConfig: WorldConfig;
  floorImage: string;
  playerSpawn: Position;
  props: StoryPropData[];
  npcs: StoryNpcData[];
  quizzes: QuizData[];
  doorPosition: Position;
  sideRooms?: SideRoom[];
  meepBeats: MeepBeat[];
  completion: { requiredFlags: string[] };
  miniGames?: MiniGameMarker[];
  outro?: ChapterOutro;
  openingDialogue?: { npcId: string; nodeId: string };
  objectives?: { id: string; label: string; flag: string }[];
}
