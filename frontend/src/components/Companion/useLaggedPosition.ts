import { useEffect, useRef, useState } from 'react';
import { Position } from '../../types/game';

interface PositionSample extends Position {
  t: number;
}

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

      // keep one sample older than the target time
      while (history.length > 1 && history[1].t <= targetTime) {
        history.shift();
      }

      const sample = history[0];
      // standing still: same sample, no re-render
      if (sample) {
        setLaggedPosition((prev) => (prev.x === sample.x && prev.y === sample.y ? prev : { x: sample.x, y: sample.y }));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [delayMs]);

  return laggedPosition;
};
