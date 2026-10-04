import { buildLog, commitCountByDifficulty, commitRounds, tierFor } from './miniGames';

describe('mini games', () => {
  it('picks the score band from the share of points', () => {
    expect(tierFor(1200, 1200).id).toBe('perfect');
    expect(tierFor(900, 1200).id).toBe('great');
    expect(tierFor(600, 1200).id).toBe('good');
    expect(tierFor(100, 1200).id).toBe('low');
    expect(tierFor(0, 1200).id).toBe('zero');
  });

  it('puts a different error in each log round', () => {
    const first = buildLog('senior', 0);
    const second = buildLog('senior', 1);
    expect(first.lines).toHaveLength(20);
    expect(second.lines).toHaveLength(20);
    expect(first.lines[first.errorIndex]).toMatch(/^E\//);
    expect(second.lines[second.errorIndex]).toMatch(/^E\//);
    expect(second.lines[second.errorIndex]).not.toBe(first.lines[first.errorIndex]);
  });

  it('keeps the breaking commit among the ones shown on Junior', () => {
    for (const round of commitRounds) {
      expect(round.options.slice(0, commitCountByDifficulty.junior).some((c) => c.breaks)).toBe(true);
    }
  });
});
