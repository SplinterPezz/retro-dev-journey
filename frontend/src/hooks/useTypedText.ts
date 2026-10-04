import { useState, useEffect, useCallback, useRef } from 'react';

// Typing state is derived from `text`, not kept in a flag: a flag lagged a render
// behind and the next line's choices flashed on screen.
export const useTypedText = (text: string, speed: number = 30) => {
  const [typed, setTyped] = useState<{ text: string; count: number }>({ text: '', count: 0 });
  const [doneText, setDoneText] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTyped({ text, count: 0 });
    setDoneText(null);
    let charIndex = 0;

    const interval = setInterval(() => {
      charIndex++;
      setTyped({ text, count: charIndex });
      if (charIndex >= text.length) {
        setDoneText(text);
        clearInterval(interval);
      }
    }, speed);
    intervalRef.current = interval;

    return () => clearInterval(interval);
  }, [text, speed]);

  const isDone = doneText === text;
  const displayedText = isDone
    ? text
    : typed.text === text
      ? text.slice(0, typed.count)
      : '';

  const skip = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTyped({ text, count: text.length });
    setDoneText(text);
  }, [text]);

  return { displayedText, isTyping: !isDone, skip };
};
