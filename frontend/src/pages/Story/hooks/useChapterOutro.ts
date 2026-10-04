import { useEffect, useState } from 'react';
import { ChapterOutro, StoryNpcData } from '../../../types/story';
import { Position } from '../../../types/game';

// Timings of the closing scene, in ms.
const START_DELAY = 1000; // after the last line before it
const FADE = 900; // same length as the splash fades in InteriorScene.css
const TITLE_HOLD = 2500;
const END_HOLD = 1500;

// before -> fading to black -> title on black -> back to the room -> scene -> fading out at the end
type Phase = 'idle' | 'toBlack' | 'title' | 'fromBlack' | 'scene' | 'ending';

interface ChapterOutroConfig {
  outro?: ChapterOutro;
  flags: Record<string, boolean>;
  setFlag: (flag: string) => void;
  ready: boolean; // the chapter splash and intro are gone
  busy: boolean; // a dialogue or a popup is open
  npcs: StoryNpcData[];
  cue: (npc: StoryNpcData, nodeId: string) => void;
  seatPlayer: (position: Position) => void;
  onEnd: () => void;
}

export interface OutroCurtain {
  subtitle?: string; // shown under the chapter title; none on the closing black screen
  leaving: boolean;
}

// Plays the chapter's closing scene (see ChapterOutro). `active` freezes the
// player and the walk-up triggers from the first fade to the end.
export const useChapterOutro = ({ outro, flags, setFlag, ready, busy, npcs, cue, seatPlayer, onEnd }: ChapterOutroConfig) => {
  const started = !!outro && !!flags[outro.startedFlag];
  const ended = !!outro && !!flags[outro.endFlag];
  // A reload in the middle of the scene goes straight back to it.
  const [phase, setPhase] = useState<Phase>(started ? 'scene' : 'idle');

  // The scene's dialogue: opened once the room is back, and again after a reload.
  const [cued, setCued] = useState(false);
  useEffect(() => {
    if (!outro || phase !== 'scene' || cued || ended || !ready || busy) return;
    const npc = npcs.find((n) => n.id === outro.dialogue.npcId);
    if (!npc) return;
    setCued(true);
    cue(npc, outro.dialogue.nodeId);
  }, [outro, phase, cued, ended, ready, busy, npcs, cue]);

  // Step through the phases. Each effect only arms the timer of its own phase.
  useEffect(() => {
    if (!outro) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (phase === 'idle' && ready && !busy && !started && flags[outro.afterFlag]) {
      timer = setTimeout(() => setPhase('toBlack'), START_DELAY);
    } else if (phase === 'toBlack') {
      timer = setTimeout(() => {
        setFlag(outro.startedFlag);
        seatPlayer(outro.playerPosition);
        setPhase('title');
      }, FADE);
    } else if (phase === 'title') {
      timer = setTimeout(() => setPhase('fromBlack'), TITLE_HOLD);
    } else if (phase === 'fromBlack') {
      timer = setTimeout(() => setPhase('scene'), FADE);
    } else if (phase === 'scene' && ended && !busy) {
      setPhase('ending');
    } else if (phase === 'ending') {
      timer = setTimeout(onEnd, FADE + END_HOLD);
    }
    return () => clearTimeout(timer);
  }, [outro, phase, ready, busy, started, ended, flags, setFlag, seatPlayer, onEnd]);

  let curtain: OutroCurtain | null = null;
  if (phase === 'toBlack' || phase === 'title') curtain = { subtitle: outro?.subtitle, leaving: false };
  if (phase === 'fromBlack') curtain = { subtitle: outro?.subtitle, leaving: true };
  if (phase === 'ending') curtain = { leaving: false };

  return { active: phase !== 'idle', curtain };
};
