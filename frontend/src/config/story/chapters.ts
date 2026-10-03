// Chapter order for Story Mode. `companyId` maps a chapter onto a building
// already positioned in config/career.ts's `companies` array, so it shows
// up on the shared overworld map; omit it for a chapter that plays on its
// own standalone map instead (the Prologue has no employer yet, so there's
// no building for it in the world).
export interface ChapterMeta {
  id: string;
  companyId?: string;
}

export const storyChapterOrder: ChapterMeta[] = [
  { id: 'prologue' },
  { id: 'eikony', companyId: 'eikony' },
];

export const getChapterIndex = (chapterId: string): number =>
  storyChapterOrder.findIndex((c) => c.id === chapterId);
