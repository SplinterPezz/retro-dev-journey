import React, { useEffect } from 'react';
import { Position } from '../../types/sandbox';
import { useTypedText } from '../../hooks/useTypedText';
import { MEEP_OFFSET, MEEP_SIZE } from './Meep';
import './MeepBubble.css';

interface MeepBubbleProps {
  text: string;
  anchorPosition: Position;
  onDismiss: () => void;
  durationMs?: number;
}

const BUBBLE_OFFSET_Y = -220;

const MeepBubble: React.FC<MeepBubbleProps> = ({ text, anchorPosition, onDismiss, durationMs = 4000 }) => {
  const { displayedText, isTyping } = useTypedText(text, 22);

  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [text, durationMs, onDismiss]);

  return (
    <div
      className="meep-bubble-container"
      style={{ left: anchorPosition.x + MEEP_OFFSET.x + MEEP_SIZE / 2, top: anchorPosition.y + BUBBLE_OFFSET_Y }}
    >
      <div className="rpgui-container framed-grey meep-bubble-box">
        <p className="meep-bubble-text">
          {displayedText}
          {isTyping && <span className="cursor">|</span>}
        </p>
      </div>
      <div className="meep-bubble-tail" />
    </div>
  );
};

export default MeepBubble;
