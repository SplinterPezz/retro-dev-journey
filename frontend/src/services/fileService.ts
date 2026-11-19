import { fetchFromApi } from './api';
import { isNumber, isString, shape } from './guards';
import { ApiError, UploadResponse } from '../types/api';
import { cvDownloadFilename, maxCvSizeBytes, maxCvSizeMb } from '../config/cv';
import { apiBaseUrl } from '../config/env';
import { API_ENDPOINTS } from '../config/apiEndpoints';

export const downloadCV = async (): Promise<void> => {
  try {
    const response = await fetch(`${apiBaseUrl}${API_ENDPOINTS.cvDownload}`);
    
    if (!response.ok) {
      throw new Error('Failed to download CV');
    }
    
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = cvDownloadFilename;
    
    if (contentDisposition) {
      filename = contentDisposition.match(/filename="(.+)"/)?.[1] ?? filename;
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download CV', { cause: error });
  }
};

// what backend/internal/handlers UploadCV answers
const isUploadResponse = shape<UploadResponse>({ message: isString, filename: isString, size: isNumber });

export const uploadCV = async (file: File): Promise<UploadResponse | ApiError> => {
  try {
    if (file.size > maxCvSizeBytes) {
      return {
        success: false,
        error: `File size exceeds ${maxCvSizeMb}MB limit`
      };
    }
    const formData = new FormData();
    formData.append('cv', file);
    
    return await fetchFromApi(API_ENDPOINTS.cvUpload, { method: 'POST', body: formData }, isUploadResponse);
    
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: (error instanceof Error && error.message) || 'Upload failed'
    };
  }
};