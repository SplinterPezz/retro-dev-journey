// Every page URL of the app, in one place. App.tsx declares the routes with
// these, and every navigate() / <Navigate> uses them, so renaming a page is a
// one-line change and a typo is a compile error instead of a 404.
export const ROUTES = {
  home: '/',
  storyMap: '/story',
  storyDifficulty: '/story/difficulty',
  chapter: '/story/:chapterId', // route pattern; build a real link with chapterPath()
  sandbox: '/sandbox',
  login: '/login',
  admin: '/admin',
} as const;

// Link to a chapter scene, e.g. chapterPath('prologue') -> '/story/prologue'.
export const chapterPath = (chapterId: string): string => `${ROUTES.storyMap}/${chapterId}`;
