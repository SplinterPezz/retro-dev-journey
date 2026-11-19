import { isNumber, isString, listOf, shape } from './guards';

const isRow = shape<{ date: string; uniqueUsers: number }>({ date: isString, uniqueUsers: isNumber });

describe('guards', () => {
  it('accepts an object whose fields all pass, extra fields included', () => {
    expect(isRow({ date: '2026-01-01', uniqueUsers: 3, extra: true })).toBe(true);
  });

  it('rejects a missing field, a wrong type and a non-object', () => {
    expect(isRow({ date: '2026-01-01' })).toBe(false);
    expect(isRow({ date: '2026-01-01', uniqueUsers: '3' })).toBe(false);
    expect(isRow(null)).toBe(false);
    expect(isRow('row')).toBe(false);
  });

  it('checks every item of a list', () => {
    const isRows = listOf(isRow);
    expect(isRows([])).toBe(true);
    expect(isRows([{ date: 'a', uniqueUsers: 1 }])).toBe(true);
    expect(isRows([{ date: 'a', uniqueUsers: 1 }, { date: 'b' }])).toBe(false);
    expect(isRows({ length: 0 })).toBe(false);
  });
});
