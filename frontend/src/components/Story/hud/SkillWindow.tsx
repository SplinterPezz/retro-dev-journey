import React from 'react';
import { Binoculars, Search, SquareDashedMousePointer } from 'lucide-react';
import { collectionTexts } from '../../../config/menu';
import RarityBadge from '../../Common/RarityBadge';
import { CollectionEntry } from '../../GameMenu/useCollections';
import '../../AudioControls/AudioControls.css';
import './SkillWindow.css';

interface SkillWindowProps {
  entry: CollectionEntry;
  chapterName: string;
  onInspect: () => void;
}

// Like the Sandbox structure dialog: shown while the player walks past the statue, never in the way.
const SkillWindow: React.FC<SkillWindowProps> = ({ entry, chapterName, onInspect }) => (
  <div className="skill-window" role="dialog" aria-labelledby="skill-window-title">
    <div className="rpgui-container framed-golden skill-window-box">
      <div className="skill-window-header">
        <div className={`skill-window-preview rarity--${entry.rarity}`}>
          <img src={entry.image} alt="" />
        </div>
        <div className="skill-window-identity">
          <h2 id="skill-window-title" className="skill-window-name">
            {entry.name}
          </h2>
          <p className="skill-window-chapter">
            {collectionTexts.unlockedIn} {chapterName}
          </p>
          <RarityBadge rarity={entry.rarity} />
        </div>
      </div>

      <div className="dialog-separator">
        <hr className="golden" />
      </div>

      <div className="skill-window-actions">
        <button type="button" className="rpgui-button golden skill-window-inspect" onClick={onInspect}>
          <p>
            <SquareDashedMousePointer size={18} color="white" className="volume-filter" aria-hidden="true" />
            {collectionTexts.inspect}
          </p>
        </button>
      </div>
    </div>
  </div>
);

export default SkillWindow;
