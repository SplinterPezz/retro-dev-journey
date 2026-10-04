// How each Story character's dialogue "types" (src/audio/typingSound.ts): the
// same click, nudged per person so they are told apart by ear. Keep the
// values close to the default, a hint of character, not a cartoon.
export interface TypingVoice {
  pitch: number; // playback rate of the click: > 1 higher, < 1 deeper
  lettersPerTick: number; // a click every this many letters: lower is chattier (can be fractional)
  muffle?: number; // Hz of a low-pass for a duller, softer click (none: the plain click)
}

const DEFAULT_TYPING_VOICE: TypingVoice = { pitch: 1, lettersPerTick: 2 };

// Keyed by the dialogue line's `speaker`; anyone not listed uses the default.
const TYPING_VOICES: Record<string, TypingVoice> = {
  Meep: { pitch: 1.25, lettersPerTick: 1.6 }, // high and quick
  Manuel: { pitch: 1, lettersPerTick: 2 }, // the plain one
  Francesco: { pitch: 0.92, lettersPerTick: 2.2, muffle: 3500 }, // calm, a bit soft
  Instructor: { pitch: 0.85, lettersPerTick: 2.6, muffle: 2500 }, // deep, slow, dull
  Giancarlo: { pitch: 0.88, lettersPerTick: 2.4 }, // deep
  Designer: { pitch: 1.1, lettersPerTick: 1.9 }, // a little higher
  Colleague: { pitch: 0.96, lettersPerTick: 2, muffle: 3000 }, // dull
  Classmate: { pitch: 1.08, lettersPerTick: 1.8 }, // light and quick
};

export const typingVoiceFor = (speaker?: string): TypingVoice =>
  (speaker && TYPING_VOICES[speaker]) || DEFAULT_TYPING_VOICE;
