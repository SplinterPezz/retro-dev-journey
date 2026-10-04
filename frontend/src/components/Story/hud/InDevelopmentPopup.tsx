import React from 'react';
import { inDevelopmentSprite } from '../../../config/story/chapters';
import '../dialogue/StoryIntroDialog.css';
import './InDevelopmentPopup.css';

interface InDevelopmentPopupProps {
  chapterName?: string;
  onClose: () => void;
}

const InDevelopmentPopup: React.FC<InDevelopmentPopupProps> = ({ chapterName, onClose }) => (
  <>
    <div className="story-intro-backdrop" />
    <div className="story-intro-dialog in-dev-dialog" role="dialog" aria-labelledby="in-dev-title">
      <div className="rpgui-container framed-golden story-intro-box in-dev-box">
        <div className="in-dev-tape" aria-hidden="true">
          <span>Work in progress</span>
        </div>
        <h2 id="in-dev-title" className="story-intro-title in-dev-title">Thanks for playing!</h2>
        <div className="in-dev-scene">
          <img src={inDevelopmentSprite} alt="Meep coding at a laptop" className="in-dev-sprite" />
        </div>
        <p className="in-dev-subtitle">
          {chapterName ? `${chapterName} is` : 'This part of the story is'} still in development.
        </p>
        <p className="story-intro-text in-dev-text">
          Meep is writing the next chapter right now - one commit at a time. Come back soon to see where the journey goes next!
        </p>
        <div className="story-intro-footer">
          <button type="button" className="rpgui-button golden story-intro-button in-dev-button" onClick={onClose}>
            <p className="revert-top">Back to the story</p>
          </button>
        </div>
      </div>
    </div>
  </>
);

export default InDevelopmentPopup;
