import { useState, useEffect, useCallback, useRef } from 'react';

// Same typewriter idea as DialogBox.tsx's internal effect, extracted as a
// reusable hook so Story Mode's dialogue/quiz UI can drive it per-line
// instead of DialogBox's fixed auto-advance-after-duration sequencing.
//
// "Is it typing" and "what is shown" are derived from the current `text`
// rather than from a flag that is only updated after an effect runs. A flag
// lagged one render behind, so on the first frame of a new line the previous
// line's "finished" state leaked through and the next line's choices flashed
// on screen before the box shrank back.
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

  // Finishing the line immediately: mark it done so the derived values show
  // the full text and stop the typewriter ticking (the effect's interval is
  // cleared on its own once it reaches the end; skip ends it early).
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
