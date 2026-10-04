import { textTypingSound } from '../config/assets';
import { TypingVoice } from '../config/typingVoices';

// The classic "text typing" tick of the dialogue box: one short click sample,
// loaded once and played through Web Audio (an <audio> element is too slow to
// restart many times a second). Each speaker's voice sets its pitch and
// dullness (src/config/typingVoices.ts), and each tick is pitched a hair up or
// down on top so a long line does not sound like a machine gun.

const MAX_GAIN = 1.5; // the sample itself is quiet: full volume boosts it a little
const PITCH_SPREAD = 0.06; // ±6%

let context: AudioContext | null = null;
let gain: GainNode | null = null;
let click: AudioBuffer | null = null;
let loading: Promise<void> | null = null;
let volume = 0.6;

const getContext = () => {
  if (context) return context;
  if (typeof AudioContext === 'undefined') return null;
  context = new AudioContext();
  gain = context.createGain();
  gain.gain.value = volume * MAX_GAIN;
  gain.connect(context.destination);
  return context;
};

const load = (ctx: AudioContext) => {
  loading ??= fetch(textTypingSound)
    .then((response) => response.arrayBuffer())
    .then((data) => ctx.decodeAudioData(data))
    .then((buffer) => {
      click = buffer;
    })
    .catch(() => {
      loading = null; // try again on the next line
    });
  return loading;
};

// 0-1, the volume set in the game menu
export const setTypingVolume = (value: number) => {
  volume = Math.min(1, Math.max(0, value));
  if (gain) gain.gain.value = volume * MAX_GAIN;
};

// Fetches the click ahead of the first line, so the first tick is not lost.
export const preloadTypingSound = () => {
  const ctx = getContext();
  if (ctx) void load(ctx);
};

// Browsers keep sound off until the player has clicked or typed on the page:
// until then ticks are simply not heard (never queued for later).
export const playTypingTick = (voice: TypingVoice) => {
  const ctx = getContext();
  if (!ctx || !gain) return;
  if (!click) {
    void load(ctx);
    return;
  }
  if (ctx.state !== 'running') {
    void ctx.resume().catch(() => {});
    return;
  }
  const source = ctx.createBufferSource();
  source.buffer = click;
  source.playbackRate.value = voice.pitch * (1 + (Math.random() * 2 - 1) * PITCH_SPREAD);
  let output: AudioNode = source;
  if (voice.muffle) {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = voice.muffle;
    source.connect(filter);
    output = filter;
  }
  output.connect(gain);
  source.onended = () => output.disconnect();
  source.start();
};
