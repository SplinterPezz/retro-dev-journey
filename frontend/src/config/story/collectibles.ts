import { ChapterCollectibles } from '../../types/story';

// Hidden collectibles per chapter. Kept apart from the chapter configs so the
// story map can show the counts without loading every dialogue.
//
// Each one is found a different way (see CollectibleUnlock): lying in plain
// sight but only visible up close, given in a dialogue, reached through a
// secret path outside the walls, made by doing things in the right order, or
// waiting long enough in the right spot.

const SPRITES = '/sprites/story/collectibles';

export const collectibleIcon = `${SPRITES}/collectible_icon.png`;
// Meep cheers from the corner of the "found" window.
export const collectibleCheer = '/sprites/story/companion/meep/meep_idle.gif';

export const chapterCollectibles: Record<string, ChapterCollectibles> = {
  prologue: {
    items: [
      {
        // dialogue: tell Manuel you play an instrument too
        id: 'drumstick',
        name: "Manuel's spare drumstick",
        description:
          "Slightly chewed, definitely used. Manuel swears it has played every dive bar in Palermo. Now it's yours - the band is only one drummer short of a reunion.",
        image: `${SPRITES}/collectible_drumstick.png`,
        unlock: { kind: 'flag', flag: 'gotDrumstick' },
      },
      {
        // hidden: in the corner by the instructor's desk, visible only from a few steps
        id: 'flappyPhone',
        name: 'A phone with Flappy Bird',
        description:
          'Flappy Bird was pulled from the stores in February 2014. This phone still has it installed, which makes it priceless. High score: 3.',
        image: `${SPRITES}/collectible_flappy_phone.png`,
        position: { x: 858, y: 230 },
        revealRadius: 45,
      },
      {
        // off the map: through the gap in the right wall, behind the globe
        id: 'floppy',
        name: 'Floppy disk',
        description:
          "1.44 MB of pure history, found outside the classroom where nobody ever looks. The label says 'tesina_finale'. It won't fit in any computer in here.",
        image: `${SPRITES}/collectible_floppy.png`,
        position: { x: 1400, y: 500 },
        revealRadius: 120,
      },
      {
        // sequence: coffee machine, water dispenser, coffee machine again
        id: 'javaManual',
        name: 'Coffee-stained Java manual',
        description:
          'You made the perfect coffee and spilled half of it on chapter four. The stain covers exactly the part about interfaces, which explains a lot.',
        image: `${SPRITES}/collectible_java_manual.png`,
        position: { x: 290, y: 1050 },
        revealRadius: 120,
        unlock: {
          kind: 'sequence',
          spots: {
            coffee: { x: 290, y: 1015, radius: 55 }, // in front of the coffee table
            water: { x: 100, y: 1050, radius: 55 }, // next to the water dispenser
          },
          order: ['coffee', 'water', 'coffee'],
        },
      },
      {
        // idle: stand still in front of the corkboard
        id: 'stickyNote',
        name: 'Sticky note: password123',
        description:
          "It fell off the corkboard while you stood there staring. Someone's Wi-Fi password, probably. Security has come a long way since 2014. Hopefully.",
        image: `${SPRITES}/collectible_sticky_note.png`,
        position: { x: 1165, y: 540 },
        revealRadius: 120,
        // left of the board: clear of classmate-7, who stands below it until the class sits down
        unlock: { kind: 'idle', spot: { x: 1150, y: 515, radius: 45 }, seconds: 5 },
      },
    ],
    allFoundText:
      'Every lost thing in the ANFE classroom found its way to you. Years later the floppy is still in a drawer, the drumstick still taps on desks during meetings, and password123 is - hopefully - nobody\'s password anymore.',
    // behind the globe a gap in the right wall leads along the outside of the room, down to the floppy
    secretPaths: [
      { minX: 1240, minY: 200, maxX: 1420, maxY: 240 },
      { minX: 1380, minY: 200, maxX: 1420, maxY: 520 },
    ],
  },
};

export const collectibleCount = (chapterId: string): number => chapterCollectibles[chapterId]?.items.length ?? 0;
