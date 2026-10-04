export const ROUTES = {
  home: '/',
  storyMap: '/story',
  storyDifficulty: '/story/difficulty',
  chapter: '/story/:chapterId', // route pattern; build a real link with chapterPath()
  sandbox: '/sandbox',
  login: '/login',
  admin: '/admin',
} as const;

export const chapterPath = (chapterId: string): string => `${ROUTES.storyMap}/${chapterId}`;
