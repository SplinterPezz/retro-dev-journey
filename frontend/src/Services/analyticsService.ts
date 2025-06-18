import { fetchFromApi } from '../Utils/apiService';
import { 
  DateRangeFilter, 
  DailyUsersResponse, 
  PageTimeResponse, 
  DownloadsResponse, 
  InteractionsResponse, 
  DevicesResponse, 
  BrowsersResponse 
} from '../types/analytics';

import { ApiError } from '../types/api';

export async function getDailyUniqueUsers(dateFilter?: DateRangeFilter): Promise<DailyUsersResponse | ApiError> {
  const params = new URLSearchParams();
  if (dateFilter?.start_date) params.append('start_date', dateFilter.start_date);
  if (dateFilter?.end_date) params.append('end_date', dateFilter.end_date);
  
  const queryString = params.toString();
  const endpoint = queryString ? `/analytics/daily-users?${queryString}` : '/analytics/daily-users';

  const response = await fetchFromApi<DailyUsersResponse | ApiError>(endpoint, {
    method: 'GET',
  });
  
  if (response) {
    return response as DailyUsersResponse;
  }
  return response as ApiError;
}

export async function getPageTimeStats(dateFilter?: DateRangeFilter): Promise<PageTimeResponse | ApiError> {
  const params = new URLSearchParams();
  if (dateFilter?.start_date) params.append('start_date', dateFilter.start_date);
  if (dateFilter?.end_date) params.append('end_date', dateFilter.end_date);
  
  const queryString = params.toString();
  const endpoint = queryString ? `/analytics/page-time?${queryString}` : '/analytics/page-time';

  const response = await fetchFromApi<PageTimeResponse | ApiError>(endpoint, {
    method: 'GET',
  });
  
  if (response) {
    return response as PageTimeResponse;
  }
  return response as ApiError;
}

export async function getDownloadStats(dateFilter?: DateRangeFilter): Promise<DownloadsResponse | ApiError> {
  const params = new URLSearchParams();
  if (dateFilter?.start_date) params.append('start_date', dateFilter.start_date);
  if (dateFilter?.end_date) params.append('end_date', dateFilter.end_date);
  
  const queryString = params.toString();
  const endpoint = queryString ? `/analytics/downloads?${queryString}` : '/analytics/downloads';

  const response = await fetchFromApi<DownloadsResponse | ApiError>(endpoint, {
    method: 'GET',
  });
  
  if (response) {
    return response as DownloadsResponse;
  }
  return response as ApiError;
}

export async function getInteractionStats(dateFilter?: DateRangeFilter): Promise<InteractionsResponse | ApiError> {
  const params = new URLSearchParams();
  if (dateFilter?.start_date) params.append('start_date', dateFilter.start_date);
  if (dateFilter?.end_date) params.append('end_date', dateFilter.end_date);
  
  const queryString = params.toString();
  const endpoint = queryString ? `/analytics/interactions?${queryString}` : '/analytics/interactions';

  const response = await fetchFromApi<InteractionsResponse | ApiError>(endpoint, {
    method: 'GET',
  });
  
  if (response) {
    return response as InteractionsResponse;
  }
  return response as ApiError;
}

export async function getDeviceStats(dateFilter?: DateRangeFilter): Promise<DevicesResponse | ApiError> {
  const params = new URLSearchParams();
  if (dateFilter?.start_date) params.append('start_date', dateFilter.start_date);
  if (dateFilter?.end_date) params.append('end_date', dateFilter.end_date);
  
  const queryString = params.toString();
  const endpoint = queryString ? `/analytics/devices?${queryString}` : '/analytics/devices';

  const response = await fetchFromApi<DevicesResponse | ApiError>(endpoint, {
    method: 'GET',
  });
  
  if (response) {
    return response as DevicesResponse;
  }
  return response as ApiError;
}

export async function getBrowserStats(dateFilter?: DateRangeFilter): Promise<BrowsersResponse | ApiError> {
  const params = new URLSearchParams();
  if (dateFilter?.start_date) params.append('start_date', dateFilter.start_date);
  if (dateFilter?.end_date) params.append('end_date', dateFilter.end_date);
  
  const queryString = params.toString();
  const endpoint = queryString ? `/analytics/browsers?${queryString}` : '/analytics/browsers';

  const response = await fetchFromApi<BrowsersResponse | ApiError>(endpoint, {
    method: 'GET',
  });
  
  if (response) {
    return response as BrowsersResponse;
  }
  return response as ApiError;
}