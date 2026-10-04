import React from 'react';
import '../dialogue/StoryIntroDialog.css';
import './UnlockPopup.css';

export interface UnlockPopupProps {
  kicker: string; // e.g. "New technology unlocked!"
  image: string;
  title: string;
  subtitle?: string; // e.g. the technology's category
  text: string;
  note?: string; // a closing line, e.g. where it now shows up
  cornerImage?: string; // peeks out of the card's top-right corner (e.g. Meep cheering)
  remaining: number; // still to show after this one
  onConfirm: () => void;
}

// "You got something" window: a technology after a chapter, a collectible
// when it is found. Same backdrop and golden frame as the chapter intro.
const UnlockPopup: React.FC<UnlockPopupProps> = ({ kicker, image, title, subtitle, text, note, cornerImage, remaining, onConfirm }) => (
  <>
    <div className="story-intro-backdrop" />
    <div className="story-intro-dialog" role="dialog" aria-labelledby="unlock-title">
      <div className="rpgui-container framed-golden story-intro-box unlock-box">
        {cornerImage && <img src={cornerImage} alt="" className="unlock-corner" />}
        <p className="unlock-kicker">{kicker}</p>
        <img src={image} alt="" className="unlock-sprite" />
        <h2 id="unlock-title" className="story-intro-title">{title}</h2>
        {subtitle && <p className="unlock-subtitle">{subtitle}</p>}
        <div className="dialog-separator">
          <hr className="golden" />
        </div>
        <p className="story-intro-text">{text}</p>
        {note && <p className="unlock-note">{note}</p>}
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

export default UnlockPopup;
