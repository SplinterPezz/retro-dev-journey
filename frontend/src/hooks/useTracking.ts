import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setUUID, addInteraction, clearAllTrackingData } from '../store/trackingSlice';
import { TrkData, PageType, timeTrackingIntervals } from '../types/tracking';
import { sendTrackingData } from '../services/trkService';
import { generateVisitorId, getDeviceInfo, createInteractionKey } from '../services/tracking/device';
import { questPrefix } from '../config/tracking';
import { devLog } from '../config/env';

interface UseTrackingProps {
  page: PageType;
  enabled?: boolean;
}

const today = () => new Date().toISOString().slice(0, 10);

// Page analytics, active only after the cookie consent.
//
// - a random visitor id is created once consent is given, wiped on revoke;
// - view time: one event per threshold (0s, 30s, 60s...) per page per day;
// - interactions: one event per info per page per day (trackInteraction).
//
// Sent keys are kept in the persisted store and read through a ref, so
// recording one does not restart the view timers.
export const useTracking = ({ page, enabled = true }: UseTrackingProps) => {
  const dispatch = useDispatch();
  const { uuid, interactions } = useSelector((state: RootState) => state.tracking);
  const { consentGiven, isLoading } = useSelector((state: RootState) => state.consent);

  const startDateRef = useRef(today());
  const deviceInfoRef = useRef(getDeviceInfo());
  const interactionsRef = useRef(interactions);
  interactionsRef.current = interactions;

  const isTrackingAllowed = enabled && consentGiven === true;

  useEffect(() => {
    if (!uuid && isTrackingAllowed && !isLoading) {
      const visitorId = generateVisitorId();
      dispatch(setUUID(visitorId));
      devLog('Visitor id generated after consent:', visitorId);
    }
  }, [uuid, isTrackingAllowed, isLoading, dispatch]);

  useEffect(() => {
    if (consentGiven === false && uuid) {
      devLog('Consent revoked, clearing all tracking data');
      dispatch(clearAllTrackingData());
    }
  }, [consentGiven, uuid, dispatch]);

  // Records `key` as sent; false when it already was.
  const markSent = useCallback(
    (key: string): boolean => {
      if (interactionsRef.current.includes(key)) {
        devLog('Data already sent for:', key);
        return false;
      }
      interactionsRef.current = [...interactionsRef.current, key];
      dispatch(addInteraction(key));
      return true;
    },
    [dispatch]
  );

  // Sends an interaction (once per day). Returns the keys sent so far.
  const trackInteraction = useCallback(
    (info: string): string[] => {
      if (!uuid || !isTrackingAllowed) {
        devLog('Interaction tracking blocked - UUID:', !!uuid, 'Tracking allowed:', isTrackingAllowed);
        return interactionsRef.current;
      }

      const interactionKey = createInteractionKey(page, 'interaction', info, today());
      if (!markSent(interactionKey)) return interactionsRef.current;

      const trackingData: TrkData = {
        date: new Date(),
        uuid,
        type: 'interaction',
        info: info.replace(questPrefix, ''),
        page,
        ...deviceInfoRef.current,
      };
      void sendTrackingData(trackingData);
      return interactionsRef.current;
    },
    [uuid, page, isTrackingAllowed, markSent]
  );

  // View time thresholds. Restarted only by a change of page, id or consent.
  useEffect(() => {
    if (!isTrackingAllowed || !uuid) {
      devLog('Time tracking blocked - UUID:', !!uuid, 'Tracking allowed:', isTrackingAllowed);
      return;
    }

    startDateRef.current = today();
    const timeouts = timeTrackingIntervals.map((seconds) =>
      setTimeout(() => {
        const key = createInteractionKey(page, 'view', seconds.toString(), startDateRef.current);
        if (!markSent(key)) return;
        const trackingData: TrkData = {
          date: new Date(),
          uuid,
          type: 'view',
          time: seconds,
          page,
          ...deviceInfoRef.current,
        };
        void sendTrackingData(trackingData);
        devLog('View data sent:', trackingData);
      }, seconds * 1000)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [isTrackingAllowed, uuid, page, markSent]);

  return {
    consentGiven,
    isLoading,
    trackInteraction,
    isTrackingEnabled: isTrackingAllowed && !!uuid,
  };
};
