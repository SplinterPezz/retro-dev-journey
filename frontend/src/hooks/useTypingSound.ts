import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { selectDialogueSound } from '../store/settingsSlice';
import { playTypingTick, preloadTypingSound, setTypingVolume } from '../audio/typingSound';
import { typingVoiceFor } from '../config/typingVoices';

export const useTypingSound = (text: string, typedLength: number, isTyping: boolean, speaker?: string) => {
  const settings = useSelector((state: RootState) => state.settings);
  const { dialogueVolume, dialogueMuted } = selectDialogueSound(settings);
  const voice = useMemo(() => typingVoiceFor(speaker), [speaker]);
  const letters = useRef(0);
  const nextTickAt = useRef(0);
  const lastLength = useRef(0);

  useEffect(() => {
    preloadTypingSound();
  }, []);

  useEffect(() => {
    setTypingVolume(dialogueVolume / 100);
  }, [dialogueVolume]);

  useEffect(() => {
    letters.current = 0;
    nextTickAt.current = 0;
    lastLength.current = 0;
  }, [text]);

  useEffect(() => {
    if (!isTyping) return;
    let tick = false;
    for (let i = lastLength.current; i < typedLength; i++) {
      if (!/[a-z0-9]/i.test(text[i] ?? '')) continue;
      if (letters.current >= nextTickAt.current) {
        tick = true;
        nextTickAt.current += voice.lettersPerTick;
      }
      letters.current++;
    }
    lastLength.current = typedLength;
    if (tick && !dialogueMuted) playTypingTick(voice);
  }, [text, typedLength, isTyping, voice, dialogueMuted]);
};
