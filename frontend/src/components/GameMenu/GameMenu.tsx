import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { Backpack, Code, House, X } from 'lucide-react';
import { RootState } from '../../store/store';
import { ROUTES } from '../../config/routes';
import { collectionTexts, menuProfile } from '../../config/menu';
import { storyDifficultyLabels } from '../../config/story/difficulty';
import MusicControl from './MusicControl';
import DialogueSoundControl from './DialogueSoundControl';
import { useGameMenu } from './GameMenuContext';
import CollectionView from './CollectionView';
import ItemInspector from './ItemInspector';
import { CollectionEntry, useCollection } from './useCollections';
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

type MenuView = 'main' | 'items' | 'skills';

const GameMenu: React.FC<GameMenuProps> = ({ withMusic }) => {
  const navigate = useNavigate();
  const { close } = useGameMenu();
  const difficulty = useSelector((state: RootState) => state.story.difficulty);
  const [view, setView] = useState<MenuView>('main');
  const [inspected, setInspected] = useState<CollectionEntry | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [boxSize, setBoxSize] = useState<{ width: number; height: number } | null>(null);
  const entries = useCollection(view === 'skills' ? 'skills' : 'items');

  // the window keeps the size of the main menu in the item and skill lists
  const openCollection = (kind: 'items' | 'skills') => {
    const rect = boxRef.current?.getBoundingClientRect();
    if (rect) setBoxSize({ width: rect.width, height: rect.height });
    setView(kind);
  };

  const backToMenu = () => {
    setView('main');
    setBoxSize(null);
  };

  return (
    <>
      <div className="story-intro-backdrop game-menu-backdrop" />
      <div className="story-intro-dialog game-menu-dialog" role="dialog" aria-label="Menu">
        <div
          ref={boxRef}
          className="rpgui-container framed-golden story-intro-box game-menu-box"
          style={boxSize ? { width: boxSize.width, height: boxSize.height, boxSizing: 'border-box' } : undefined}
        >
          <button type="button" className="rpgui-button story-intro-exit game-menu-close" onClick={close} aria-label="Close the menu">
            <X size={20} color="white" strokeWidth={3} className="volume-filter" />
          </button>

          {view !== 'main' && (
            <CollectionView
              title={view === 'items' ? collectionTexts.items : collectionTexts.skills}
              theme={view}
              entries={entries}
              onBack={backToMenu}
              onInspect={setInspected}
            />
          )}

          {view === 'main' && (
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
                  <button type="button" className="rpgui-button golden game-menu-entry" onClick={() => openCollection('items')}>
                    <p>
                      <Backpack size={20} color="white" className="volume-filter" aria-hidden="true" />
                      Items
                    </p>
                  </button>
                  <button type="button" className="rpgui-button golden game-menu-entry" onClick={() => openCollection('skills')}>
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
          )}
        </div>
      </div>
      {inspected && <ItemInspector entry={inspected} onClose={() => setInspected(null)} />}
    </>
  );
};

export default GameMenu;
