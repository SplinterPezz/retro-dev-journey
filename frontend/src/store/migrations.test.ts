import { migrations, PERSIST_VERSION } from './migrations';

describe('persisted state migrations', () => {
  it('has a migration for every version above 1', () => {
    for (let v = 2; v <= PERSIST_VERSION; v++) {
      expect(migrations[v]).toBeDefined();
    }
  });

  it('1 -> 2 drops the fingerprint-based id and keeps the rest', () => {
    const v1 = {
      _persist: { version: 1, rehydrated: false },
      tracking: { uuid: 'abcd1234-abcd-4bcd-abcd-abcd1234', interactions: ['k'] },
      story: { unlockedChapterIndex: 1, chapters: { prologue: { completed: true, flags: {} } } },
    };
    const v2 = migrations[2](v1) as unknown as typeof v1;
    expect(v2.tracking).toEqual({ uuid: '', interactions: ['k'] });
    expect(v2.story).toBe(v1.story);
  });

  it('1 -> 2 accepts a state without tracking', () => {
    const v1 = { _persist: { version: 1, rehydrated: false } };
    expect(migrations[2](v1)).toBe(v1);
  });
});
