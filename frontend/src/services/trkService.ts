import { TrkData } from '../types/tracking';
import { fetchFromApi } from './api';
import { devLog, devError } from '../config/env';
import { API_ENDPOINTS } from '../config/apiEndpoints';

export const sendTrackingData = async (data: TrkData): Promise<void> => {
  try {

    const payload = {
      ...data,
      date: data.date.toISOString()
    };
    
    await fetchFromApi(API_ENDPOINTS.trackingInfo, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    devLog('Tracking data sent:', payload);

  } catch (error) {
    devError('Failed to send tracking data:', error);
  }
};