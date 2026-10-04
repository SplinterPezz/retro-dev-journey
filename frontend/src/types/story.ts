import { Position, Hitbox, WorldConfig, ImageSize, WorldBounds } from './game';

// ---- persisted progress ----

export interface MiniGameScore {
  earned: number;
  max: number;
}

export interface ChapterProgress {
  completed: boolean;
  flags: Record<string, boolean>;
  scores?: Record<string, MiniGameScore>; // best mini-game result per marker id
  collectibles?: string[]; // ids of the collectibles found in this chapter
}

export type StoryDifficulty = 'junior' | 'middle' | 'senior';

// Score band of the end-of-day mini games, from the share of points earned.
export type ScoreTierId = 'perfect' | 'great' | 'good' | 'low' | 'zero';

// How the phone should be held for the story. 'portrait' is the normal layout;
// the two landscape values are the two ways the phone can be turned, so the
// player can flip the picture if it came out upside down.
export type StoryOrientation = 'portrait' | 'landscape-primary' | 'landscape-secondary';

export interface StoryState {
  unlockedChapterIndex: number;
  chapters: Record<string, ChapterProgress>;
  difficulty: StoryDifficulty | null;
  orientation: StoryOrientation | null; // chosen once on mobile, before the difficulty
  discoveriesSeen?: string[]; // technologies whose "unlocked" window was confirmed (missing in older saves)
}

// ---- dialogue ----

export interface DialogueChoiceOption {
  text: string;
  next?: string | string[]; // id of the next DialogueNode, or omitted to close the dialogue - an array picks one entry at random each time (e.g. varying which question "Can I ask you something?" leads to)
  setFlag?: string;
  isAnswer?: boolean; // true when picking this choice leads into a question the NPC turns back on the player (e.g. "Can I ask you something?") - styled distinctly so it stands out from ordinary topic choices
}

export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  choices?: DialogueChoiceOption[]; // when present, waits for a pick instead of auto-advancing
  next?: string; // used when there are no choices (linear line)
  nextNpcId?: string; // `next` is a node of this NPC's script: another character speaks next (a scene where several people talk in turn)
  portrait?: string; // sprite base of a speaker who is not an NPC of the scene (e.g. Meep): the box shows `speaker` and `${portrait}_idle.gif`
  setFlag?: string; // set as soon as this line is shown
}

export interface DialogueScript {
  startNodeId: string;
  nodes: Record<string, DialogueNode>;
}

// ---- interactable NPC ----

// Which walk sprite an NPC shows: dominant axis of its last step.
export type NpcDirection = 'N' | 'S' | 'E' | 'W';

export interface StoryNpcData {
  id: string;
  name: string;
  spriteBase: string; // e.g. '/sprites/story/npc/manuel/manuel' -> `${spriteBase}_idle.gif`
  position: Position;
  interactionRadius?: number;
  collisionHitbox?: Hitbox;
  dialogue: DialogueScript;
  requiredFlag?: string; // dialogue only triggers once this flag is already set (sequencing)
  // Opt-in: walks back and forth along these waypoints (ping-pong), pausing
  // at each end. Routes must run through the aisles - a step that would hit
  // a prop's collisionHitbox is refused and the NPC turns around instead.
  // Omit for a stationary NPC.
  patrol?: { waypoints: Position[]; speed: number; pauseMs: number };
  // Seating: once seatedFlag is set the NPC walks to seatedPosition and stays there.
  seatedFlag?: string;
  seatedPosition?: Position;
  // Cue: when autoStartFlag is set the dialogue at autoStartNodeId opens by itself, once.
  autoStartFlag?: string;
  autoStartNodeId?: string;
  // Answer once: once answeredFlag is set, approaching the NPC opens afterAnswerNodeId instead of the start node.
  answeredFlag?: string;
  afterAnswerNodeId?: string;
}

// ---- mini-quiz ----

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  onWrongText?: string;
  difficulty?: StoryDifficulty; // defaults to 'junior' when omitted
  // code-fix question: the player edits codeSnippet until it matches expectedCode (whitespace ignored) instead of picking an option
  codeSnippet?: string;
  expectedCode?: string;
}

export interface QuizCategory {
  id: string;
  label: string; // e.g. "Java", "Android", "Objective-C", "OOP Basics"
  hint?: string; // easter egg: shown in a speech balloon from a "?" next to the topic
  questions: QuizQuestion[];
  completionFlag: string; // set once all of this category's questions are answered correctly
}

