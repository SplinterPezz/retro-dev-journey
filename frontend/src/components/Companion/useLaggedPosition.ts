import { useEffect, useRef, useState } from 'react';
import { Position } from '../../types/game';

interface PositionSample extends Position {
  t: number;
}

// Samples `target` over time and returns whatever sample is `delayMs` old,
// so a consumer can render trailing a moving point instead of snapping to
// it - used by Meep to lag-follow the player. Lifted out of Meep.tsx so
// anything anchored to Meep (e.g. its speech bubble) can read the exact
// same lagged position instead of the raw, un-lagged target.
export const useLaggedPosition = (target: Position, delayMs = 450): Position => {
  const historyRef = useRef<PositionSample[]>([]);
  const [laggedPosition, setLaggedPosition] = useState<Position>(target);

  useEffect(() => {
    historyRef.current.push({ ...target, t: performance.now() });
  }, [target]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = performance.now();
      const targetTime = now - delayMs;
      const history = historyRef.current;

      // drop samples older than what we still might need, keep one before target
      while (history.length > 1 && history[1].t <= targetTime) {
        history.shift();
      }

      const sample = history[0];
      // Same point as last time (standing still): keep the state as is, so
      // nothing re-renders 20 times a second while idle.
      if (sample) {
        setLaggedPosition((prev) => (prev.x === sample.x && prev.y === sample.y ? prev : { x: sample.x, y: sample.y }));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [delayMs]);

  return laggedPosition;
};
