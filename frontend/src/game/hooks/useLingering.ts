import { useEffect, useState } from 'react';

// The last non-null value, kept for `delayMs` after it turns null, so a window tied to a
// walk-up radius does not flicker while the player walks along its edge.
export const useLingering = <T,>(value: T | null, delayMs: number): T | null => {
  const [shown, setShown] = useState<T | null>(value);
  if (value && value !== shown) setShown(value);

  useEffect(() => {
    if (value) return;
    const timer = setTimeout(() => setShown(null), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return value ?? shown;
};
