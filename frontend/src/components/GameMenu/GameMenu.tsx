import React from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { Backpack, Code, House, X } from 'lucide-react';
import { RootState } from '../../store/store';
import { ROUTES } from '../../config/routes';
import { menuProfile } from '../../config/menu';
import { storyDifficultyLabels } from '../../config/story/difficulty';
import MusicControl from './MusicControl';
import DialogueSoundControl from './DialogueSoundControl';
import { useGameMenu } from './GameMenuContext';
import '../Story/dialogue/StoryIntroDialog.css';
import '../AudioControls/AudioControls.css';
import './GameMenu.css';

interface GameMenuProps {
  withMusic: boolean;
}

const GoldenSeparator = () => (
  <div className="dialog-separator">
    <hr className="golden" />
  </div>
);

const GameMenu: React.FC<GameMenuProps> = ({ withMusic }) => {
  const navigate = useNavigate();
  const { close } = useGameMenu();
  const difficulty = useSelector((state: RootState) => state.story.difficulty);

  return (
    <>
      <div className="story-intro-backdrop game-menu-backdrop" />
      <div className="story-intro-dialog game-menu-dialog" role="dialog" aria-label="Menu">
        <div className="rpgui-container framed-golden story-intro-box game-menu-box">
          <button type="button" className="rpgui-button story-intro-exit game-menu-close" onClick={close} aria-label="Close the menu">
            <X size={20} color="white" strokeWidth={3} className="volume-filter" />
          </button>

          <div className="game-menu-columns">
            <div className="game-menu-column">
              <div className="game-menu-profile">
                <div className="game-menu-portrait">
                  <img src={menuProfile.portrait} alt="" />
                </div>
                <div className="game-menu-identity">
                  <p className="game-menu-name">{menuProfile.name}</p>
                  <p className="game-menu-detail">{menuProfile.profession}</p>
                  {difficulty && <p className="game-menu-detail">{storyDifficultyLabels[difficulty]}</p>}
                </div>
              </div>

              <GoldenSeparator />

              <div className="game-menu-entries">
                <button type="button" className="rpgui-button golden game-menu-entry" onClick={() => void navigate(ROUTES.home)}>
                  <p>
                    <House size={20} color="white" className="volume-filter" aria-hidden="true" />
                    Home
                  </p>
                </button>
              </div>
            </div>

            <div className="game-menu-column game-menu-column-right">
              <div className="game-menu-entries">
                <button type="button" className="rpgui-button golden game-menu-entry">
                  <p>
                    <Backpack size={20} color="white" className="volume-filter" aria-hidden="true" />
                    Items
                  </p>
                </button>
                <button type="button" className="rpgui-button golden game-menu-entry">
                  <p>
                    <Code size={20} color="white" className="volume-filter" aria-hidden="true" />
                    Skills
                  </p>
                </button>
              </div>

              <GoldenSeparator />
              {withMusic && <MusicControl />}
              <DialogueSoundControl />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameMenu;
