import { useEffect, useRef } from 'react';

interface ProximityTriggerConfig {
  nearbyId: string | null;
  enabled: boolean;
  canOpen: (id: string) => boolean;
  onOpen: (id: string) => void;
  onLeave?: () => void;
}

// Opens once per walk-up, so a popup closed with its X does not reopen while the player stands there.
export const useProximityTrigger = ({ nearbyId, enabled, canOpen, onOpen, onLeave }: ProximityTriggerConfig) => {
  const firedForRef = useRef<string | null>(null);
  const wasNearRef = useRef(false);

  useEffect(() => {
    if (!nearbyId) {
      firedForRef.current = null;
      if (wasNearRef.current) {
        wasNearRef.current = false;
        onLeave?.();
      }
      return;
    }
    wasNearRef.current = true;
    if (!enabled || firedForRef.current === nearbyId || !canOpen(nearbyId)) return;
    firedForRef.current = nearbyId;
    onOpen(nearbyId);
  });
};
