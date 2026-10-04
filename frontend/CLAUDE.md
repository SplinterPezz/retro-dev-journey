# Frontend - Retro Dev Journey

A portfolio played as a pixel-art game: **Home**, **Sandbox** (the career overworld), **Story Mode** (a story map
plus chapter scenes) and an **Admin** dashboard.

React 19 + TypeScript (strict) + Vite, Redux Toolkit with redux-persist, React Router 7, RPGUI for the pixel UI,
MUI + ApexCharts only in Admin, CodeMirror only in the Story code questions. Tests with Vitest + Testing Library.

## Commands

```
npm run start:loc   # dev server on :3000 with .env.local (often already running: reuse it)
npm run typecheck
npm run lint        # --max-warnings=0
npm test            # vitest run
npm run knip        # unused files, exports and dependencies
npm run build       # typecheck + vite build (also catches CSS syntax errors)
```

Run the checks and the browser once, **at the end of the development**, not after every edit: a piece of work
is done when `typecheck`, `lint`, `test` and `knip` pass and the screens were looked at in the three layouts (see "Desktop, phone portrait, phone landscape").
Say plainly what was verified in the browser and what was not.

CI (`.github/workflows/frontend.yml`) runs `typecheck`, `lint`, `test`, `knip` and the Vite build on every PR
and push to `main` that touches `frontend/`.

## Code structure

```
src/
  App.tsx            routes; every page but Home is a lazy chunk
  config/            ALL constants: texts, paths, ids, routes, keys, tuning values, defaults
    env.ts           the only place reading environment variables
    story/           chapters, flags, sprites, collectibles, mini games, difficulty, preload lists
  types/             shared types: game.ts (engine), story.ts, sandbox.ts, tracking.ts
  game/              engine shared by Sandbox, story map and chapters
    GameScene.tsx    viewport + camera + zoom + music + joystick + debug tools
    movement.ts, collision.ts, camera.ts, zoom.ts      pure logic, no React
    hooks/           usePlayerMovement, useCollisionDetection, useNpcPatrol
    path/            overworld path generation
  pages/             one folder per page: Home, Sandbox, Story, Login, Admin
    Story/           InteriorScene (chapter scene), StoryMapPage, routing guards,
                     sceneRules.ts / dialogue.ts (rules without React), hooks/ (one concern each)
  components/        UI pieces, one folder per component with its .tsx and .css
    Common/          used by several pages (LoadingSplash, ZoomSlider, MobileJoystick, buttons...)
    Story/           dialogue, quiz, mini games, hud, world, collectibles
    GameMenu/, FirstVisit/, Structures/, Player/, Companion/ ...
  hooks/             shared hooks (useLoadingSplash, useResourceLoader, useBackgroundMusic, useTypingSound...)
  audio/             Web Audio playback (dialogue typing tick)
  services/          backend calls through fetchFromApi (api.ts); fileService fetches the CV blob directly
  store/             slices + store.ts + migrations.ts
public/
  sprites/           all game art (see "Sprites")
  audio/             music and sound effects
  rpgui/             vendored RPGUI library: never edit it (excluded from knip)
```

Pure logic (geometry, rules, data shaping) goes in plain `.ts` modules with tests; components and hooks only
wire it to React.

## Best practices

### Componentize, reuse, no duplicates
- Split UI into small components, one responsibility each, in their own folder with their own CSS.
- Before writing something, search for an existing component, hook, util or config entry and reuse it.
- When the same markup or logic appears twice, extract it into one shared piece (as `LoadingSplash` +
  `useLoadingSplash`, `FirstVisitSetup`, `GameScene`, `QuestPanel`) and use it in both places.
- Actively look for duplicated code while working and remove it.
- Remove what you orphan (old components, CSS classes, exports) in the same change; `npm run knip` must stay clean.
- Don't export what only its own file uses. Keep it simple: no speculative options or abstractions.

### No magic numbers, no hard-coded values
- **Always** name values: no bare numbers, strings, paths or URLs in components, hooks or CSS.
- Values used by one file: a named constant at the top of that file (`const FEEDBACK_MS = 1400`).
- Values shared, tunable or content-like (texts, sprite paths, ids, routes, keys, speeds, defaults): in
  `src/config/`, imported from there.
