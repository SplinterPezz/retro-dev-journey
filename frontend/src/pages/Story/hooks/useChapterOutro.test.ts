import { act, renderHook } from '@testing-library/react';
import { useChapterOutro } from './useChapterOutro';
import { ChapterOutro, StoryNpcData } from '../../../types/story';

const outro: ChapterOutro = {
  afterFlag: 'gamesDone',
  subtitle: 'Some days later',
  playerPosition: { x: 10, y: 20 },
  dialogue: { npcId: 'teacher', nodeId: 'speech' },
  startedFlag: 'outroStarted',
  endFlag: 'ended',
  exitObjective: 'Leave',
  exitBlockedLine: 'Not yet',
};
const teacher = { id: 'teacher' } as StoryNpcData;

const setup = (initialFlags: Record<string, boolean>) => {
  const calls = { flags: [] as string[], seat: [] as unknown[], cue: [] as string[], end: 0 };
  const props = {
    outro,
    flags: initialFlags,
    setFlag: (f: string) => calls.flags.push(f),
    ready: true,
    busy: false,
    npcs: [teacher],
    cue: (_: StoryNpcData, nodeId: string) => calls.cue.push(nodeId),
    seatPlayer: (p: unknown) => calls.seat.push(p),
    onEnd: () => calls.end++,
  };
  const hook = renderHook((p: typeof props) => useChapterOutro(p), { initialProps: props });
  return { hook, props, calls };
};

describe('useChapterOutro', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fades to black with the subtitle, seats the player, then opens the scene', () => {
    const { hook, props, calls } = setup({ gamesDone: true });
    expect(hook.result.current.curtain).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(hook.result.current.curtain).toEqual({ subtitle: 'Some days later', leaving: false });
    expect(hook.result.current.active).toBe(true);

    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(calls.flags).toContain('outroStarted');
    expect(calls.seat).toEqual([{ x: 10, y: 20 }]);

    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(hook.result.current.curtain?.leaving).toBe(true);

    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(hook.result.current.curtain).toBeNull();
    expect(calls.cue).toEqual(['speech']);

    // the last line sets the end flag and closes: free to walk to the door
    hook.rerender({ ...props, flags: { gamesDone: true, outroStarted: true, ended: true } });
    expect(hook.result.current.active).toBe(false);
    expect(hook.result.current.curtain).toBeNull();

    // through the door: black again, then the map
    act(() => {
      hook.result.current.leave();
    });
    expect(hook.result.current.curtain).toEqual({ leaving: false });
    act(() => {
      vi.advanceTimersByTime(2400);
    });
    expect(calls.end).toBe(1);
  });

  it('waits while a dialogue is open', () => {
    const { hook, props } = setup({ gamesDone: true });
    hook.rerender({ ...props, busy: true });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(hook.result.current.curtain).toBeNull();
  });

  it('the door does nothing before the scene is over', () => {
    const { hook } = setup({});
    act(() => {
      hook.result.current.leave();
    });
    expect(hook.result.current.curtain).toBeNull();
  });

  it('sends back to the map when the chapter is already over', () => {
    const { hook, calls } = setup({ gamesDone: true, outroStarted: true, ended: true });
    expect(hook.result.current.curtain).toEqual({ leaving: false });
    act(() => {
      vi.advanceTimersByTime(2400);
    });
    expect(calls.end).toBe(1);
  });

  it('resumes the scene after a reload', () => {
    const { calls } = setup({ gamesDone: true, outroStarted: true });
    expect(calls.cue).toEqual(['speech']);
  });
});
