import dayjs from 'dayjs';

// Turns analytics rows into ApexCharts series.

export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
export const dayLabel = (date: string) => dayjs(date).format('MMM DD');

// One line per page over every date in the data (0 where a page has no entry).
export const toSeriesByPage = <T extends { date: string; page: string }>(rows: T[], valueOf: (row: T) => number) => {
  const dates = [...new Set(rows.map((r) => r.date))].sort();
  const pages = [...new Set(rows.map((r) => r.page))];
  return {
    categories: dates.map(dayLabel),
    series: pages.map((page) => ({
      name: capitalize(page),
      data: dates.map((date) => {
        const row = rows.find((r) => r.page === page && r.date === date);
        return row ? valueOf(row) : 0;
      }),
    })),
  };
};
