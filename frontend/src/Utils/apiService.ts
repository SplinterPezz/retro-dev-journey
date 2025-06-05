import { store } from "../store/store";
import { checkAuthentication, logout } from "../store/authSlice";
import { ApiError } from "../Pages/Login/types";

const whitelist = ["/login"]

export async function fetchFromApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | ApiError> {  
  const baseUrl = process.env.REACT_APP_API_URL || '';
  const isInWhitelist = whitelist.includes(endpoint)
  
  try {
    // Get the current state from Redux store
    const state = store.getState();
    const { token } = state.auth;
    store.dispatch(checkAuthentication());

    // Check authentication after dispatching checkAuthentication
    const isAuthenticated = store.getState().auth.isAuthenticated;
    if (!isAuthenticated && !isInWhitelist) {
      store.dispatch(logout());
      return {
        success: false,
        error: 'Authentication expired',
      } as ApiError;
    }

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept':'*/*',
      ...(options?.headers || {}),
    };

    // Add token to headers if it exists and is valid
    if (token && !isInWhitelist) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers,
      ...options,
    });

    if (response.status === 401) {
      store.dispatch(logout());
      return {
        success: false,
        error: 'Authentication expired',
      } as ApiError;
    }

    const isJson = response.headers.get('Content-Type')?.includes('application/json');
    const responseBody = isJson
      ? await response.json().catch(() => null)
      : await response.text();

    if (!response.ok) {
      const errorMessage =
        (isJson && typeof responseBody === 'object' && responseBody?.message) ||
        responseBody ||
        response.statusText;

      // Check for field-specific errors
      if (isJson && responseBody?.fieldError) {
        return {
          success: false,
          fieldError: responseBody.fieldError,
          error: errorMessage,
        };
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    return responseBody as T;
  } catch (error) {
    if (error instanceof TypeError) {
      store.dispatch(logout());
      console.error('This might be a network or CORS issue. Please check your network and the API server.');
    }
    return {
      success: false,
      error: (error as Error).message || 'Unknown error occurred',
    };
  }
}
