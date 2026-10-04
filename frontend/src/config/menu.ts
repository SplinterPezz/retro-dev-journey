import { playerIdleSprite } from './assets';

// The player card at the top of the game menu.
export const menuProfile = {
  name: 'Mauro Pezzati',
  profession: 'Software Developer',
  portrait: playerIdleSprite, // the player standing, animated
};

// Music volume (0-100) until the player sets one in the menu; the music
// starts muted, as browsers do not play sound before the first interaction.
export const DEFAULT_MUSIC_VOLUME = 30;
