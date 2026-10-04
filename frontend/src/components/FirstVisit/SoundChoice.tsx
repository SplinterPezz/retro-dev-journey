import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import './OrientationChoice.css';
import '../Common/pixel-button.css';
import '../Common/fullscreen-page.css';

interface SoundChoiceProps {
  onChoose: (soundOn: boolean) => void;
}

// Shown once, on every device, before the first game (Story or Sandbox, see
// FirstVisitSetup), after the orientation on phones. Sound on is the left
// button, off the right one. It switches the music and the dialogue sound
// together; both can be changed later in the game menu. Same look as the
// orientation choice.
const SoundChoice: React.FC<SoundChoiceProps> = ({ onChoose }) => (
  <div className="orientation-choice-page fullscreen-page">
    <div className="orientation-choice-box">
      <h2 className="orientation-choice-title">Do you want sound?</h2>
      <div className="orientation-choice-buttons">
        <button type="button" className="orientation-choice-button pixel-button" onClick={() => onChoose(true)}>
          <Volume2 size={56} strokeWidth={2} />
          <span>Audio on</span>
        </button>
        <button type="button" className="orientation-choice-button pixel-button" onClick={() => onChoose(false)}>
          <VolumeX size={56} strokeWidth={2} />
          <span>Audio off</span>
        </button>
      </div>
    </div>
  </div>
);

export default SoundChoice;
