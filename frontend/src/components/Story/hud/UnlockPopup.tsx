import React from 'react';
import { Rarity } from '../../../types/game';
import RarityBadge from '../../Common/RarityBadge';
import ElapsedTime from '../../Common/ElapsedTime';
import '../dialogue/StoryIntroDialog.css';
import './UnlockPopup.css';

interface UnlockPopupProps {
  kicker: string;
  image: string;
  title: string;
  subtitle?: string;
  text: string;
  note?: string;
  cornerImage?: string;
  rarity?: Rarity;
  elapsedMs?: number;
  remaining: number;
  onConfirm: () => void;
}

const UnlockPopup: React.FC<UnlockPopupProps> = ({ kicker, image, title, subtitle, text, note, cornerImage, rarity, elapsedMs, remaining, onConfirm }) => (
  <>
    <div className="story-intro-backdrop" />
    <div className="story-intro-dialog" role="dialog" aria-labelledby="unlock-title">
      <div className={`rpgui-container framed-golden story-intro-box unlock-box${rarity ? ` rarity--${rarity}` : ''}`}>
        {cornerImage && <img src={cornerImage} alt="" className="unlock-corner" />}
        <p className="unlock-kicker">{kicker}</p>
        {rarity && (
          <div className="unlock-tags">
            <RarityBadge rarity={rarity} />
            <ElapsedTime ms={elapsedMs} />
          </div>
        )}
        <img src={image} alt="" className={`unlock-sprite${rarity ? ' unlock-sprite--rarity' : ''}`} />
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
