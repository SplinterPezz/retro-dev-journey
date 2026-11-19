import { store } from "../store/store";
import { checkAuthentication, logout } from "../store/authSlice";
import { ApiError } from "../types/api";
import { apiBaseUrl, devError } from "../config/env";
import { PUBLIC_ENDPOINTS } from "../config/apiEndpoints";
import { Guard, isRecord } from "./guards";

const authExpired: ApiError = { success: false, error: 'Authentication expired' };
const unexpectedResponse: ApiError = { success: false, error: 'Unexpected response from the server' };

const nonEmptyText = (value: unknown): string | undefined => (typeof value === 'string' && value ? value : undefined);

export const isApiError = (value: unknown): value is ApiError => isRecord(value) && value.success === false;

// Without a guard the body stays unknown: a response gets a type only by passing its check.
export function fetchFromApi(endpoint: string, options?: RequestInit): Promise<unknown>;
export function fetchFromApi<T>(endpoint: string, options: RequestInit, isExpected: Guard<T>): Promise<T | ApiError>;
export async function fetchFromApi(
  endpoint: string,
  options: RequestInit = {},
  isExpected?: Guard<unknown>
): Promise<unknown> {
  const isPublic = PUBLIC_ENDPOINTS.includes(endpoint);

  store.dispatch(checkAuthentication());
  const { token, isAuthenticated } = store.getState().auth;
  if (!isAuthenticated && !isPublic) {
    store.dispatch(logout());
    return authExpired;
  }

  // set after the caller's, so the caller cannot drop the Authorization header
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
    return { success: false, error: (error instanceof Error && error.message) || 'Network error' };
  }

  if (response.status === 401) {
    store.dispatch(logout());
    return authExpired;
  }

  const isJson = response.headers.get('Content-Type')?.includes('application/json');
  const responseBody: unknown = isJson ? await response.json().catch(() => null) : await response.text().catch(() => '');

  if (!response.ok) {
    const details = isRecord(responseBody) ? responseBody : {};
    // the analytics handlers answer { error }, the others { message }
    const error =
      nonEmptyText(details.message) ?? nonEmptyText(details.error) ?? nonEmptyText(responseBody) ?? response.statusText;
    const fieldError = nonEmptyText(details.fieldError);
    return fieldError ? { success: false, fieldError, error } : { success: false, error };
  }

  if (isExpected && !isExpected(responseBody)) {
    devError('Unexpected response from', endpoint, responseBody);
    return unexpectedResponse;
  }
  return responseBody;
}
