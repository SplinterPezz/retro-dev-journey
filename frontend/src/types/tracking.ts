export type PageType = 'homepage' | 'sandbox' | 'story';
export type ViewType = 'view' | 'interaction';
export type DeviceType = 'desktop' | 'mobile';

export const timeTrackingIntervals = [0, 30, 60, 120, 300, 600] as const;
export type TimeTrackingIntervals = typeof timeTrackingIntervals[number];

export interface TrkData {
  date: Date;
  uuid: string;
  type: ViewType;
  info?: string;
  time?: number;

  page: PageType;
  device: DeviceType;

  screenResolution?: string;
  browser?: string;
  os?: string;
}

export interface UserTrackingState {
  uuid: string;
  interactions: string[];
}

export interface DeviceInfo {
  device: DeviceType;
  screenResolution: string;
  browser: string;
  os: string;
}