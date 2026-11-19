import { act, renderHook } from '@testing-library/react';
import { useLingering } from './useLingering';

describe('useLingering', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('shows the value at once and keeps it for the delay after it is gone', () => {
    const hook = renderHook(({ value }: { value: string | null }) => useLingering(value, 50), {
      initialProps: { value: null as string | null },
    });
    expect(hook.result.current).toBeNull();

    hook.rerender({ value: 'statue' });
    expect(hook.result.current).toBe('statue');

    hook.rerender({ value: null });
    expect(hook.result.current).toBe('statue');

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(hook.result.current).toBeNull();
  });

  it('does not hide a value that comes back within the delay', () => {
    const hook = renderHook(({ value }: { value: string | null }) => useLingering(value, 50), {
      initialProps: { value: 'statue' as string | null },
    });
    hook.rerender({ value: null });
    act(() => {
      vi.advanceTimersByTime(30);
    });
    hook.rerender({ value: 'statue' });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(hook.result.current).toBe('statue');
  });
});
