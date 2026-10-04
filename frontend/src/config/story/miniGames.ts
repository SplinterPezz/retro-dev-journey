import { ScoreTierId, StoryDifficulty } from '../../types/story';

// One try per question: right is worth BASE_POINTS times the difficulty multiplier, wrong nothing.
export const BASE_POINTS = 100;

export const difficultyMultiplier: Record<StoryDifficulty, number> = {
  junior: 1,
  middle: 1.5,
  senior: 2,
};

export interface FixSnippet {
  id: string;
  bugged: string;
  expected: string;
  hint: string;
}

export const fixBuildSnippets: FixSnippet[] = [
  {
    id: 'fix-equals',
    bugged: `public boolean isDude(String name) {
    return name == "Dude";
}`,
    expected: `public boolean isDude(String name) {
    return name.equals("Dude");
}`,
    hint: 'Strings are compared with equals(), not ==.',
  },
  {
    id: 'fix-bounds',
    bugged: `for (int i = 0; i <= list.size(); i++) {
    System.out.println(list.get(i));
}`,
    expected: `for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}`,
    hint: 'The last valid index is size() - 1.',
  },
  {
    id: 'fix-return',
    bugged: `public int square(int x) {
    x * x;
}`,
    expected: `public int square(int x) {
    return x * x;
}`,
    hint: 'A method that returns a value needs return.',
  },
  {
    id: 'fix-ternary',
    bugged: `String label = count > 0 ? "many" : ;
System.out.println(label);`,
    expected: `String label = count > 0 ? "many" : "none";
System.out.println(label);`,
    hint: 'A ternary needs a value for both branches.',
  },
  {
    id: 'fix-cast',
    bugged: `Button b = findViewById(R.id.btn);
b.setText("Hi");`,
    expected: `Button b = (Button) findViewById(R.id.btn);
b.setText("Hi");`,
    hint: 'findViewById returns a View: cast it to Button.',
  },
];

export const fixBuildCountByDifficulty: Record<StoryDifficulty, number> = {
  junior: 3,
  middle: 4,
  senior: 5,
};

interface CommitOption {
  hash: string;
  message: string;
  breaks: boolean;
}

export interface CommitRound {
  id: string;
  prompt: string;
  options: CommitOption[];
}

export const commitRounds: CommitRound[] = [
  {
    id: 'commit-build',
    prompt: 'Which commit broke the build?',
    options: [
      { hash: 'a1f3c9e', message: 'Add login screen', breaks: false },
      { hash: 'b72d0a4', message: 'Fix typo in footer', breaks: false },
      { hash: 'c9e15bb', message: 'Simplify date formatter: drop the null check', breaks: true },
      { hash: 'd04a7f1', message: 'Update README badges', breaks: false },
      { hash: 'e88b26c', message: 'Tweak hitbox of desk 7', breaks: false },
    ],
  },
  {
    id: 'commit-startup',
    prompt: 'The app now crashes on startup. Which commit did it?',
    options: [
      { hash: 'f1b9d20', message: 'Bump the Gradle plugin version', breaks: false },
      { hash: '7d3e9f5', message: 'Fetch the company list on the main thread', breaks: true },
      { hash: '0ac47e2', message: 'Add colors for the dark theme', breaks: false },
      { hash: '91c0b6a', message: 'Translate the onboarding into Italian', breaks: false },
      { hash: '3e5f8d1', message: 'Remove unused imports', breaks: false },
    ],
  },
];

export const commitRoundsByDifficulty: Record<StoryDifficulty, number> = {
  junior: 1,
  middle: 2,
  senior: 2,
};

export const commitCountByDifficulty: Record<StoryDifficulty, number> = {
  junior: 3,
  middle: 4,
  senior: 5,
};

const logInfoLines = [
  'I/Gradle: Configuring project :app',
  'I/System: Loading resources for MainActivity',
  'D/Network: GET /api/companies 200 (84ms)',
  'I/Choreographer: Skipped 2 frames',
  'D/Storage: cache hit for avatar.png',
  'I/MainActivity: onResume',
  'D/Layout: measured 1080x2400',
  'I/Process: started process com.example.app',
  'D/Db: query companies in 3ms',
  'I/Sensor: accelerometer registered',
  'D/Network: GET /api/technologies 200 (61ms)',
  'I/Theme: applied night mode',
  'D/Audio: track loaded',
  'I/Router: navigated to /sandbox',
  'D/Storage: write preferences',
  'I/Lifecycle: onPause',
  'D/Network: POST /api/track 204 (40ms)',
  'I/Gradle: build finished in 12s',
  'D/Render: frame budget ok',
  'I/MainActivity: onStop',
];

const logWarningLines = [
  'W/Layout: deprecated attribute android:layout_weight',
  'W/Network: slow response from /api/companies (900ms)',
  'W/Storage: cache nearly full (92%)',
  'W/Sensor: noisy reading, filtering',
];

const logRounds = [
  { error: 'E/AndroidRuntime: FATAL EXCEPTION: main java.lang.NullPointerException', at: 0.5, offset: 0 },
  { error: 'E/AndroidRuntime: FATAL EXCEPTION: main java.lang.IndexOutOfBoundsException: Index: 5, Size: 5', at: 0.75, offset: 7 },
];

export const logRoundsByDifficulty: Record<StoryDifficulty, number> = {
  junior: 1,
  middle: 1,
  senior: 2,
};

// warnings look like the error and make it harder to spot
const logShapeByDifficulty: Record<StoryDifficulty, { lines: number; warnings: number }> = {
  junior: { lines: 6, warnings: 0 },
  middle: { lines: 12, warnings: 3 },
  senior: { lines: 20, warnings: 4 },
};

const rotate = <T>(items: T[], by: number): T[] => [...items.slice(by), ...items.slice(0, by)];

export const buildLog = (difficulty: StoryDifficulty, round: number): { lines: string[]; errorIndex: number } => {
  const { lines, warnings } = logShapeByDifficulty[difficulty];
  const { error, at, offset } = logRounds[round];
  const info = rotate(logInfoLines, offset).slice(0, lines - warnings - 1);
  const noise = rotate(logWarningLines, round).slice(0, warnings);
  const body = [...info, ...noise];
  const errorIndex = Math.floor(body.length * at);
  body.splice(errorIndex, 0, error);
  return { lines: body, errorIndex };
};

export interface ScoreTier {
  id: ScoreTierId;
  title: string;
}

const scoreTiers: { tier: ScoreTier; reached: (percent: number) => boolean }[] = [
  { tier: { id: 'perfect', title: 'Flawless' }, reached: (p) => p >= 100 },
  { tier: { id: 'great', title: 'Ready for the internship' }, reached: (p) => p >= 75 },
  { tier: { id: 'good', title: 'A bit more practice' }, reached: (p) => p >= 50 },
  { tier: { id: 'low', title: 'Back to the basics' }, reached: (p) => p > 0 },
  { tier: { id: 'zero', title: 'Blank screen' }, reached: () => true },
];

export const tierFor = (earned: number, max: number): ScoreTier => {
  const percent = max > 0 ? (earned / max) * 100 : 0;
  return (scoreTiers.find((t) => t.reached(percent)) ?? scoreTiers[scoreTiers.length - 1]).tier;
};
