import { ApiError, LoginModel, TokenAuth } from '../types/api';
import { fetchFromApi } from './api';

export const login = (payload: LoginModel): Promise<TokenAuth | ApiError> =>
  fetchFromApi<TokenAuth>('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
