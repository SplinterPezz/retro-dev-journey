import { StoryChapterConfig, StoryNpcData } from '../../types/story';
import { StructureData } from '../../types/sandbox';
import { lockSprite, playerTurnSprite, preloadPathSprites, preloadPlayerSprites } from '../assets';
import { companies } from '../career';
import { detailsEnvironments, treesEnvironments } from '../environments';
import { mainTerrainImage } from '../world';
import { chapterCollectibles, collectibleIcon } from './collectibles';
import { MEEP_DIRECTIONS, NpcPose, meepSprite, npcSprite, storyProp } from './sprites';

export const doorImage = storyProp('door');
export const quizMarkerImage = storyProp('quiz_question_mark_v5');
export const quizSparkleImage = '/sprites/others/sparkling.gif';

const meepSprites = MEEP_DIRECTIONS.map(meepSprite);

// only patrolling NPCs walk; the others have no walk sprites
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

export const storyMapAssets = (statues: StructureData[]): string[] =>
  [
    ...new Set([
      mainTerrainImage,
      ...preloadPathSprites,
      ...preloadPlayerSprites,
      ...meepSprites,
      lockSprite,
      ...companies.flatMap((c) => [c.data.image, c.data.signpost]),
      ...statues.map((t) => t.data.image),
      ...[...treesEnvironments, ...detailsEnvironments].map((e) => e.image),
    ]),
  ].filter((src): src is string => !!src);
