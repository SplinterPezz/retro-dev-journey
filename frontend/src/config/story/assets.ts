import { StoryChapterConfig, StoryNpcData } from '../../types/story';
import { playerTurnSprite, preloadPlayerSprites } from '../assets';
import { chapterCollectibles, collectibleIcon } from './collectibles';
import { MEEP_DIRECTIONS, NpcPose, meepSprite, npcSprite, storyProp } from './sprites';

// Sprites a chapter scene draws, preloaded behind the chapter splash.

export const doorImage = storyProp('door');
export const quizMarkerImage = storyProp('quiz_question_mark_v5');
export const quizSparkleImage = '/sprites/others/sparkling.gif';

const meepSprites = MEEP_DIRECTIONS.map(meepSprite);

// The sprites InteriorNpc picks from (W is E mirrored). Only a patrolling NPC
// walks, and the ones that never move have no walk sprites at all.
const WALKING_POSES: NpcPose[] = ['idle', 'walk_E', 'walk_N', 'walk_S'];
const npcSprites = (npc: StoryNpcData) =>
  (npc.patrol ? WALKING_POSES : (['idle'] as NpcPose[])).map((pose) => npcSprite(npc.spriteBase, pose));

export const chapterAssets = (chapter: StoryChapterConfig): string[] => [
  ...new Set([
    ...(chapter.floorImage ? [chapter.floorImage] : []),
    doorImage,
    ...(chapter.sideRooms ?? []).flatMap((r) => [...r.surfaces.map((s) => s.image), r.door.image]),
    ...chapter.props.map((p) => p.image),
    ...(chapter.quizzes.length ? [quizMarkerImage, quizSparkleImage] : []),
    ...chapter.npcs.flatMap(npcSprites),
    ...meepSprites,
    ...preloadPlayerSprites,
    playerTurnSprite,
    ...(chapterCollectibles[chapter.id] ? [collectibleIcon, ...chapterCollectibles[chapter.id].items.map((c) => c.image)] : []),
  ]),
];
