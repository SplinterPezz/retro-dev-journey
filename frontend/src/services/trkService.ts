import { TrkData } from '../types/tracking';
import { fetchFromApi } from './api';
import { devLog, devError } from '../config/env';

export const sendTrackingData = async (data: TrkData): Promise<void> => {
  try {

    const payload = {
      ...data,
      date: data.date.toISOString()
    };
    
    // Avoid to use /track or /trk etc for adblock
    await fetchFromApi('/info', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    devLog('Tracking data sent:', payload);

  } catch (error) {
    devError('Failed to send tracking data:', error);
  }
};