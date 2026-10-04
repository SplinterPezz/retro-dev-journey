// Every backend endpoint the frontend calls, relative to apiBaseUrl.

export const API_ENDPOINTS = {
  login: '/login',
  trackingInfo: '/info', // usage tracking; deliberately not "/track" or "/trk", which ad blockers drop
  cvDownload: '/cv/download',
  cvUpload: '/cv/upload',
  analytics: {
    dailyUsers: '/analytics/daily-users',
    pageTime: '/analytics/page-time',
    downloads: '/analytics/downloads',
    interactions: '/analytics/interactions',
    devices: '/analytics/devices',
    browsers: '/analytics/browsers',
  },
} as const;

// Called without the auth token.
export const PUBLIC_ENDPOINTS: readonly string[] = [API_ENDPOINTS.login, API_ENDPOINTS.trackingInfo, API_ENDPOINTS.cvDownload];
