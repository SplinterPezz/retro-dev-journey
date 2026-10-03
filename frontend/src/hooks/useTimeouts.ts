import { useCallback, useEffect, useRef } from 'react';

// setTimeout tied to the component: every pending timer is cleared on
// unmount, so a delayed callback never runs after the component is gone
// (e.g. a quiz closed with its X while "Correct!" is still showing).
export const useTimeouts = () => {
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  return useCallback((callback: () => void, ms: number) => {
    const id = setTimeout(() => {
      timersRef.current.delete(id);
      callback();
    }, ms);
    timersRef.current.add(id);
    return id;
  }, []);
};
