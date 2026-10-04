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
import { API_ENDPOINTS } from '../config/apiEndpoints';

// GET <endpoint>?start_date=...&end_date=...
const getAnalytics = <T>(endpoint: string, dateFilter?: DateRangeFilter): Promise<T | ApiError> => {
  const params = new URLSearchParams();
  if (dateFilter?.start_date) params.append('start_date', dateFilter.start_date);
  if (dateFilter?.end_date) params.append('end_date', dateFilter.end_date);
  const query = params.toString();
  return fetchFromApi<T>(`${endpoint}${query ? `?${query}` : ''}`, { method: 'GET' });
};

export const getDailyUniqueUsers = (f?: DateRangeFilter) => getAnalytics<DailyUsersResponse>(API_ENDPOINTS.analytics.dailyUsers, f);
export const getPageTimeStats = (f?: DateRangeFilter) => getAnalytics<PageTimeResponse>(API_ENDPOINTS.analytics.pageTime, f);
export const getDownloadStats = (f?: DateRangeFilter) => getAnalytics<DownloadsResponse>(API_ENDPOINTS.analytics.downloads, f);
export const getInteractionStats = (f?: DateRangeFilter) => getAnalytics<InteractionsResponse>(API_ENDPOINTS.analytics.interactions, f);
export const getDeviceStats = (f?: DateRangeFilter) => getAnalytics<DevicesResponse>(API_ENDPOINTS.analytics.devices, f);
export const getBrowserStats = (f?: DateRangeFilter) => getAnalytics<BrowsersResponse>(API_ENDPOINTS.analytics.browsers, f);
