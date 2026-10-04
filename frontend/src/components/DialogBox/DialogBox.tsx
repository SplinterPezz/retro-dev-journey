import React, { useState, useEffect, useRef } from 'react';
import { useTypedText } from '../../hooks/useTypedText';
import './DialogBox.css';

interface DialogMessage {
  speaker: string;
  text: string;
  delay: number;
}

interface DialogBoxProps {
  messages: DialogMessage[];
  onComplete?: () => void;
  typingSpeed?: number;
  messageDuration?: number;
}

type Phase = 'waiting' | 'typing' | 'holding' | 'fading';

const FADE_MS = 500;

const DialogBox: React.FC<DialogBoxProps> = ({ messages, onComplete, typingSpeed = 50, messageDuration = 3000 }) => {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('waiting');

  const message = messages[index];
  const fullText = message ? `${message.speaker}: ${message.text}` : '';
  const { displayedText, isTyping } = useTypedText(phase === 'waiting' ? '' : fullText, typingSpeed);
  const finished = index >= messages.length;
  const delay = message?.delay ?? 0;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (finished) {
      onCompleteRef.current?.();
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (phase === 'waiting') {
      timer = setTimeout(() => setPhase('typing'), delay);
    } else if (phase === 'typing' && !isTyping) {
      setPhase('holding');
    } else if (phase === 'holding') {
      timer = setTimeout(() => setPhase('fading'), messageDuration);
    } else if (phase === 'fading') {
      timer = setTimeout(() => {
        setIndex((i) => i + 1);
        setPhase('waiting');
      }, FADE_MS);
    }
    return () => clearTimeout(timer);
  }, [finished, phase, isTyping, delay, messageDuration]);

  if (finished) {
    return null;
  }

  const isVisible = phase === 'typing' || phase === 'holding';

  return (
    <div className={`dialog-box-container d-none d-sm-block ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="rpgui-content">
        <div className="rpgui-container framed">
          <div className="dialog-content">
            <p className="dialog-text">
              {phase === 'waiting' ? '' : displayedText}
              {phase === 'typing' && <span className="cursor">|</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
