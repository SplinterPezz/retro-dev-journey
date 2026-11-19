import { ApiError, LoginModel, TokenAuth } from '../types/api';
import { fetchFromApi } from './api';
import { isNumber, isString, shape } from './guards';
import { API_ENDPOINTS } from '../config/apiEndpoints';

// what backend/internal/auth Login answers
const isTokenAuth = shape<TokenAuth>({ id: isString, token: isString, expiration: isNumber, user: isString });

export const login = (payload: LoginModel): Promise<TokenAuth | ApiError> =>
  fetchFromApi(
    API_ENDPOINTS.login,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    isTokenAuth
  );
