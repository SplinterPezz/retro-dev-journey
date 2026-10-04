import reducer, { setFlag, completeChapter, recordScore, resetChapter, resetStory, setDifficulty, markDiscoverySeen } from './storySlice';

const initial = reducer(undefined, { type: '@@init' });

describe('storySlice', () => {
  it('sets flags per chapter, creating the chapter on first use', () => {
    const state = reducer(initial, setFlag({ chapterId: 'prologue', flag: 'introSeen' }));
    expect(state.chapters.prologue).toEqual({ completed: false, flags: { introSeen: true } });
  });

  it('only ever raises the unlocked chapter index', () => {
    let state = reducer(initial, completeChapter({ chapterId: 'eikony', unlockIndex: 2 }));
    state = reducer(state, completeChapter({ chapterId: 'prologue', unlockIndex: 1 }));
    expect(state.unlockedChapterIndex).toBe(2);
    expect(state.chapters.prologue.completed).toBe(true);
  });

  it('keeps the best mini-game score', () => {
    let state = reducer(initial, recordScore({ chapterId: 'p', gameId: 'pc', score: { earned: 300, max: 500 } }));
    state = reducer(state, recordScore({ chapterId: 'p', gameId: 'pc', score: { earned: 100, max: 500 } }));
    expect(state.chapters.p.scores?.pc).toEqual({ earned: 300, max: 500 });
    state = reducer(state, recordScore({ chapterId: 'p', gameId: 'pc', score: { earned: 500, max: 500 } }));
    expect(state.chapters.p.scores?.pc.earned).toBe(500);
  });

  it('resets one chapter or the whole story, clearing the difficulty', () => {
    let state = reducer(initial, setDifficulty('senior'));
    state = reducer(state, setFlag({ chapterId: 'a', flag: 'x' }));
    state = reducer(state, setFlag({ chapterId: 'b', flag: 'y' }));
    expect(Object.keys(reducer(state, resetChapter({ chapterId: 'a' })).chapters)).toEqual(['b']);
    const reset = reducer(state, resetStory());
    expect(reset.chapters).toEqual({});
    expect(reset.difficulty).toBeNull();
  });

  it('remembers each discovery once and forgets them on a new story', () => {
    let state = reducer(initial, markDiscoverySeen('java'));
    state = reducer(state, markDiscoverySeen('java'));
    state = reducer(state, markDiscoverySeen('git'));
    expect(state.discoveriesSeen).toEqual(['java', 'git']);
    expect(reducer(state, resetStory()).discoveriesSeen).toEqual([]);
  });
});
