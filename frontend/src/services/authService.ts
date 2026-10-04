import { ApiError, LoginModel, TokenAuth } from '../types/api';
import { fetchFromApi } from './api';
import { API_ENDPOINTS } from '../config/apiEndpoints';

export const login = (payload: LoginModel): Promise<TokenAuth | ApiError> =>
  fetchFromApi<TokenAuth>(API_ENDPOINTS.login, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
