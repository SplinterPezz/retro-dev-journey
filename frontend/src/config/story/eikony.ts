import { StoryChapterConfig } from '../../types/story';

const SPRITE = {
  giancarlo: '/sprites/story/npc/giancarlo/giancarlo',
  designer: '/sprites/story/npc/designer/designer',
  generic: '/sprites/story/npc/generic/generic',
};

export const eikonyChapter: StoryChapterConfig = {
  id: 'eikony',
  title: 'Eikony - Internship, 2014',
  audioTrack: '/audio/eikony_placeholder.wav',
  worldConfig: { width: 900, height: 700, tileSize: 128 },
  floorImage: '/sprites/story/props/floor_office.png',
  playerSpawn: { x: 450, y: 540 },
  doorPosition: { x: 450, y: 670 },

  props: [
    { id: 'desk-giancarlo', image: '/sprites/story/props/desk_office.png', position: { x: 300, y: 300 }, imageSize: { width: 144, height: 144 } },
    { id: 'desk-designer', image: '/sprites/story/props/desk_office.png', position: { x: 600, y: 300 }, imageSize: { width: 144, height: 144 } },
    { id: 'desk-colleague-1', image: '/sprites/story/props/desk_office.png', position: { x: 180, y: 480 }, imageSize: { width: 144, height: 144 } },
    { id: 'desk-colleague-2', image: '/sprites/story/props/desk_office.png', position: { x: 720, y: 480 }, imageSize: { width: 144, height: 144 } },
    { id: 'desk-layout', image: '/sprites/story/props/desk_office.png', position: { x: 450, y: 180 }, imageSize: { width: 144, height: 144 } },
    { id: 'desk-debug', image: '/sprites/story/props/desk_office.png', position: { x: 450, y: 450 }, imageSize: { width: 144, height: 144 } },
  ],

  npcs: [
    {
      id: 'giancarlo',
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
            setFlag: 'talkedGiancarlo',
          },
          tiny: {
            id: 'tiny',
            speaker: 'Giancarlo',
            text: "Tiny but mighty. Good for learning, though - you'll touch a bit of everything here.",
            setFlag: 'talkedGiancarlo',
          },
        },
      },
    },
    {
      id: 'designer',
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
            setFlag: 'talkedDesigner',
          },
          reassure: {
            id: 'reassure',
            speaker: 'Designer',
            text: "Nobody's born knowing how CSS boxes work. You'll be fine - just try it.",
            setFlag: 'talkedDesigner',
          },
        },
      },
    },
    {
      id: 'colleague-1',
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
      id: 'colleague-2',
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
      introSeenFlag: 'layoutIntroSeen',
      introPages: [
        "The Designer's mockup is open on the screen - a simple layout, nothing fancy, but it has to match exactly.",
      ],
      position: { x: 450, y: 180 },
      requiredFlag: 'talkedDesigner',
      completionFlag: 'layoutDone',
      categories: [
        {
          id: 'layout',
          label: 'Layout',
          completionFlag: 'layoutCategoryDone',
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
      introSeenFlag: 'debugIntroSeen',
      introPages: [
        "Giancarlo's bug has been sitting in the tracker for days. Time to actually look at the code.",
      ],
      position: { x: 450, y: 450 },
      requiredFlag: 'talkedGiancarlo',
      completionFlag: 'debugDone',
      categories: [
        {
          id: 'debug',
          label: 'Debugging',
          completionFlag: 'debugCategoryDone',
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
    { id: 'giancarlo', trigger: 'onFlag', flag: 'talkedGiancarlo', text: 'He seems chill. I like him already.' },
    { id: 'designer', trigger: 'onFlag', flag: 'talkedDesigner', text: "A mockup! Fancy. Don't mess up the margins or they WILL notice." },
    { id: 'layout', trigger: 'onFlag', flag: 'layoutDone', text: 'Pixel-perfect! Well... pixel-ish.' },
    { id: 'debug', trigger: 'onFlag', flag: 'debugDone', text: "You actually found it! I'm genuinely surprised." },
    { id: 'complete', trigger: 'onComplete', text: 'Not bad for an intern. But some of this still went over your head, huh? Definitely university material.' },
  ],

  completion: { requiredFlags: ['talkedGiancarlo', 'talkedDesigner', 'layoutDone', 'debugDone'] },
};
