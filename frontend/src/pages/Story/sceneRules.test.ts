import { prologueChapter } from '../../config/story/prologue';
import { DEFAULT_STATION_REACH, chapterObjectives, sceneCollidables } from './sceneRules';

describe('sceneCollidables', () => {
  const { npcs, quizzes, miniGames, blockers } = sceneCollidables(prologueChapter, {}, {});

  it('lists every NPC, quiz station and mini-game spot of the chapter', () => {
    expect(npcs.map((n) => n.id)).toEqual(prologueChapter.npcs.map((n) => n.id));
    expect(quizzes.map((q) => q.id)).toEqual(prologueChapter.quizzes.map((q) => q.id));
    expect(miniGames).toHaveLength(prologueChapter.miniGames?.length ?? 0);
  });

  it('gives a station without its own radius the default reach', () => {
    expect(quizzes[0]?.interactionRadius).toBe(prologueChapter.quizzes[0]?.interactionRadius ?? DEFAULT_STATION_REACH);
  });

  it('blocks the way with NPCs and props', () => {
    expect(blockers).toHaveLength(prologueChapter.npcs.length + prologueChapter.props.length);
  });

  it('puts a patrolling NPC where its patrol has it', () => {
    const moved = sceneCollidables(prologueChapter, {}, { [prologueChapter.npcs[0]?.id ?? '']: { x: 1, y: 2 } });
    expect(moved.npcs[0]?.position).toEqual({ x: 1, y: 2 });
  });
});

describe('chapterObjectives', () => {
  const first = prologueChapter.objectives?.[0];

  it('marks an objective done by its flag', () => {
    expect(chapterObjectives(prologueChapter, {})?.[0]?.done).toBe(false);
    expect(chapterObjectives(prologueChapter, { [first?.flag ?? '']: true })?.[0]?.done).toBe(true);
  });

  it('adds the way out once the closing scene is over', () => {
    const plain = chapterObjectives(prologueChapter, {});
    const withExit = chapterObjectives(prologueChapter, {}, 'Leave the classroom');
    expect(withExit).toHaveLength((plain?.length ?? 0) + 1);
    expect(withExit?.at(-1)).toMatchObject({ label: 'Leave the classroom', done: false });
  });
});
