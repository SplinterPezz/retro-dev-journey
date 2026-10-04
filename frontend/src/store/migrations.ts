import { MigrationManifest, PersistedState } from 'redux-persist';

// Bump when a persisted slice changes shape, and add a migration below.
export const PERSIST_VERSION = 2;

type AnyState = PersistedState & Record<string, unknown> & { tracking?: Record<string, unknown> };

export const migrations: MigrationManifest = {
  // 1 -> 2: drop the old device-hash tracking id; a random one is created next visit.
  2: (state) => {
    const s = state as AnyState;
    if (!s?.tracking) return state;
    return { ...s, tracking: { ...s.tracking, uuid: '' } } as PersistedState;
  },
};
