import { CHAPTER_IDS } from '../ids';
import { chapterDisplayName, companyDisplayName } from './chapters';

describe('chapterDisplayName', () => {
  it('uses the chapter name for a chapter without a building', () => {
    expect(chapterDisplayName(CHAPTER_IDS.prologue)).toBe('Prologue');
  });

  it("uses the company name, without the country, for a chapter with a building", () => {
    expect(chapterDisplayName(CHAPTER_IDS.eikony)).toBe('Eikony');
    expect(companyDisplayName('Eikony (IT)')).toBe('Eikony');
  });

  it('falls back to the id for an unknown chapter', () => {
    expect(chapterDisplayName('nowhere')).toBe('nowhere');
  });
});
