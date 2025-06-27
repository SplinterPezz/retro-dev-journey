import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setUUID, addInteraction } from '../store/trackingSlice';
import { TrkData } from '../types/tracking';
import { sendTrackingData } from '../Services/trkService';
import { generateUUIDFromUserAgent, getDeviceInfo, 
  createInteractionKey 
} from '../Utils/uuidGenerator';
import { useIubenda } from './useIubenda';

import { PageType, timeTrackingIntervals } from '../types/tracking';
import { questPrefix } from '../Pages/Sandbox/config';

interface UseTrackingProps {
  page: PageType;
  enabled?: boolean;
}

export const useTracking = ({ page, enabled = true }: UseTrackingProps) => {
  const dispatch = useDispatch();
  const { uuid, interactions } = useSelector((state: RootState) => state.tracking);
  const { consentGiven, isLoading } = useIubenda();
  
  const startTimeRef = useRef<Date>(new Date());
  const deviceInfoRef = useRef(getDeviceInfo());

  // Check if tracking is allowed (both enabled and consent given)
  const isTrackingAllowed = enabled && consentGiven === true;

  useEffect(() => {
    if (!uuid && isTrackingAllowed && !isLoading) {
      const generatedUUID = generateUUIDFromUserAgent();
      dispatch(setUUID(generatedUUID));
      
      if (process.env.REACT_APP_ENV === 'development') {
        console.log('UUID generated after consent:', generatedUUID);
      }
    }
  }, [uuid, isTrackingAllowed, isLoading, dispatch]);

  const sendViewData = useCallback((timeSpent: number) => {
    if (!uuid || !isTrackingAllowed) {
      if (process.env.REACT_APP_ENV === 'development') {
        console.log('View tracking blocked - UUID:', !!uuid, 'Tracking allowed:', isTrackingAllowed);
      }
      return;
    }

    const trackingData: TrkData = {
      date: new Date(),
      uuid,
      type: 'view',
      time: timeSpent,
      page,
      ...deviceInfoRef.current
    };

    sendTrackingData(trackingData);
    
    if (process.env.REACT_APP_ENV === 'development') {
      console.log('View data sent:', trackingData);
    }
  }, [uuid, page, isTrackingAllowed]);

  // Send interaction tracking data.
  // Return the actual interaction stored
  const trackInteraction = useCallback((info: string) : string[] => {
    if(process.env.REACT_APP_ENV === 'development' && !uuid && isTrackingAllowed) {
      console.log("Something went wrong, uuid should already be initialized on trackInteraction")
      return interactions;
    }

    if (!uuid || !isTrackingAllowed) {
      if (process.env.REACT_APP_ENV === 'development') {
        console.log('Interaction tracking blocked - UUID:', !!uuid, 'Tracking allowed:', isTrackingAllowed);
      }
      return interactions;
    }

    const interactionKey = createInteractionKey(page, 'interaction', info, new Date().toISOString().slice(0,10));
    if (process.env.REACT_APP_ENV === 'development'){
      console.log("Interaction data interactionKey:", interactionKey)
    }

    // Check if this interaction was already tracked
    if (interactions.includes(interactionKey)) {
      if (process.env.REACT_APP_ENV === 'development'){
        console.log("Data already sent for:", interactionKey)
      }
      
      return interactions;
    }

    dispatch(addInteraction(interactionKey));

    const trackingData: TrkData = {
      date: new Date(),
      uuid,
      type: 'interaction',
      info: info.replace(questPrefix, ""),
      page,
      ...deviceInfoRef.current
    };

    sendTrackingData(trackingData);
    
    return [...interactions, interactionKey];
  }, [uuid, page, isTrackingAllowed, interactions, dispatch]);

  useEffect(() => {
    if(process.env.REACT_APP_ENV === 'development' && !uuid && isTrackingAllowed) {
      console.log("Something went wrong, uuid should already be initialized on trackView")
      return;
    }

    if (!isTrackingAllowed || !uuid) {
      if (process.env.REACT_APP_ENV === 'development') {
        console.log('Time tracking blocked - UUID:', !!uuid, 'Tracking allowed:', isTrackingAllowed);
      }
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    timeTrackingIntervals.forEach(seconds => {
      const timeout = setTimeout(() => {
        const interactionKey = createInteractionKey(page, 'view', seconds.toString(), startTimeRef.current.toISOString().slice(0,10));
        
        if (process.env.REACT_APP_ENV === 'development'){
          console.log("View data interactionKey:", interactionKey)
        }
        
        if (interactions.includes(interactionKey)) {
          if (process.env.REACT_APP_ENV === 'development'){
            console.log("Data already sent for:", interactionKey)
          }
          return;
        }

        dispatch(addInteraction(interactionKey));

        sendViewData(seconds);
      }, seconds * 1000);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isTrackingAllowed, uuid, sendViewData, interactions, dispatch, page]);

  useEffect(() => {
    startTimeRef.current = new Date();
  }, [page]);

  useEffect(() => {
    if (process.env.REACT_APP_ENV === 'development') {
      console.log('Tracking consent status:', {
        consentGiven,
        isLoading,
        enabled,
        isTrackingAllowed,
        hasUUID: !!uuid
      });
    }
  }, [consentGiven, isLoading, enabled, isTrackingAllowed, uuid]);

  return {
    trackInteraction,
    isTrackingEnabled: isTrackingAllowed && !!uuid,
    consentGiven,
    isLoading: isLoading
  };
};