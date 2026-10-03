import { StoryChapterConfig, StoryNpcData } from '../../types/story';
import { playerTurnSprite, preloadPlayerSprites } from '../assets';

// Sprites a chapter scene draws, preloaded behind the chapter splash.

export const doorImage = '/sprites/story/props/door.png';
export const quizMarkerImage = '/sprites/story/props/quiz_question_mark_v5.png';
export const quizSparkleImage = '/sprites/others/sparkling.gif';

const meepDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const meepSprites = meepDirections.map((d) => `/sprites/story/companion/meep/meep_${d}.gif`);

// The sprites InteriorNpc picks from (W is E mirrored). Only a patrolling NPC
// walks, and the ones that never move have no walk sprites at all.
const npcSprites = (npc: StoryNpcData) =>
  (npc.patrol ? ['idle', 'walk_E', 'walk_N', 'walk_S'] : ['idle']).map((s) => `${npc.spriteBase}_${s}.gif`);

export const chapterAssets = (chapter: StoryChapterConfig): string[] => [
  ...new Set([
    ...(chapter.floorImage ? [chapter.floorImage] : []),
    doorImage,
    ...chapter.props.map((p) => p.image),
    ...(chapter.quizzes.length ? [quizMarkerImage, quizSparkleImage] : []),
    ...chapter.npcs.flatMap(npcSprites),
    ...meepSprites,
    ...preloadPlayerSprites,
    playerTurnSprite,
  ]),
];
