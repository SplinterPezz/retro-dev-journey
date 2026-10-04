import { StoryChapterConfig } from '../../types/story';
import { CHAPTER_IDS } from '../ids';
import { EIKONY_FLAGS as FLAG } from './flags';
import { npcSpriteBase, storyProp } from './sprites';

// NPC ids: dialogue hand-overs (nextNpcId) and cued scenes (npcId) refer to them.
const NPC = {
  giancarlo: 'giancarlo',
  designer: 'designer',
  colleague1: 'colleague-1',
  colleague2: 'colleague-2',
} as const;

const SPRITE = {
  giancarlo: npcSpriteBase('giancarlo'),
  designer: npcSpriteBase('designer'),
  generic: npcSpriteBase('generic'),
};

export const eikonyChapter: StoryChapterConfig = {
  id: CHAPTER_IDS.eikony,
  title: 'Eikony - Internship, 2014',
  audioTrack: '/audio/eikony_placeholder.wav',
  worldConfig: { width: 900, height: 700, tileSize: 128 },
  floorImage: storyProp('floor_office'),
  playerSpawn: { x: 450, y: 540 },
  doorPosition: { x: 450, y: 670 },

  props: [
    { id: 'desk-giancarlo', image: storyProp('desk_office'), position: { x: 300, y: 300 }, imageSize: { width: 144, height: 144 } },
    { id: 'desk-designer', image: storyProp('desk_office'), position: { x: 600, y: 300 }, imageSize: { width: 144, height: 144 } },
    { id: 'desk-colleague-1', image: storyProp('desk_office'), position: { x: 180, y: 480 }, imageSize: { width: 144, height: 144 } },
    { id: 'desk-colleague-2', image: storyProp('desk_office'), position: { x: 720, y: 480 }, imageSize: { width: 144, height: 144 } },
    { id: 'desk-layout', image: storyProp('desk_office'), position: { x: 450, y: 180 }, imageSize: { width: 144, height: 144 } },
    { id: 'desk-debug', image: storyProp('desk_office'), position: { x: 450, y: 450 }, imageSize: { width: 144, height: 144 } },
  ],

  npcs: [
    {
      id: NPC.giancarlo,
      name: 'Giancarlo',
      spriteBase: SPRITE.giancarlo,
      position: { x: 300, y: 260 },
      dialogue: {
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            speaker: 'Giancarlo',
            text: "Welcome aboard! Don't mind the chaos, we're basically four people and a coffee machine held together by duct tape.",
            choices: [
              { text: 'What should I work on first?', next: 'task' },
              { text: 'This place is tiny!', next: 'tiny' },
            ],
          },
          task: {
            id: 'task',
            speaker: 'Giancarlo',
            text: "Head over to that workstation - there's a bug in the app that's been bothering us for days. See what you can find.",
            setFlag: FLAG.talkedGiancarlo,
          },
          tiny: {
            id: 'tiny',
            speaker: 'Giancarlo',
            text: "Tiny but mighty. Good for learning, though - you'll touch a bit of everything here.",
            setFlag: FLAG.talkedGiancarlo,
          },
        },
      },
    },
    {
      id: NPC.designer,
      name: 'Designer',
      spriteBase: SPRITE.designer,
      position: { x: 600, y: 260 },
      dialogue: {
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            speaker: 'Designer',
            text: "Hey, new blood! I've got a layout mockup that needs implementing, if you're up for it.",
            choices: [
              { text: 'Sure, show me.', next: 'mockup' },
              { text: "I'm still pretty new to this...", next: 'reassure' },
            ],
          },
          mockup: {
            id: 'mockup',
            speaker: 'Designer',
            text: 'Nothing fancy - just match the spacing and alignment. Come find the layout station when you\'re ready.',
            setFlag: FLAG.talkedDesigner,
          },
          reassure: {
            id: 'reassure',
            speaker: 'Designer',
            text: "Nobody's born knowing how CSS boxes work. You'll be fine - just try it.",
            setFlag: FLAG.talkedDesigner,
          },
        },
      },
    },
    {
      id: NPC.colleague1,
      name: 'Colleague',
      spriteBase: SPRITE.generic,
      position: { x: 180, y: 480 },
      dialogue: {
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            speaker: 'Colleague',
            text: "Have you seen the coffee machine? It's held together by hope at this point.",
          },
        },
      },
    },
    {
      id: NPC.colleague2,
      name: 'Colleague',
      spriteBase: SPRITE.generic,
      position: { x: 720, y: 480 },
      dialogue: {
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            speaker: 'Colleague',
            text: 'Four interns, one bathroom. Welcome to the trenches.',
          },
        },
      },
    },
  ],

  quizzes: [
    {
      id: 'layout-station',
      title: 'Layout mockup',
      introTitle: 'The Mockup',
      introSeenFlag: FLAG.layoutIntroSeen,
      introPages: [
        "The Designer's mockup is open on the screen - a simple layout, nothing fancy, but it has to match exactly.",
      ],
      position: { x: 450, y: 180 },
      requiredFlag: FLAG.talkedDesigner,
      completionFlag: FLAG.layoutDone,
      categories: [
        {
          id: 'layout',
          label: 'Layout',
          completionFlag: FLAG.layoutCategoryDone,
          questions: [
            {
              id: 'l1',
              question: "Which CSS property centers a block element horizontally when set to 'auto' on both sides?",
              options: ['margin', 'padding', 'border', 'outline'],
              correctIndex: 0,
              onWrongText: 'Not quite - think about the space around the box, not inside it.',
            },
            {
              id: 'l2',
              question: "What does 'px' stand for in CSS sizing?",
              options: ['Pixels', 'Points', 'Percent', 'Paragraphs'],
              correctIndex: 0,
              onWrongText: 'Nope, try again.',
            },
          ],
        },
      ],
    },
    {
      id: 'debug-station',
      title: 'Bug hunt',
      introTitle: 'The Bug',
      introSeenFlag: FLAG.debugIntroSeen,
      introPages: [
        "Giancarlo's bug has been sitting in the tracker for days. Time to actually look at the code.",
      ],
      position: { x: 450, y: 450 },
      requiredFlag: FLAG.talkedGiancarlo,
      completionFlag: FLAG.debugDone,
      categories: [
        {
          id: 'debug',
          label: 'Debugging',
          completionFlag: FLAG.debugCategoryDone,
          questions: [
            {
              id: 'd1',
              question: "What's the bug?  if (count = 0) { reset(); }",
              options: ['Uses = instead of ==', 'Missing semicolon', "'count' is misspelled", "Nothing's wrong"],
              correctIndex: 0,
              onWrongText: 'Look very closely at that condition...',
            },
            {
              id: 'd2',
              question: 'The app crashes with a NullPointerException. Most likely cause?',
              options: [
                'An object reference that was never initialized',
                'Too many comments',
                'The internet is down',
                'The IDE needs a restart',
              ],
              correctIndex: 0,
              onWrongText: "That's not it. Think about what 'null' actually means.",
            },
          ],
        },
      ],
    },
  ],

  meepBeats: [
    { id: 'enter', trigger: 'onEnter', text: "Ooh, real office energy. Try not to touch anything that beeps." },
    { id: 'giancarlo', trigger: 'onFlag', flag: FLAG.talkedGiancarlo, text: 'He seems chill. I like him already.' },
    { id: 'designer', trigger: 'onFlag', flag: FLAG.talkedDesigner, text: "A mockup! Fancy. Don't mess up the margins or they WILL notice." },
    { id: 'layout', trigger: 'onFlag', flag: FLAG.layoutDone, text: 'Pixel-perfect! Well... pixel-ish.' },
    { id: 'debug', trigger: 'onFlag', flag: FLAG.debugDone, text: "You actually found it! I'm genuinely surprised." },
    { id: 'complete', trigger: 'onComplete', text: 'Not bad for an intern. But some of this still went over your head, huh? Definitely university material.' },
  ],

  completion: { requiredFlags: [FLAG.talkedGiancarlo, FLAG.talkedDesigner, FLAG.layoutDone, FLAG.debugDone] },
};
