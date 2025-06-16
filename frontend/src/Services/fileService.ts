import { fetchFromApi } from '../Utils/apiService';
import { ApiError, UploadResponse } from '../types/api';
import { maxSizeFileCV } from '../Pages/Sandbox/config';

export const downloadCV = async (): Promise<void> => {
  try {
    const baseUrl = process.env.REACT_APP_API_URL || '';
    const response = await fetch(`${baseUrl}/download/cv`);
    
    if (!response.ok) {
      throw new Error('Failed to download CV');
    }
    
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'pezzati mauro cv.pdf';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    // Create blob and download
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
    throw new Error('Failed to download CV');
  }
};

// Upload CV file (authenticated)
export const uploadCV = async (file: File): Promise<UploadResponse | ApiError> => {
  try {
    if (file.size > maxSizeFileCV * 1024 * 1024) {
      return {
        success: false,
        error: 'File size exceeds 5MB limit'
      };
    }
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('cv', file);
    
    const response = await fetchFromApi<UploadResponse>('/upload/cv', {
      method: 'POST',
      body: formData,
    });
    
    return response;
    
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: (error as Error).message || 'Upload failed'
    };
  }
};