// Chapter order for Story Mode. `companyId` maps a chapter onto a building
// already positioned in config/career.ts's `companies` array, so it shows
// up on the shared overworld map; omit it for a chapter that plays on its
// own standalone map instead (the Prologue has no employer yet, so there's
// no building for it in the world).
export interface ChapterMeta {
  id: string;
  companyId?: string;
  // Flag set when the chapter's last scene is over. Until then the map sends
  // the player back to it, even if a save made under older rules already
  // unlocked the next chapter. Kept here so the map does not load the chapter config.
  endFlag?: string;
}

export const storyChapterOrder: ChapterMeta[] = [
  { id: 'prologue', endFlag: 'prologueEnded' }, // the outro's endFlag in prologue.ts
  { id: 'eikony', companyId: 'eikony' },
];

export const getChapterIndex = (chapterId: string): number =>
  storyChapterOrder.findIndex((c) => c.id === chapterId);
