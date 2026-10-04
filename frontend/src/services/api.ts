import { store } from "../store/store";
import { checkAuthentication, logout } from "../store/authSlice";
import { ApiError } from "../types/api";
import { apiBaseUrl } from "../config/env";
import { PUBLIC_ENDPOINTS } from "../config/apiEndpoints";

const authExpired: ApiError = { success: false, error: 'Authentication expired' };

export const isApiError = (value: unknown): value is ApiError =>
  typeof value === 'object' && value !== null && 'success' in value && (value as ApiError).success === false;

// fetch() against the backend: JSON by default, the admin token on private
// endpoints, and every failure returned as an ApiError instead of thrown.
export async function fetchFromApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | ApiError> {
  const isPublic = PUBLIC_ENDPOINTS.includes(endpoint);

  store.dispatch(checkAuthentication());
  const { token, isAuthenticated } = store.getState().auth;
  if (!isAuthenticated && !isPublic) {
    store.dispatch(logout());
    return authExpired;
  }

  // Caller headers first, then the ones this function owns: the caller cannot
  // drop the Authorization header by passing its own headers.
  const headers = new Headers(options.headers);
  if (!headers.has('Accept')) headers.set('Accept', '*/*');
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token && !isPublic) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${endpoint}`, { ...options, headers });
  } catch (error) {
    // Network down or CORS: the session is still valid, keep the user logged in.
    console.error('This might be a network or CORS issue. Please check your network and the API server.');
    return { success: false, error: (error as Error).message || 'Network error' };
  }

  if (response.status === 401) {
    store.dispatch(logout());
    return authExpired;
  }

  const isJson = response.headers.get('Content-Type')?.includes('application/json');
  const responseBody = isJson ? await response.json().catch(() => null) : await response.text().catch(() => '');

  if (!response.ok) {
    const error =
      (isJson && typeof responseBody === 'object' && responseBody?.message) || responseBody || response.statusText;
    return isJson && responseBody?.fieldError
      ? { success: false, fieldError: responseBody.fieldError, error }
      : { success: false, error };
  }

  return responseBody as T;
}