- Derived values are computed, not pre-calculated by hand: `MEEP_OFFSET.x + MEEP_SIZE / 2`, not `82`.
- In CSS use custom properties and `calc()` instead of hand-computed pixels (see the `GameMenu.css` portrait crop
  and the `PcMonitor.css` sprite coordinates).
- Use the constants (`ROUTES`, flags, ids), never their string values.

### Constants vs environment variables
- **Constants** (`src/config/*.ts`): the same in every deployment - game tuning, texts, paths, ids, defaults.
- **Environment variables**: only what changes between deployments (API URL, environment name, third-party ids).
  - Prefixed `REACT_APP_` (Vite `envPrefix`), stored in `.env.local` / `.env.dev` / `.env.prod` (`.env.stage`
    for `start:stage` / `build:stage`), selected by the `start:*` / `build:*` scripts.
  - Read **only** in `src/config/env.ts` and exported as typed constants (`isDev`, `isProdBuild`, `apiBaseUrl`,
    `iubendaPolicyId`); the rest of the app imports from there, never from `import.meta.env`.
  - Every variable is declared in `src/vite-env.d.ts` and listed in `.env_example`.
  - They are inlined in the public bundle: never put secrets in them.
- Debug-only behaviour checks `isDev`.

### Comments: few, and only the "why"
Many comments mean the code is not readable: rename or extract instead of explaining.
- No comments on type / interface / DTO fields, constants or config values: give them a better name
  (`maxCvSizeMb`, not `maxSizeFileCV // MB`).
- No comments restating the code, no section dividers (`// ---- x ----`), no long file or component headers.
- Keep, in one line, only what the code cannot say: values saved in players' progress, browser workarounds,
  RPGUI overrides, z-index order against other layers, values kept in sync between files, the reason for an
  `eslint-disable`. An empty `catch {}` keeps a one-line comment saying why.
- Same rules in CSS.

### Style
- Match the surrounding code: naming, idioms, density. Strict TypeScript, no `any`.
- Function components and hooks; memoize the static parts of a scene so a player step does not re-render them.

## Sprites

Generate game art with the skills, don't draw it by hand in code:
- **`pixel-character`**: characters and 8-direction sprite sheets, walk cycles, reskins (clothes, hair, skin...),
  palette swaps, GIF export. For NPCs, Meep, the player.
- **`pixel-assets`**: props, furniture, food, appliances, floor and wall tiles, flags, backgrounds and skylines.
  Also to restyle, resize or extend an existing set.

Where they go and how they are named (paths are built by helpers in `config/story/sprites.ts` and
`config/assets.ts`, never written by hand):
- NPC: `public/sprites/story/npc/<name>/<name>_<pose>.gif` with poses `idle`, `walk_E`, `walk_N`, `walk_S`
  (west is `walk_E` mirrored). Only patrolling NPCs need walk poses.
- Meep: `public/sprites/story/companion/meep/meep_<N|NE|E|SE|S|SW|W|NW|idle>.gif`.
- Story props and tiles: `public/sprites/story/props/<name>.png` -> `storyProp('<name>')`.
- Story UI art: `public/sprites/story/ui/` -> `storyUi()`; collectibles: `story/collectibles/` -> `storyCollectible()`.
- Overworld: `public/sprites/buildings`, `statues`, `signpost`, `terrain`, `trees`, `details`, `player`.

A new sprite must also be added to its scene's preload list (`chapterAssets`, `storyMapAssets`, Sandbox
`requiredImages`).

## Hitboxes

- A prop's or NPC's `collisionHitbox` covers its **visible body**, not only its base: for a desk the tabletop,
  roughly the upper 60-70% of the sprite. Otherwise the player visually walks onto the table. When the player
  still overlaps it, raise the box a few pixels at a time until it blocks on the tabletop.
- Props standing against a wall (server rack, water dispenser) keep the upper ~65% box: do not stretch it down
  to the floor.
- Always check with the development overlay (`REACT_APP_ENV=development`, red boxes drawn by `SceneDebug` /
  `DebugOverlay`), take a screenshot and describe what it shows - not just the numbers.

## Adding a Story chapter

