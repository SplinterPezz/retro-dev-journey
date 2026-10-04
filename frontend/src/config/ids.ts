// The values are saved (progress by chapter id) and tracked (interactions by
// company id): never change one. No imports, so any chunk can use this file.

export const CHAPTER_IDS = {
  prologue: 'prologue',
  eikony: 'eikony',
  unipa: 'unipa',
  alessi: 'alessi',
  codesour: 'codesour',
} as const;

export const COMPANY_IDS = {
  eikony: 'eikony',
  unipa: 'unipa',
  foryouviaggi: 'foryouviaggi',
  alessi: 'alessi',
  codesour: 'codesour',
  futureOpportunity: '???',
} as const;