export interface QuizData {
  id: string;
  title: string;
  introTitle: string;
  introPages: string[]; // shown once, before the category picker (see StoryIntroDialog)
  introSeenFlag: string;
  categories: QuizCategory[];
  position: Position;
  interactionRadius?: number;
  requiredFlag?: string;
  completionFlag: string; // set once every category's completionFlag is true
}

// ---- static scene dressing ----

export interface StoryPropData {
  id: string;
  image: string;
  position: Position;
  imageSize?: ImageSize;
  collisionHitbox?: Hitbox;
  visibleWhenFlag?: string; // hidden until this flag is set (e.g. the arrow at the laptop)
  hiddenWhenFlag?: string; // hidden again once this flag is set (e.g. the arrow, after the mini games)
}

// ---- Meep companion commentary ----

export interface MeepBeat {
  id: string;
  trigger: 'onEnter' | 'onFlag' | 'onComplete';
  flag?: string; // required when trigger === 'onFlag'
  text: string;
}

// ---- collectibles ----

export interface CollectibleSpot {
  x: number;
  y: number;
  radius: number;
}

// How a collectible becomes available. Without one it lies at its position
// from the start, hidden until the player is close.
export type CollectibleUnlock =
  | { kind: 'flag'; flag: string } // given at once when the flag is set (e.g. a dialogue answer)
  | { kind: 'sequence'; spots: Record<string, CollectibleSpot>; order: string[] } // walk to these spots in this order; a wrong one starts over
  | { kind: 'idle'; spot: CollectibleSpot; seconds: number }; // stand still in the spot

export interface CollectibleData {
  id: string;
  name: string;
  description: string; // shown in the "found" window
  image: string;
  position?: Position; // where it lies once available; not needed for a 'flag' one
  revealRadius?: number; // it shows (with a sparkle) only within this distance; small = practically invisible
  unlock?: CollectibleUnlock;
}

export interface ChapterCollectibles {
  items: CollectibleData[];
  allFoundText: string; // the extra bit of lore once every one is found
  secretPaths?: WorldBounds[]; // walkable strips outside the room (the room itself is always walkable)
}

// ---- chapter ----

// A laptop (or any spot) that starts the end-of-day mini games when the player
// walks up to it. Done once: the completion flag is set when the games finish.
export interface MiniGameMarker {
  id: string;
  position: Position;
  interactionRadius?: number;
  completionFlag: string;
  requiredFlag?: string; // only available once this flag is set
  // When the games are closed this NPC comments on the result, opening the node for the score band.
  resultsDialogue?: { npcId: string; nodes: Record<ScoreTierId, string> };
}

// The chapter's closing scene: once afterFlag is set and nothing is open, the
// screen fades to black ("<splash title> / subtitle"), the player is seated
// and an NPC opens the scene's dialogue. When the line that sets endFlag
// closes, the player is free again with one objective left: walk out of the
// door, which fades to black and moves the story on.
export interface ChapterOutro {
  afterFlag: string;
  subtitle: string; // e.g. "Some days later"
  playerPosition: Position;
  dialogue: { npcId: string; nodeId: string };
  startedFlag: string; // set when the scene starts: a reload resumes it from the player's seat
  endFlag: string;
  exitObjective: string; // added to the objectives once the scene is over, e.g. "Leave the classroom"
  exitBlockedLine: string; // Meep, when the player walks to the door before the end
}

export interface IntroPage {
  text: string;
}

export interface StoryChapterConfig {
  id: string;
  title: string;
  audioTrack?: string; // background music for this chapter (served from /public/audio)
  splashTitle?: string; // big centred name on the black intro screen when the chapter starts - falls back to title
  intro?: { title: string; pages: IntroPage[] }; // shown once on first entry (tracked by the 'introSeen' flag); omitted = no intro
  worldConfig: WorldConfig;
  floorImage: string;
  playerSpawn: Position;
  props: StoryPropData[];
  npcs: StoryNpcData[];
  quizzes: QuizData[];
  doorPosition: Position; // where the door sprite is drawn (top-left); decorative, the room is left with the Home button
  meepBeats: MeepBeat[];
  completion: { requiredFlags: string[] };
  miniGames?: MiniGameMarker[];
  outro?: ChapterOutro;
  objectives?: { id: string; label: string; flag: string }[]; // shown in the Sandbox-style progress panel, in order
}
