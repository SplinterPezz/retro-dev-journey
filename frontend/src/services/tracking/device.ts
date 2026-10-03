import { DeviceInfo, DeviceType, PageType, ViewType } from '../../types/tracking';

// Random per-browser id, created only after consent and kept in the persisted
// store. Not derived from the device, so two identical phones are two users
// and nothing is fingerprinted.
export const generateVisitorId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Old browsers without randomUUID: RFC 4122 v4 from getRandomValues.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const MOBILE_UA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|windows phone|mobile/i;

// Phones and tablets: a mobile user agent, or a touch screen that is small.
// The one place that decides it, for the UI and for the analytics.
export const isMobileDevice = (
  userAgent: string = navigator.userAgent,
  viewportWidth: number = window.innerWidth,
  isTouch: boolean = 'ontouchstart' in window || navigator.maxTouchPoints > 0
): boolean => MOBILE_UA.test(userAgent) || (isTouch && viewportWidth <= 768);

// Order matters: Edge and Opera also say "chrome", Chrome also says "safari".
export const detectBrowser = (userAgent: string): string => {
  const ua = userAgent.toLowerCase();
  if (ua.includes('edg')) return 'edge';
  if (ua.includes('opr') || ua.includes('opera')) return 'opera';
  if (ua.includes('firefox') || ua.includes('fxios')) return 'firefox';
  if (ua.includes('chrome') || ua.includes('crios')) return 'chrome';
  if (ua.includes('safari')) return 'safari';
  return 'unknown';
};

// Order matters: an iPhone says "like Mac OS X", Android says "Linux".
export const detectOs = (userAgent: string, maxTouchPoints = 0): string => {
  const ua = userAgent.toLowerCase();
  if (ua.includes('android')) return 'android';
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  // iPadOS 13+ asks for the desktop site and reports itself as a Mac.
  if (ua.includes('macintosh') && maxTouchPoints > 1) return 'ios';
  if (ua.includes('windows')) return 'windows';
  if (ua.includes('mac os') || ua.includes('macintosh')) return 'macos';
  if (ua.includes('cros')) return 'chromeos';
  if (ua.includes('linux')) return 'linux';
  return 'unknown';
};

export const getDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent;
  const os = detectOs(userAgent, navigator.maxTouchPoints);
  const device: DeviceType =
    os === 'ios' || os === 'android' || isMobileDevice(userAgent, window.screen.width) ? 'mobile' : 'desktop';
  return {
    device,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    browser: detectBrowser(userAgent),
    os,
  };
};

export const createInteractionKey = (page: PageType, type: ViewType, info: string, date: string): string =>
  `${page}-${type}-${info}-${date}`;
