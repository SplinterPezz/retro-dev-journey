import { ApiError, LoginModel, TokenAuth } from '../Models/models';
import { fetchFromApi } from '../Utils/apiService'

export async function login(payload: LoginModel): Promise<TokenAuth | ApiError> {
  const response = await fetchFromApi<TokenAuth | ApiError>('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  
  if (response) {
    return response as TokenAuth;
  }

  return response as ApiError;
}
