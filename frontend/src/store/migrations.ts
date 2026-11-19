import { MigrationManifest } from 'redux-persist';

// Bump when a persisted slice changes shape, and add a migration below.
export const PERSIST_VERSION = 2;

export const migrations: MigrationManifest = {
  // 1 -> 2: drop the old device-hash tracking id; a random one is created next visit.
  2: (state) => {
    if (!state || !('tracking' in state) || typeof state.tracking !== 'object') return state;
    return { ...state, tracking: { ...state.tracking, uuid: '' } };
  },
};
