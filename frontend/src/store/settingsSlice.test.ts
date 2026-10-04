import settingsReducer, { chooseSound } from './settingsSlice';

describe('chooseSound', () => {
  const fresh = settingsReducer(undefined, { type: 'init' });

  it('starts with every sound off and the question not asked yet', () => {
    expect(fresh).toMatchObject({ musicMuted: true, dialogueMuted: true, soundAsked: false });
  });

  it('turns music and dialogue sound on together, and remembers it was asked', () => {
    expect(settingsReducer(fresh, chooseSound(true))).toMatchObject({
      musicMuted: false,
      dialogueMuted: false,
      soundAsked: true,
    });
  });

  it('keeps every sound off when the player says no', () => {
    expect(settingsReducer(fresh, chooseSound(false))).toMatchObject({
      musicMuted: true,
      dialogueMuted: true,
      soundAsked: true,
    });
  });
});
