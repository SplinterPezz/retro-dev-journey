import { ChapterCollectibles } from '../../types/story';
import { CHAPTER_IDS } from '../ids';
import { PROLOGUE_FLAGS } from './flags';
import { meepSprite, storyCollectible } from './sprites';

// Apart from the chapter configs, so the story map can count them without loading every dialogue.

export const collectibleIcon = storyCollectible('collectible_icon');
export const collectibleCheer = meepSprite('idle');

export const chapterCollectibles: Record<string, ChapterCollectibles> = {
  [CHAPTER_IDS.prologue]: {
    items: [
      {
        id: 'drumstick',
        name: "Manuel's spare drumstick",
        description:
          "Slightly chewed, definitely used. Manuel swears it has played every dive bar in Palermo. Now it's yours - the band is only one drummer short of a reunion.",
        image: storyCollectible('collectible_drumstick'),
        unlock: { kind: 'flag', flag: PROLOGUE_FLAGS.gotDrumstick },
      },
      {
        id: 'flappyPhone',
        name: 'A phone with Flappy Bird',
        description:
          'Flappy Bird was pulled from the stores in February 2014. This phone, left on the bathroom floor, still has it installed, which makes it priceless. High score: 3.',
        image: storyCollectible('collectible_flappy_phone'),
        position: { x: 430, y: -290 },
        revealRadius: 90,
      },
      {
        id: 'floppy',
        name: 'Floppy disk',
        description:
          "1.44 MB of pure history, found outside the classroom where nobody ever looks. The label says 'tesina_finale'. It won't fit in any computer in here.",
        image: storyCollectible('collectible_floppy'),
        position: { x: 1400, y: 500 },
        revealRadius: 180,
      },
      {
        id: 'javaManual',
        name: 'Coffee-stained Java manual',
        description:
          'You made the perfect coffee and spilled half of it on chapter four. The stain covers exactly the part about interfaces, which explains a lot.',
        image: storyCollectible('collectible_java_manual'),
        position: { x: 290, y: 1050 },
        revealRadius: 180,
        unlock: {
          kind: 'sequence',
          spots: {
            coffee: { x: 290, y: 1015, radius: 55 },
            water: { x: 100, y: 1050, radius: 55 },
          },
          order: ['coffee', 'water', 'coffee'],
        },
      },
      {
        id: 'stickyNote',
        name: 'Sticky note: password123',
        description:
          "It fell off the corkboard while you stood there staring. Someone's Wi-Fi password, probably. Security has come a long way since 2014. Hopefully.",
        image: storyCollectible('collectible_sticky_note'),
        position: { x: 1165, y: 540 },
        revealRadius: 180,
        // clear of classmate-7, who stands below the board until the class sits down
        unlock: { kind: 'idle', spot: { x: 1150, y: 515, radius: 45 }, seconds: 5 },
      },
    ],
    allFoundText:
      'Every lost thing in the ANFE classroom found its way to you. Years later the floppy is still in a drawer, the drumstick still taps on desks during meetings, and password123 is - hopefully - nobody\'s password anymore.',
    secretPaths: [
      { minX: 1240, minY: 200, maxX: 1420, maxY: 240 },
      { minX: 1380, minY: 200, maxX: 1420, maxY: 520 },
    ],
  },
};
