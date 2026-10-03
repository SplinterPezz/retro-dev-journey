import { StoryDifficulty } from '../../types/story';

// End-of-day mini games, played at the laptop. Each correct answer is worth
// BASE_POINTS times the difficulty multiplier, so the same play on Senior
// scores more than on Junior.
export const BASE_POINTS = 100;

export const difficultyMultiplier: Record<StoryDifficulty, number> = {
  junior: 1,
  middle: 1.5,
  senior: 2,
};

// ---- 1. Fix the build: edit the snippet until it matches the expected code ----

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

// Snippets used per difficulty.
export const fixBuildCountByDifficulty: Record<StoryDifficulty, number> = {
  junior: 3,
  middle: 4,
  senior: 5,
};

// ---- 2. Which commit broke everything? ----

export interface CommitOption {
  hash: string;
  message: string;
  breaks: boolean;
}

// Senior gets all of them; the breaking commit is the one that removes a guard.
export const commitOptions: CommitOption[] = [
  { hash: 'a1f3c9e', message: 'Add login screen', breaks: false },
  { hash: 'b72d0a4', message: 'Fix typo in footer', breaks: false },
  { hash: 'c9e15bb', message: 'Simplify date formatter: drop the null check', breaks: true },
  { hash: 'd04a7f1', message: 'Update README badges', breaks: false },
  { hash: 'e88b26c', message: 'Tweak hitbox of desk 7', breaks: false },
];

export const commitCountByDifficulty: Record<StoryDifficulty, number> = {
  junior: 3,
  middle: 4,
  senior: 5,
};

// ---- 4. Find the error in the log ----

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

export const logErrorLine = 'E/AndroidRuntime: FATAL EXCEPTION: main java.lang.NullPointerException';

// Total lines and where the error sits, per difficulty. Middle and Senior add
// warnings, which look like the error and make it harder to spot.
export const logShapeByDifficulty: Record<StoryDifficulty, { lines: number; warnings: number }> = {
  junior: { lines: 6, warnings: 0 },
  middle: { lines: 12, warnings: 3 },
  senior: { lines: 20, warnings: 4 },
};

export const buildLog = (difficulty: StoryDifficulty): { lines: string[]; errorIndex: number } => {
  const { lines, warnings } = logShapeByDifficulty[difficulty];
  const info = logInfoLines.slice(0, lines - warnings - 1);
  const noise = logWarningLines.slice(0, warnings);
  const body = [...info, ...noise];
  const errorIndex = Math.floor(body.length / 2);
  body.splice(errorIndex, 0, logErrorLine);
  return { lines: body, errorIndex };
};

// ---- Score tiers and the lines of Francesco and Manuel ----

export interface ScoreTier {
  minPercent: number;
  title: string;
  francesco: string;
  manuel: string;
}

export const scoreTiers: ScoreTier[] = [
  {
    minPercent: 80,
    title: 'Ready for the internship',
    francesco: 'Ok, but if you know it this well, why are you still sitting next to me?',
    manuel: "I saw your screen. Go easy, leave a few bugs for the rest of us.",
  },
  {
    minPercent: 50,
    title: 'A bit more practice',
    francesco: "Not bad. A little more practice and you'll be fine.",
    manuel: "About where I was on my first build. We're all still learning.",
  },
  {
    minPercent: 0,
    title: 'Back to the basics',
    francesco: 'The teacher just asked who wants to get the coffee. Could be you.',
    manuel: "See you at the next build, captain. Bring snacks.",
  },
];

export const tierFor = (percent: number): ScoreTier =>
  scoreTiers.find((t) => percent >= t.minPercent) ?? scoreTiers[scoreTiers.length - 1];

// Mistakes allowed per game before it restarts (null = unlimited). Same rule as
// the quiz: Junior is forgiving, Middle and Senior are strict.
export const miniGameMistakesByDifficulty: Record<StoryDifficulty, number | null> = {
  junior: null,
  middle: 2,
  senior: 1,
};
