import { useCallback, useEffect, useRef, useState } from 'react';
import { MeepBeat } from '../../../types/story';

// Meep's one-off lines: onEnter once when the scene opens, onFlag the first
// time its flag is set, onComplete once the chapter is done. Returns the line
// to show, a stable dismiss callback (MeepBubble keys its timer on it) and
// `say` for a line the scene triggers itself.
export const useMeepBeats = (beats: MeepBeat[], flags: Record<string, boolean>, completed: boolean) => {
  const [bubble, setBubble] = useState<string | null>(null);
  const triggeredRef = useRef<Set<string>>(new Set());

  const fire = useCallback((beat: MeepBeat | undefined) => {
    if (!beat || triggeredRef.current.has(beat.id)) return;
    triggeredRef.current.add(beat.id);
    setBubble(beat.text);
  }, []);

  useEffect(() => {
    fire(beats.find((b) => b.trigger === 'onEnter'));
    // Scene entry only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    beats.filter((b) => b.trigger === 'onFlag' && b.flag && flags[b.flag]).forEach(fire);
    if (completed) fire(beats.find((b) => b.trigger === 'onComplete'));
  }, [beats, flags, completed, fire]);

  const dismiss = useCallback(() => setBubble(null), []);
  const say = useCallback((text: string) => setBubble(text), []);

  return { bubble, dismiss, say };
};
