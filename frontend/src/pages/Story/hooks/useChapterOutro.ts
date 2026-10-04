import { useCallback, useEffect, useState } from 'react';
import { ChapterOutro, StoryNpcData, StoryFlags } from '../../../types/story';
import { Position } from '../../../types/game';

const START_DELAY = 1000;
const FADE = 900; // same as the splash fade in LoadingSplash.css
const TITLE_HOLD = 2500;
const END_HOLD = 1500;

type Phase = 'idle' | 'toBlack' | 'title' | 'fromBlack' | 'scene' | 'free' | 'ending';

interface ChapterOutroConfig {
  outro?: ChapterOutro;
  flags: StoryFlags;
  setFlag: (flag: string) => void;
  ready: boolean;
  busy: boolean;
  npcs: StoryNpcData[];
  cue: (npc: StoryNpcData, nodeId: string) => void;
  seatPlayer: (position: Position) => void;
  onEnd: () => void;
}

interface OutroCurtain {
  subtitle?: string;
  leaving: boolean;
}

export const useChapterOutro = ({ outro, flags, setFlag, ready, busy, npcs, cue, seatPlayer, onEnd }: ChapterOutroConfig) => {
  const started = !!outro && !!flags[outro.startedFlag];
  const ended = !!outro && !!flags[outro.endFlag];
  // a reload mid-scene goes straight back to it
  const [phase, setPhase] = useState<Phase>(ended ? 'ending' : started ? 'scene' : 'idle');

  const [cued, setCued] = useState(false);
  useEffect(() => {
    if (!outro || phase !== 'scene' || cued || ended || !ready || busy) return;
    const npc = npcs.find((n) => n.id === outro.dialogue.npcId);
    if (!npc) return;
    setCued(true);
    cue(npc, outro.dialogue.nodeId);
  }, [outro, phase, cued, ended, ready, busy, npcs, cue]);

  useEffect(() => {
    if (!outro) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const after = (ms: number, then: () => void) => {
      timer = setTimeout(then, ms);
    };

    switch (phase) {
      case 'idle':
        if (ready && !busy && !started && flags[outro.afterFlag]) after(START_DELAY, () => setPhase('toBlack'));
        break;
      case 'toBlack':
        after(FADE, () => {
          setFlag(outro.startedFlag);
          seatPlayer(outro.playerPosition);
          setPhase('title');
        });
        break;
      case 'title':
        after(TITLE_HOLD, () => setPhase('fromBlack'));
        break;
      case 'fromBlack':
        after(FADE, () => setPhase('scene'));
        break;
      case 'scene':
        if (ended && !busy) setPhase('free');
        break;
      case 'free':
        break;
      case 'ending':
        after(FADE + END_HOLD, onEnd);
        break;
    }
    return () => clearTimeout(timer);
  }, [outro, phase, ready, busy, started, ended, flags, setFlag, seatPlayer, onEnd]);

  let curtain: OutroCurtain | null = null;
  if (phase === 'toBlack' || phase === 'title') curtain = { subtitle: outro?.subtitle, leaving: false };
  if (phase === 'fromBlack') curtain = { subtitle: outro?.subtitle, leaving: true };
  if (phase === 'ending') curtain = { leaving: false };

  const leave = useCallback(() => setPhase((p) => (p === 'free' ? 'ending' : p)), []);

  return { active: phase !== 'idle' && phase !== 'free', ended, curtain, leave };
};
