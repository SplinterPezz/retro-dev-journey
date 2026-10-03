import React, { useEffect } from 'react';
import { Position } from '../../types/sandbox';
import { useTypedText } from '../../hooks/useTypedText';
import './MeepBubble.css';

interface MeepBubbleProps {
  text: string;
  anchorPosition: Position;
  onDismiss: () => void;
  durationMs?: number;
}

// Small speech bubble anchored above Meep, used for one-off commentary at
// fixed story beats (scene entry, quiz pass/fail, chapter complete) rather
// than continuous scripted dialogue - auto-dismisses after `durationMs`.
const MeepBubble: React.FC<MeepBubbleProps> = ({ text, anchorPosition, onDismiss, durationMs = 4000 }) => {
  const { displayedText, isTyping } = useTypedText(text, 22);

  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [text, durationMs, onDismiss]);

  // Meep itself renders at { x: anchorPosition.x + 54, y: anchorPosition.y - 70 }
  // (see Meep.tsx) with a 56px sprite - centre the bubble on Meep's centre
  // and sit it above its head, rather than the player's position.
  return (
    <div
      className="meep-bubble-container"
      style={{ left: anchorPosition.x + 54 + 28, top: anchorPosition.y - 220 }}
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
