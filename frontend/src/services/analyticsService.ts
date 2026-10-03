import { fetchFromApi } from './api';
import {
  DateRangeFilter,
  DailyUsersResponse,
  PageTimeResponse,
  DownloadsResponse,
  InteractionsResponse,
  DevicesResponse,
  BrowsersResponse,
} from '../types/analytics';
import { ApiError } from '../types/api';

// GET /analytics/<path>?start_date=...&end_date=...
const getAnalytics = <T>(path: string, dateFilter?: DateRangeFilter): Promise<T | ApiError> => {
  const params = new URLSearchParams();
  if (dateFilter?.start_date) params.append('start_date', dateFilter.start_date);
  if (dateFilter?.end_date) params.append('end_date', dateFilter.end_date);
  const query = params.toString();
  return fetchFromApi<T>(`/analytics/${path}${query ? `?${query}` : ''}`, { method: 'GET' });
};

export const getDailyUniqueUsers = (f?: DateRangeFilter) => getAnalytics<DailyUsersResponse>('daily-users', f);
export const getPageTimeStats = (f?: DateRangeFilter) => getAnalytics<PageTimeResponse>('page-time', f);
export const getDownloadStats = (f?: DateRangeFilter) => getAnalytics<DownloadsResponse>('downloads', f);
export const getInteractionStats = (f?: DateRangeFilter) => getAnalytics<InteractionsResponse>('interactions', f);
export const getDeviceStats = (f?: DateRangeFilter) => getAnalytics<DevicesResponse>('devices', f);
export const getBrowserStats = (f?: DateRangeFilter) => getAnalytics<BrowsersResponse>('browsers', f);
