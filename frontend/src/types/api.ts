export interface ApiError {
  success: boolean;
  error?: string;
  fieldError?: string;
  customMessage?: string;
}

export interface LoginModel {
  identifier: string;
  password: string;
}

export interface TokenAuth {
  id: string;
  token: string;
  expiration: number;
  user: string;
}

export interface UploadResponse {
  message: string;
  filename: string;
  size: number;
}