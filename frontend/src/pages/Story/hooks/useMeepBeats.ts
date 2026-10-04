import { useCallback, useEffect, useRef, useState } from 'react';
import { MeepBeat, StoryFlags } from '../../../types/story';

export const useMeepBeats = (beats: MeepBeat[], flags: StoryFlags, completed: boolean) => {
  const [bubble, setBubble] = useState<string | null>(null);
  const triggeredRef = useRef<Set<string>>(new Set());

  const fire = useCallback((beat: MeepBeat | undefined) => {
    if (!beat || triggeredRef.current.has(beat.id)) return;
    triggeredRef.current.add(beat.id);
    setBubble(beat.text);
  }, []);

  useEffect(() => {
    fire(beats.find((b) => b.trigger === 'onEnter'));
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
