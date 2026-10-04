import { act, renderHook } from '@testing-library/react';
import { revealFlag, useCollectibles } from './useCollectibles';
import { ChapterCollectibles, CollectibleData } from '../../../types/story';

const base = { name: 'x', description: 'x', image: 'x.png' };
const collectibles: ChapterCollectibles = {
  allFoundText: 'all',
  items: [
    { ...base, id: 'lying', position: { x: 100, y: 100 }, revealRadius: 50 },
    { ...base, id: 'gift', unlock: { kind: 'flag', flag: 'gotGift' } },
    {
      ...base,
      id: 'combo',
      position: { x: 900, y: 900 },
      unlock: { kind: 'sequence', spots: { a: { x: 500, y: 500, radius: 20 }, b: { x: 600, y: 500, radius: 20 } }, order: ['a', 'b', 'a'] },
    },
    { ...base, id: 'wait', position: { x: 300, y: 300 }, unlock: { kind: 'idle', spot: { x: 300, y: 300, radius: 20 }, seconds: 5 } },
  ],
};

const setup = (flags: Record<string, boolean> = {}, enabled = true) => {
  const found: string[] = [];
  const setFlags: string[] = [];
  let props = {
    collectibles,
    found: [] as string[],
    flags,
    setFlag: (f: string) => setFlags.push(f),
    playerPosition: { x: 0, y: 0 },
    isMoving: false,
    enabled,
    onFind: (item: CollectibleData) => found.push(item.id),
  };
  const hook = renderHook((p: typeof props) => useCollectibles(p), { initialProps: props });
  const moveTo = (x: number, y: number, extra: Partial<typeof props> = {}) => {
    props = { ...props, playerPosition: { x, y }, ...extra };
    hook.rerender(props);
  };
  return { hook, found, setFlags, moveTo };
};

describe('useCollectibles', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('shows a lying one only up close and picks it up by walking over it', () => {
    const { hook, found, moveTo } = setup();
    expect(hook.result.current.onMap.find((c) => c.item.id === 'lying')?.near).toBe(false);
    moveTo(100, 140);
    expect(hook.result.current.onMap.find((c) => c.item.id === 'lying')?.near).toBe(true);
    expect(found).toEqual([]);
    moveTo(100, 110);
    expect(found).toEqual(['lying']);
  });

  it('gives a flag one as soon as the flag is set, once', () => {
    const { found, moveTo } = setup({ gotGift: true });
    moveTo(1, 1);
    expect(found).toEqual(['gift']);
  });

  it('reveals a sequence one only in the right order, a wrong spot starting over', () => {
    const { setFlags, moveTo } = setup();
    moveTo(500, 500); // a
    moveTo(0, 0);
    moveTo(500, 500); // a again instead of b: starts over from a
    moveTo(0, 0);
    moveTo(600, 500); // b
    moveTo(0, 0);
    expect(setFlags).not.toContain(revealFlag('combo'));
    moveTo(500, 500); // a: done
    expect(setFlags).toContain(revealFlag('combo'));
  });

  it('reveals a wait one after standing still long enough', () => {
    const { setFlags, moveTo } = setup();
    moveTo(300, 300, { isMoving: true });
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(setFlags).not.toContain(revealFlag('wait'));
    moveTo(300, 300, { isMoving: false });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(setFlags).toContain(revealFlag('wait'));
  });

  it('gives nothing while the scene is busy', () => {
    const { found, moveTo } = setup({ gotGift: true }, false);
    moveTo(100, 100);
    expect(found).toEqual([]);
    moveTo(100, 100, { enabled: true });
    expect(found).toEqual(['lying', 'gift']);
  });
});