Use `config/story/prologue.ts` (standalone map) or `eikony.ts` (a building on the overworld) as the model.

1. **Id**: add it to `CHAPTER_IDS` in `config/ids.ts` (saved in progress: final from the first release).
2. **Flags**: a `<CHAPTER>_FLAGS` object in `config/story/flags.ts`; the config refers to flags only through it.
3. **Config**: `config/story/<chapter>.ts` exporting a `StoryChapterConfig` - world, props, NPCs, dialogues,
   quizzes, mini games, objectives, `completion.requiredFlags`, outro. Texts in English.
4. **Order**: a row in `storyChapterOrder` (`config/story/chapters.ts`), with `companyId` if it is entered from a
   building of `config/career.ts`, and `endFlag` if it has a closing scene.
5. **Route**: add the config to the map in `pages/Story/ChapterRoute.tsx`.
6. **Art**: NPCs with `pixel-character`, props and floor with `pixel-assets`, in the folders of "Sprites".
   `chapterAssets()` preloads everything the config lists - an image used outside the config must be added there.
7. **Hitboxes** for every prop and NPC, checked with the debug overlay (see "Hitboxes").
8. **Typing voices** for new speakers in `config/typingVoices.ts`.
9. **Collectibles**, if any: an entry in `chapterCollectibles` (`config/story/collectibles.ts`).
10. **Music**: the track in `public/audio`, set as `audioTrack`.
11. **Technologies** unlocked by the chapter: `storyChapter` on the technology in `config/career.ts` - its statue
    appears on the map once the chapter is finished.
12. **Ready**: remove `inDevelopment` from its `storyChapterOrder` row.

Then play it through with the debug buttons, in the three layouts.

## Rules that are easy to break

### Saved data
- Story flag values (`config/story/flags.ts`) and ids (`config/ids.ts`) are saved in players' progress and in
  tracking: **never change a value**, rename the key instead.
- Changing the shape of a persisted slice needs a migration in `store/migrations.ts` (bump `PERSIST_VERSION`).
  New fields read from older saves need a default (see `selectDialogueSound`).

### Loading screens
- Every scene uses `LoadingSplash` + `useLoadingSplash`: black screen, title in the middle, `x/y Loading` and the
  spinner bottom-right, fade out.
- Loading is **real**: no minimum duration, no simulated progress. The splash fades out as soon as the listed
  sprites are loaded (15s cap only for a broken network).
- Preload exactly what the scene draws. The player cannot move, and HUD or popups that would sit on top
  (minimap, unlock popup) wait until the splash is gone.

### Sound
- Music and dialogue sound live in `settingsSlice`, shared by every page and persisted; both start muted.
- The one-time "Do you want sound?" choice (and the orientation choice on phones) is asked by `FirstVisitSetup`
  before the first game, Story or Sandbox.
- When the browser blocks autoplay, `useBackgroundMusic` switches the music to muted on purpose: keep it.
- Dialogue sound is a sampled typing tick, not TTS; per-speaker pitch / rhythm / muffle in
  `config/typingVoices.ts`, kept subtle.

### Routing
- Story map and chapters are behind `RequireDifficulty`: without a difficulty their URL goes to the choice first.

## RPGUI gotchas

- `.rpgui-container` is `position: fixed` with no insets (framed-golden does not reset it): inside a wrapper it
  needs `position: relative !important`, or it escapes the layout and flex centering.
- Inside `.rpgui-content` RPGUI paints every `p` and `span` white with a heavy outline, and sets its font on every
  element (`.rpgui-content *`): scope your selector to win, or set the colour / font directly.
- Golden buttons: their end caps stick out of the box and are laid out from RPGUI's own padding and display -
  don't override those. RPGUI buttons have a 140px minimum width. The label's vertical place comes from the
  golden button rule in `index.css`.
- RPGUI gives every `li` a 20px left margin: a grid or list built on `ul`/`li` must reset it, or it drifts
  right and overflows.
- Images from `public/` are not written as `url()` in a `.css` file: pass them from the TSX as a CSS variable
  (`--sparkle-image` in `QuizMarker` / `BobbingProp` / `CollectibleItem`).

## Desktop, phone portrait, phone landscape

