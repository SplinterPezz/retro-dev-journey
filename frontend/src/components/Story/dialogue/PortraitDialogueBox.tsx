import React, { useEffect, useRef } from 'react';
import { useTypedText } from '../../../hooks/useTypedText';
import { useTypingSound } from '../../../hooks/useTypingSound';
import DialogueChoices, { ChoiceButtonItem } from './DialogueChoices';
import { DIALOGUE_ADVANCE_KEYS } from '../../../config/controls';
import { useGameMenu } from '../../GameMenu/GameMenuContext';
import './PortraitDialogueBox.css';

interface PortraitDialogueBoxProps {
  speakerName: string;
  portraitImage: string;
  text: string;
  choices?: ChoiceButtonItem[];
  onAdvance?: () => void;
  onChoiceSelect?: (id: string) => void;
  typingSpeed?: number;
  voiceKey?: string;
}

const PortraitDialogueBox: React.FC<PortraitDialogueBoxProps> = ({
  speakerName,
  portraitImage,
  text,
  choices,
  onAdvance,
  onChoiceSelect,
  typingSpeed = 28,
  voiceKey,
}) => {
  const { displayedText, isTyping, skip } = useTypedText(text, typingSpeed);
  useTypingSound(text, displayedText.length, isTyping, voiceKey);

  const handleBoxClick = () => {
    if (isTyping) {
      skip();
      return;
    }
    if (!choices && onAdvance) {
      onAdvance();
    }
  };

  const handleBoxClickRef = useRef(handleBoxClick);
  handleBoxClickRef.current = handleBoxClick;
  const hasChoices = !!choices && choices.length > 0;
  const { isOpen: menuOpen } = useGameMenu();
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!DIALOGUE_ADVANCE_KEYS.includes(e.key) || menuOpenRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, input, textarea, .cm-editor')) return;
      if (hasChoices && !isTyping) return;
      e.preventDefault();
      handleBoxClickRef.current();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hasChoices, isTyping]);

  return (
    <div className="portrait-dialogue-container">
      <div
        className="rpgui-container framed-golden portrait-dialogue-box"
        onClick={handleBoxClick}
        role="dialog"
        aria-label={speakerName}
        aria-live="polite"
      >
        <div
          className="portrait-dialogue-portrait"
          style={{ backgroundImage: `url(${portraitImage})` }}
        />
        <div className="portrait-dialogue-body">
          <h4 className="portrait-dialogue-name">{speakerName}</h4>
          <div className="dialog-separator">
            <hr className="golden" />
          </div>
          <p className="portrait-dialogue-text">
            {displayedText}
            {isTyping && <span className="cursor">|</span>}
          </p>

          {!isTyping && choices && choices.length > 0 && (
            <DialogueChoices choices={choices} onSelect={(id) => onChoiceSelect && onChoiceSelect(id)} />
          )}

          {!isTyping && !choices && (
            <div className="portrait-dialogue-continue">▼ continue</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortraitDialogueBox;
