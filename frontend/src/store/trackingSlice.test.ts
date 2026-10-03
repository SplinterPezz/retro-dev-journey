import reducer, { addInteraction, cleanOldInteractions, clearAllTrackingData, setUUID } from './trackingSlice';

const today = new Date().toISOString().slice(0, 10);

describe('trackingSlice', () => {
  it('stores an interaction once', () => {
    let state = reducer(undefined, addInteraction(`sandbox-interaction-java-${today}`));
    state = reducer(state, addInteraction(`sandbox-interaction-java-${today}`));
    expect(state.interactions).toHaveLength(1);
  });

  it('drops interactions from previous days and keeps today and undated keys', () => {
    const state = {
      uuid: 'id',
      interactions: [`sandbox-view-30-2020-01-01`, `sandbox-view-30-${today}`, 'legacy-key'],
    };
    expect(reducer(state, cleanOldInteractions()).interactions).toEqual([`sandbox-view-30-${today}`, 'legacy-key']);
  });

  it('wipes everything on consent revoke', () => {
    let state = reducer(undefined, setUUID('abc'));
    state = reducer(state, addInteraction('k'));
    expect(reducer(state, clearAllTrackingData())).toEqual({ uuid: '', interactions: [] });
  });
});
