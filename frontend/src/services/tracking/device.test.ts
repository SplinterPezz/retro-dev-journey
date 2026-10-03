import { detectBrowser, detectOs, generateVisitorId, isMobileDevice } from './device';

const UA = {
  iphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  android:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
  mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  windowsEdge:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
  linuxFirefox: 'Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0',
  iphoneChrome:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.6367.88 Mobile/15E148 Safari/604.1',
};

describe('detectOs', () => {
  it('does not mistake iPhones for macOS or Android for Linux', () => {
    expect(detectOs(UA.iphone)).toBe('ios');
    expect(detectOs(UA.android)).toBe('android');
  });

  it('detects desktops', () => {
    expect(detectOs(UA.mac)).toBe('macos');
    expect(detectOs(UA.windowsEdge)).toBe('windows');
    expect(detectOs(UA.linuxFirefox)).toBe('linux');
  });

  it('treats a touch "Mac" as an iPad', () => {
    expect(detectOs(UA.mac, 5)).toBe('ios');
  });
});

describe('detectBrowser', () => {
  it('tells apart browsers that share tokens', () => {
    expect(detectBrowser(UA.windowsEdge)).toBe('edge');
    expect(detectBrowser(UA.android)).toBe('chrome');
    expect(detectBrowser(UA.iphoneChrome)).toBe('chrome');
    expect(detectBrowser(UA.iphone)).toBe('safari');
    expect(detectBrowser(UA.linuxFirefox)).toBe('firefox');
  });
});

describe('isMobileDevice', () => {
  it('uses the user agent, or a small touch screen', () => {
    expect(isMobileDevice(UA.iphone, 1024, false)).toBe(true);
    expect(isMobileDevice(UA.mac, 1440, false)).toBe(false);
    expect(isMobileDevice(UA.mac, 700, true)).toBe(true);
    expect(isMobileDevice(UA.mac, 700, false)).toBe(false);
  });
});

describe('generateVisitorId', () => {
  it('is a random v4 UUID', () => {
    const a = generateVisitorId();
    expect(a).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(generateVisitorId()).not.toBe(a);
  });
});
