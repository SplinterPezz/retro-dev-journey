export interface ApiError {
  success: boolean;
  error?: string;
  fieldError?: string;
  customMessage?: string;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface TokenAuth {
  id: string;
  token: string;
  expiration: number;
  user: string;
}

export interface CVInfo {
  filename: string;
  size: number;
  modified_at: string;
  exists: boolean;
}

export interface UploadResponse {
  message: string;
  filename: string;
  size: number;
}