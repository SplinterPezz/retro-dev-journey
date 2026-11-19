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

// the backend (Go) sends an empty list as null
export interface StatsResponse<Row> {
  data: Row[] | null;
}
