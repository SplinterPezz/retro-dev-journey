import { DeviceInfo } from '../types/tracking';


// Generate a deterministic UUID based on user agent
export const generateUUIDFromUserAgent = (): string => {
  const userAgent = navigator.userAgent;
  const screen = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  
  const combined = `${userAgent}-${screen}-${timezone}`;
  let hash = 0;
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hashStr.slice(0, 8)}-${hashStr.slice(0, 4)}-4${hashStr.slice(1, 4)}-${hashStr.slice(0, 4)}-${hashStr.slice(0, 12)}`;
};

export const getDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent.toLowerCase();
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  
  // Determine device type
  const device: 'desktop' | 'mobile' = screenWidth <= 768 || 
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) 
    ? 'mobile' : 'desktop';
  
  // Screen resolution
  const screenResolution = `${screenWidth}x${screenHeight}`;
  
  // Detect browser
  let browser = 'unknown';
  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    browser = 'chrome';
  } else if (userAgent.includes('firefox')) {
    browser = 'firefox';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    browser = 'safari';
  } else if (userAgent.includes('edg')) {
    browser = 'edge';
  } else if (userAgent.includes('opera') || userAgent.includes('opr')) {
    browser = 'opera';
  }
  
  // Detect OS
  let os = 'unknown';
  if (userAgent.includes('windows')) {
    os = 'windows';
  } else if (userAgent.includes('mac')) {
    os = 'macos';
  } else if (userAgent.includes('linux')) {
    os = 'linux';
  } else if (userAgent.includes('android')) {
    os = 'android';
  } else if (userAgent.includes('ios') || userAgent.includes('iphone') || userAgent.includes('ipad')) {
    os = 'ios';
  }
  
  return {
    device,
    screenResolution,
    browser,
    os
  };
};

export const createInteractionKey = (page: string, type: string, info: string, date: string): string => {
  return `${page}-${type}-${info}-${date}`;
};