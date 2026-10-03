import { toSeriesByPage } from './series';

describe('toSeriesByPage', () => {
  it('builds one series per page over every date, filling gaps with 0', () => {
    const rows = [
      { date: '2026-01-02', page: 'sandbox', downloads: 3 },
      { date: '2026-01-01', page: 'homepage', downloads: 1 },
      { date: '2026-01-02', page: 'homepage', downloads: 2 },
    ];
    const { categories, series } = toSeriesByPage(rows, (r) => r.downloads);
    expect(categories).toEqual(['Jan 01', 'Jan 02']);
    expect(series).toEqual([
      { name: 'Sandbox', data: [0, 3] },
      { name: 'Homepage', data: [1, 2] },
    ]);
  });
});