Every screen exists in **three layouts**, and a new screen is designed for all three from the start, not
patched afterwards:
- **Desktop**.
- **Phone portrait**: the `max-width` breakpoints of each file (480px / 768px); content stacks, touch-sized buttons.
- **Phone landscape**: `@media (orientation: landscape) and (max-height: 500px)`, the same query everywhere.
  Very little height: compact the layout (side by side instead of stacked, smaller art, tighter spacing),
  never let a box be taller than the screen.

Also:
- Things the player touches on phones (joystick, menu button, screen buttons, iubenda button in the corner)
  must not cover each other or the new UI.
- The orientation can be forced: `ScreenRotation.css` turns the whole app when the screen lock is not available,
  so size things from the real viewport (`useLogicalViewport`), not from raw `vh/vw`.

Test the three layouts **once, at the end of the development** (Chrome DevTools device mode, or the browser
tools): not after every change. Same for browser automation (Playwright / Chrome) - one pass at the end.
**Before that pass, ask the user** whether they already tested it themselves or want you to do it.

## Tests

- Write the tests with the feature, run the suite **at the end of the development**, not after every edit
  (a quick `typecheck` while working is fine).
- New logic gets a Vitest test next to its file (`*.test.ts` / `*.test.tsx`), e.g. `RequireDifficulty.test.tsx`,
  `settingsSlice.test.ts`, `FirstVisitSetup.test.tsx`, `dialogue.test.ts`.
- Test pure modules directly; test components with Testing Library and a real store
  (`configureStore` with the slices they need) rather than mocks.

## Bundle

- Only Home is in the main bundle; every other page is a lazy chunk (`App.tsx`).
- Heavy libraries stay in lazy chunks: MUI and ApexCharts only in Admin, CodeMirror only through
  `LazyCodeFixEditor`. Never import them from Home, `Common/` or other shared code.

## Debug tools

- Development builds only (`REACT_APP_ENV=development`, `npm run start:loc`).
- `DebugToolbar` (bottom left): **Complete Chapter**, **Reset Chapter**, **Reset story** in a chapter, **Reset story**
  on the map. Use them to reach a scene without replaying the chapter (e.g. the prologue -> map transition).
- The hitbox overlay draws collision boxes, walk-up radii, collectible spots and the player's position.
- `devLog` / `devError` (`config/env.ts`) instead of `console.log`.

## Dependencies to keep up to date

Check monthly with `npm outdated`. Minor and patch updates together; one major at a time, each followed by
`typecheck`, `lint`, `test`, `knip` and `build`, and a look at the game in the browser.

- **Core**: `react`, `react-dom`, `react-router`, `@reduxjs/toolkit`, `react-redux`, `redux-persist`.
- **Tooling**: `vite`, `@vitejs/plugin-react`, `typescript`, `vitest`, `jsdom`, `eslint`, `typescript-eslint`,
  `eslint-plugin-react-hooks`, `knip`, `@testing-library/*`.
- **UI**: `lucide-react`, `bootstrap`, `react-joystick-component`.
- **Admin / editor** (lazy chunks): `@mui/material`, `@mui/x-date-pickers`, `apexcharts`, `react-apexcharts`,
  `@uiw/react-codemirror`, `@codemirror/lang-java`.

Node must match `engines` in `package.json` (>= 22.13). Majors pending as of 2026-10: MUI 9, apexcharts 7,
react-apexcharts 2, lucide-react 1, TypeScript 7, env-cmd 11, jest-dom 7.

## Working with the user

- Before any browser test (screenshots, automation, device mode), ask whether the user has already tested it or
  wants you to. When you do test, use a tab of your own, never the one the user is playing in, and close it after.

- For audio, visuals or anything subjective, make a quick sample first (WAV, screenshot) and integrate only once
  the user has picked one.
- Ask before big or sweeping changes; when interrupted, stop and wait.
- Never change the user's saved browser state (localStorage) to test something; use unit tests or ask.
- Give a commit message only when asked, once, covering everything not yet committed - never append one to
  every reply. A subject line plus 3-5 short bullets: not one line, not a page.
- **No `Co-Authored-By: Claude` line** in commit messages, and no "Generated with Claude Code" in PRs.
- Never add or inflate credits about Claude in the README or docs: describe the project, not who built it.
