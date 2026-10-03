import { MigrationManifest, PersistedState } from 'redux-persist';

// Version of the persisted state (localStorage key "persist:root").
//
// When a release changes the shape of a persisted slice, bump this number and
// add a migration from the previous version below. redux-persist runs every
// migration between the stored version and this one, in order, so a returning
// visitor keeps their story progress instead of loading a broken shape.
export const PERSIST_VERSION = 2;

type AnyState = PersistedState & Record<string, any>;

export const migrations: MigrationManifest = {
  // 1 -> 2 (release 1.0): the tracking id used to be a hash of the browser's
  // user agent, screen and time zone, shared by identical devices. Drop it so a
  // random one is created on the next visit; everything else is unchanged.
  2: (state) => {
    const s = state as AnyState;
    if (!s?.tracking) return state;
    return { ...s, tracking: { ...s.tracking, uuid: '' } } as PersistedState;
  },
};
