import React from 'react';
import { TechnologyData } from '../../../types/sandbox';
import '../dialogue/StoryIntroDialog.css';
import './DiscoveryPopup.css';

interface DiscoveryPopupProps {
  technology: TechnologyData;
  remaining: number; // still to show after this one
  onConfirm: () => void;
}

// "You unlocked something" window, shown on the story map after a chapter:
// one technology at a time, same backdrop and golden frame as the chapter intro.
const DiscoveryPopup: React.FC<DiscoveryPopupProps> = ({ technology, remaining, onConfirm }) => (
  <>
    <div className="story-intro-backdrop" />
    <div className="story-intro-dialog" role="dialog" aria-labelledby="discovery-name">
      <div className="rpgui-container framed-golden story-intro-box discovery-box">
        <p className="discovery-kicker">New technology unlocked!</p>
        <img src={technology.image} alt="" className="discovery-sprite" />
        <h2 id="discovery-name" className="story-intro-title">{technology.name}</h2>
        {technology.category && <p className="discovery-category">{technology.category}</p>}
        <div className="dialog-separator">
          <hr className="golden" />
        </div>
        <p className="story-intro-text">{technology.learnedText ?? technology.description}</p>
        <p className="discovery-map-note">Its statue now stands on the map.</p>
        <div className="story-intro-footer">
          <button type="button" className="rpgui-button golden story-intro-button" onClick={onConfirm}>
            <p className="revert-top">{remaining > 0 ? 'Next' : 'Got it'}</p>
          </button>
        </div>
        {remaining > 0 && <span className="story-intro-progress">+{remaining} more</span>}
      </div>
    </div>
  </>
);

export default DiscoveryPopup;
