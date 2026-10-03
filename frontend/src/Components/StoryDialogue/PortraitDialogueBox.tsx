import React from 'react';
import { useTypedText } from '../../hooks/useTypedText';
import DialogueChoices, { ChoiceButtonItem } from './DialogueChoices';
import './PortraitDialogueBox.css';

interface PortraitDialogueBoxProps {
  speakerName: string;
  portraitImage: string;
  text: string;
  choices?: ChoiceButtonItem[];
  onAdvance?: () => void; // called when there are no choices and the player continues
  onChoiceSelect?: (id: string) => void;
  typingSpeed?: number;
}

// Bottom-anchored visual-novel style box: NPC portrait (cropped from its own
// idle sprite via CSS, no separate bust asset needed) + name + typed text,
// then either branching choices or a "continue" prompt.
const PortraitDialogueBox: React.FC<PortraitDialogueBoxProps> = ({
  speakerName,
  portraitImage,
  text,
  choices,
  onAdvance,
  onChoiceSelect,
  typingSpeed = 28,
}) => {
  const { displayedText, isTyping, skip } = useTypedText(text, typingSpeed);

  const handleBoxClick = () => {
    if (isTyping) {
      skip();
      return;
    }
    if (!choices && onAdvance) {
      onAdvance();
    }
  };

  return (
    <div className="portrait-dialogue-container">
      <div className="rpgui-container framed-golden portrait-dialogue-box" onClick={handleBoxClick}>
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
