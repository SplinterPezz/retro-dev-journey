import { fetchFromApi } from './api';
import { Guard, isNumber, isString, listOf, shape } from './guards';
import {
  BrowserStats,
  DailyUserStats,
  DateRangeFilter,
  DeviceStats,
  DownloadStats,
  InteractionStats,
  PageTimeStats,
  StatsResponse,
} from '../types/analytics';
import { ApiError } from '../types/api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// the row shapes mirror backend/internal/models/models.go
const statsOf = <Row,>(isRow: Guard<Row>): Guard<StatsResponse<Row>> => {
  const isRows = listOf(isRow);
  return shape<StatsResponse<Row>>({ data: (value): value is Row[] | null => value === null || isRows(value) });
};

const getAnalytics = <Row,>(endpoint: string, isRow: Guard<Row>) => {
  const isStats = statsOf(isRow);
  return (dateFilter?: DateRangeFilter): Promise<StatsResponse<Row> | ApiError> => {
    const params = new URLSearchParams();
    if (dateFilter?.start_date) params.append('start_date', dateFilter.start_date);
    if (dateFilter?.end_date) params.append('end_date', dateFilter.end_date);
    const query = params.toString();
    return fetchFromApi(`${endpoint}${query ? `?${query}` : ''}`, { method: 'GET' }, isStats);
  };
};

export const getDailyUniqueUsers = getAnalytics(
  API_ENDPOINTS.analytics.dailyUsers,
  shape<DailyUserStats>({ date: isString, uniqueUsers: isNumber })
);
export const getPageTimeStats = getAnalytics(
  API_ENDPOINTS.analytics.pageTime,
  shape<PageTimeStats>({ date: isString, page: isString, averageTime: isNumber, uniqueUsers: isNumber })
);
export const getDownloadStats = getAnalytics(
  API_ENDPOINTS.analytics.downloads,
  shape<DownloadStats>({ date: isString, page: isString, downloads: isNumber })
);
export const getInteractionStats = getAnalytics(
  API_ENDPOINTS.analytics.interactions,
  shape<InteractionStats>({ info: isString, count: isNumber })
);
export const getDeviceStats = getAnalytics(
  API_ENDPOINTS.analytics.devices,
  shape<DeviceStats>({ device: isString, count: isNumber })
);
export const getBrowserStats = getAnalytics(
  API_ENDPOINTS.analytics.browsers,
  shape<BrowserStats>({ browser: isString, count: isNumber })
);
