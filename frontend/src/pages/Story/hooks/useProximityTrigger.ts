import { useEffect, useRef } from 'react';

interface ProximityTriggerConfig {
  nearbyId: string | null; // id of the entity the player stands next to
  enabled: boolean; // false while something else owns the scene (intro, popups)
  canOpen: (id: string) => boolean;
  onOpen: (id: string) => void;
  onLeave?: () => void; // the player stepped out of every radius
}

// Opens something once per walk-up: when the player enters an entity's radius
// and it may open, `onOpen` runs; it is not called again for the same entity
// until the player steps away and comes back. That is what keeps a popup
// closed with its X from reopening while the player is still standing there.
//
// If the entity cannot open yet (another dialogue is up), it keeps checking on
// every render and opens as soon as it can.
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
