import { TrkData } from '../types/tracking';
import { fetchFromApi } from '../Utils/apiService';

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
    
    // Log tracking data in development
    if (process.env.REACT_APP_ENV === 'development') {
      console.log('Tracking data sent:', payload);
    }
    
  } catch (error) {
    // Silently fail for tracking to not disrupt user experience
    if (process.env.REACT_APP_ENV === 'development') {
      console.error('Failed to send tracking data:', error);
    }
  }
};