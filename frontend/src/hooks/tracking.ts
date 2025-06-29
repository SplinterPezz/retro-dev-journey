import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setUUID, addInteraction } from '../store/trackingSlice';
import { TrkData } from '../types/tracking';
import { sendTrackingData } from '../Services/trkService';
import { generateUUIDFromUserAgent, getDeviceInfo, 
  createInteractionKey 
} from '../Utils/uuidGenerator';

import { PageType, timeTrackingIntervals } from '../types/tracking';
import { questPrefix } from '../Pages/Sandbox/config';

interface UseTrackingProps {
  page: PageType;
  enabled?: boolean;
}

export const useTracking = ({ page, enabled = true }: UseTrackingProps) => {
  const dispatch = useDispatch();
  const { uuid, interactions } = useSelector((state: RootState) => state.tracking);
  
  const startTimeRef = useRef<Date>(new Date());
  const deviceInfoRef = useRef(getDeviceInfo());

  useEffect(() => {
    if (!uuid && enabled) {
      const generatedUUID = generateUUIDFromUserAgent();
      dispatch(setUUID(generatedUUID));
    }
  }, [uuid, enabled, dispatch]);

  const sendViewData = useCallback((timeSpent: number) => {
    if (!uuid || !enabled) return;

    const trackingData: TrkData = {
      date: new Date(),
      uuid,
      type: 'view',
      time: timeSpent,
      page,
      ...deviceInfoRef.current
    };

    sendTrackingData(trackingData);
  }, [uuid, page, enabled]);

  // Send interaction tracking data.
  // Return the actual interaction stored
  const trackInteraction = useCallback((info: string) : string[] => {
    if(process.env.REACT_APP_ENV === 'development' && !uuid) {
      console.log("Something went wrong, uuid should already initialized on trackInteraction")
      return interactions;
    }

    if (!uuid || !enabled) return interactions;

    const interactionKey = createInteractionKey(page, 'interaction', info, new Date().toISOString().slice(0,10));
    if (process.env.REACT_APP_ENV === 'development'){
      console.log("Interaction data interactionKey : ",interactionKey)
    }

    // Check if this interaction was already tracked
    if (interactions.includes(interactionKey)) {
      if (process.env.REACT_APP_ENV === 'development'){
        console.log("Data already sent for: ", interactionKey)
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
  }, [uuid, page, enabled, interactions, dispatch]);

  useEffect(() => {
    if(process.env.REACT_APP_ENV === 'development' && !uuid) {
      console.log("Something went wrong, uuid should already initialized on trackView")
      return;
    }

    if (!enabled || !uuid) return;

    const timeouts: NodeJS.Timeout[] = [];

    timeTrackingIntervals.forEach(seconds => {
      const timeout = setTimeout(() => {
        const interactionKey = createInteractionKey(page, 'view', seconds.toString(), startTimeRef.current.toISOString().slice(0,10));
        
        if (process.env.REACT_APP_ENV === 'development'){
          console.log("View data interactionKey : ",interactionKey)
        }
        
        if (interactions.includes(interactionKey)) {
          if (process.env.REACT_APP_ENV === 'development'){
            console.log("Data already sent for: ", interactionKey)
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
  }, [enabled, uuid, sendViewData]);

  useEffect(() => {
    startTimeRef.current = new Date();
  }, [page]);

  return {
    trackInteraction,
    isTrackingEnabled: enabled && !!uuid
  };
};