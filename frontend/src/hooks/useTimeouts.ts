import { useCallback, useEffect, useRef } from 'react';

// Pending timers are cleared on unmount, so a callback never runs on a closed component.
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
