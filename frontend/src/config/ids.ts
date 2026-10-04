// Ids that tie one config to another: a company building to its story
// chapter, a technology statue to the chapter that unlocks it. Every config
// and component refers to them through these constants.
//
// The values are saved (story progress is keyed by chapter id) and tracked
// (interactions are logged by company id): never change a value.
//
// No imports on purpose: tiny, so any chunk (the admin page too) can use it.

/** Story Mode chapters, written or planned. */
export const CHAPTER_IDS = {
  prologue: 'prologue',
  eikony: 'eikony',
  unipa: 'unipa',
  alessi: 'alessi',
  codesour: 'codesour',
} as const;

/** The company buildings of config/career.ts. */
export const COMPANY_IDS = {
  eikony: 'eikony',
  unipa: 'unipa',
  foryouviaggi: 'foryouviaggi',
  alessi: 'alessi',
  codesour: 'codesour',
  /** The "???" teaser building: the next job, not a chapter. The path leads to it and its label invites to get in touch. */
  futureOpportunity: '???',
} as const;
