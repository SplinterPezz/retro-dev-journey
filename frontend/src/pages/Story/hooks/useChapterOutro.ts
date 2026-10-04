import { useCallback, useEffect, useState } from 'react';
import { ChapterOutro, StoryNpcData, StoryFlags } from '../../../types/story';
import { Position } from '../../../types/game';

// Timings of the closing scene, in ms.
const START_DELAY = 1000; // after the last line before it
const FADE = 900; // same length as the splash fades in InteriorScene.css
const TITLE_HOLD = 2500;
const END_HOLD = 1500;

// before -> fading to black -> title on black -> back to the room -> scene ->
// free to walk to the exit -> fading out at the end
type Phase = 'idle' | 'toBlack' | 'title' | 'fromBlack' | 'scene' | 'free' | 'ending';

interface ChapterOutroConfig {
  outro?: ChapterOutro;
  flags: StoryFlags;
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
// player and the walk-up triggers from the first fade until the scene's last
// line; then the player is free again and `leave` (the exit door) ends it.
export const useChapterOutro = ({ outro, flags, setFlag, ready, busy, npcs, cue, seatPlayer, onEnd }: ChapterOutroConfig) => {
  const started = !!outro && !!flags[outro.startedFlag];
  const ended = !!outro && !!flags[outro.endFlag];
  // A reload in the middle of the scene goes straight back to it; once the
  // chapter is over the room cannot be entered again.
  const [phase, setPhase] = useState<Phase>(ended ? 'ending' : started ? 'scene' : 'idle');

  // The scene's dialogue: opened once the room is back, and again after a reload.
  const [cued, setCued] = useState(false);
  useEffect(() => {
    if (!outro || phase !== 'scene' || cued || ended || !ready || busy) return;
    const npc = npcs.find((n) => n.id === outro.dialogue.npcId);
    if (!npc) return;
    setCued(true);
    cue(npc, outro.dialogue.nodeId);
  }, [outro, phase, cued, ended, ready, busy, npcs, cue]);

  // Step through the phases. Each phase arms only its own timer (or waits
  // for its condition); the cleanup cancels it if the phase changes first.
  useEffect(() => {
    if (!outro) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const after = (ms: number, then: () => void) => {
      timer = setTimeout(then, ms);
    };

    switch (phase) {
      case 'idle': // waiting for the trigger flag, with the scene free
        if (ready && !busy && !started && flags[outro.afterFlag]) after(START_DELAY, () => setPhase('toBlack'));
        break;
      case 'toBlack': // fading out; once black, the scene starts and the player sits down
        after(FADE, () => {
          setFlag(outro.startedFlag);
          seatPlayer(outro.playerPosition);
          setPhase('title');
        });
        break;
      case 'title': // "<chapter> / Some days later" on black
        after(TITLE_HOLD, () => setPhase('fromBlack'));
        break;
      case 'fromBlack': // fading back into the room
        after(FADE, () => setPhase('scene'));
        break;
      case 'scene': // the scene's dialogue runs (see the effect above) until its end flag
        if (ended && !busy) setPhase('free');
        break;
      case 'free': // the player walks to the exit door, which calls leave()
        break;
      case 'ending': // final fade to black, then out of the chapter
        after(FADE + END_HOLD, onEnd);
        break;
    }
    return () => clearTimeout(timer);
  }, [outro, phase, ready, busy, started, ended, flags, setFlag, seatPlayer, onEnd]);

  let curtain: OutroCurtain | null = null;
  if (phase === 'toBlack' || phase === 'title') curtain = { subtitle: outro?.subtitle, leaving: false };
  if (phase === 'fromBlack') curtain = { subtitle: outro?.subtitle, leaving: true };
  if (phase === 'ending') curtain = { leaving: false };

  // The exit, once the scene is over.
  const leave = useCallback(() => setPhase((p) => (p === 'free' ? 'ending' : p)), []);

  return { active: phase !== 'idle' && phase !== 'free', ended, curtain, leave };
};
