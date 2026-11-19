import { fetchFromApi, isApiError } from './api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

const respondWith = (body: string, init: ResponseInit & { json?: boolean }) =>
  vi.stubGlobal('fetch', () =>
    Promise.resolve(new Response(body, { ...init, headers: init.json ? { 'Content-Type': 'application/json' } : {} }))
  );

describe('fetchFromApi', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns the body of a successful call', async () => {
    respondWith(JSON.stringify({ token: 't' }), { status: 200, json: true });
    expect(await fetchFromApi(API_ENDPOINTS.login)).toEqual({ token: 't' });
  });

  it('reads message and fieldError from a JSON error', async () => {
    respondWith(JSON.stringify({ message: 'Wrong password', fieldError: 'password' }), { status: 400, json: true });
    const result = await fetchFromApi(API_ENDPOINTS.login);
    expect(isApiError(result)).toBe(true);
    expect(result).toEqual({ success: false, fieldError: 'password', error: 'Wrong password' });
  });

  it('uses a plain-text error body as the error', async () => {
    respondWith('Too many requests', { status: 429 });
    expect(await fetchFromApi(API_ENDPOINTS.login)).toEqual({ success: false, error: 'Too many requests' });
  });

  it('falls back to the status text when the error body says nothing usable', async () => {
    respondWith(JSON.stringify({ code: 7 }), { status: 500, statusText: 'Internal Server Error', json: true });
    expect(await fetchFromApi(API_ENDPOINTS.login)).toEqual({ success: false, error: 'Internal Server Error' });
  });

  it('reports a network failure without throwing', async () => {
    vi.stubGlobal('fetch', () => Promise.reject(new Error('offline')));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(await fetchFromApi(API_ENDPOINTS.login)).toEqual({ success: false, error: 'offline' });
  });
});
