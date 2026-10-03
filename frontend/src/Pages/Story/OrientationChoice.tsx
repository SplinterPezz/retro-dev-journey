import React from 'react';
import { RectangleHorizontal, RectangleVertical } from 'lucide-react';
import { StoryOrientation } from '../../types/story';
import './OrientationChoice.css';

interface OrientationChoiceProps {
  onChoose: (orientation: StoryOrientation) => void;
}

// Shown once on phones, before the difficulty. Landscape is the left button,
// portrait the right one; the choice can be flipped later from the audio bar.
const OrientationChoice: React.FC<OrientationChoiceProps> = ({ onChoose }) => (
  <div className="orientation-choice-page">
    <div className="orientation-choice-box">
      <h2 className="orientation-choice-title">How do you want to play?</h2>
      <div className="orientation-choice-buttons">
        <button
          type="button"
          className="orientation-choice-button"
          onClick={() => onChoose('landscape-primary')}
        >
          <RectangleHorizontal size={56} strokeWidth={2} />
          <span>Landscape</span>
        </button>
        <button
          type="button"
          className="orientation-choice-button"
          onClick={() => onChoose('portrait')}
        >
          <RectangleVertical size={56} strokeWidth={2} />
          <span>Portrait</span>
        </button>
      </div>
    </div>
  </div>
);

export default OrientationChoice;
