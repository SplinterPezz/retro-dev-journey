export interface DateRangeFilter {
  start_date?: string;
  end_date?: string;
}

export interface DailyUserStats {
  date: string;
  uniqueUsers: number;
}

export interface PageTimeStats {
  date: string;
  page: string;
  averageTime: number;
  uniqueUsers: number;
}

export interface DownloadStats {
  date: string;
  page: string;
  downloads: number;
}

export interface InteractionStats {
  info: string;
  count: number;
}

export interface DeviceStats {
  device: string;
  count: number;
}

export interface BrowserStats {
  browser: string;
  count: number;
}

// API Response interfaces
export interface DailyUsersResponse {
  data: DailyUserStats[];
  start_date: string;
  end_date: string;
  total_days: number;
}

export interface PageTimeResponse {
  data: PageTimeStats[];
  start_date: string;
  end_date: string;
  total_records: number;
}

export interface DownloadsResponse {
  data: DownloadStats[];
  start_date: string;
  end_date: string;
  total_downloads: number;
}

export interface InteractionsResponse {
  data: InteractionStats[];
  start_date: string;
  end_date: string;
  total_interactions: number;
}

export interface DevicesResponse {
  data: DeviceStats[];
  start_date: string;
  end_date: string;
  total_users: number;
}

export interface BrowsersResponse {
  data: BrowserStats[];
  start_date: string;
  end_date: string;
  total_users: number;
}