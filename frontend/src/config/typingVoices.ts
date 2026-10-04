// Keep the values close to the default: a hint of character, not a cartoon.
export interface TypingVoice {
  pitch: number;
  lettersPerTick: number;
  muffle?: number;
}

const DEFAULT_TYPING_VOICE: TypingVoice = { pitch: 1, lettersPerTick: 2 };

const TYPING_VOICES: Record<string, TypingVoice> = {
  Meep: { pitch: 1.25, lettersPerTick: 1.6 },
  Manuel: { pitch: 1, lettersPerTick: 2 },
  Francesco: { pitch: 0.92, lettersPerTick: 2.2, muffle: 3500 },
  Instructor: { pitch: 0.85, lettersPerTick: 2.6, muffle: 2500 },
  Giancarlo: { pitch: 0.88, lettersPerTick: 2.4 },
  Designer: { pitch: 1.1, lettersPerTick: 1.9 },
  Colleague: { pitch: 0.96, lettersPerTick: 2, muffle: 3000 },
  Classmate: { pitch: 1.08, lettersPerTick: 1.8 },
};

export const typingVoiceFor = (speaker?: string): TypingVoice =>
  (speaker && TYPING_VOICES[speaker]) || DEFAULT_TYPING_VOICE;
