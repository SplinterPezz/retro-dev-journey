import React, { MouseEventHandler, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameModeSelector.css';
import {
  gameModeTitlePrefix,
  gameModeTitleEasterEggWord,
  gameModeTitleSuffix,
  gameModeDescription,
  explorationModesLabel,
  storyModeButtonText,
  sandboxModeButtonText,
  gameModeHint,
  downloadCVButtonText,
  storyModeEnabled,
  storyModeVisible,
  sandboxModeVisible,
  easterEggEnabled,
  easterEggBlurAmount,
} from '../../config/gameModeSelector';

interface GameSelectorProps {
  handleDownloadClick(platform:string): void
}

const GameModeSelector: React.FC<GameSelectorProps> = ({ handleDownloadClick }) => {
  const navigate = useNavigate();
  const [backgroundVisible, setBackgroundVisible] = useState(true);

  const handleStoryMode = () => {
    navigate('/story');
  };

  const handleSandboxMode = () => {
    navigate('/sandbox');
  };

  const toggleBackground = () => {
    if (!easterEggEnabled) {
      return;
    }
    setBackgroundVisible(!backgroundVisible);
  };

  return (
    <div className="game-mode-selector">
      <div 
        className="rpgui-container framed-golden w-100"
        style={{
          background: backgroundVisible ? 'rgba(0, 0, 0, 0.1)' : 'rgb(133 76 48)',
          backdropFilter: backgroundVisible ? `blur(${easterEggBlurAmount}px)` : 'none'
        }}
      >
        <h2 className="title-gamemode-box mb-3 mb-md-4 " >
          {gameModeTitlePrefix}{' '}
          {easterEggEnabled ? (
            <span
              className="easter-egg-btn"
              onClick={toggleBackground}
              title=""
            >
              {gameModeTitleEasterEggWord}
            </span>
          ) : (
            <span>{gameModeTitleEasterEggWord}</span>
          )}
          {gameModeTitleSuffix}
        </h2>

        <div className="game-mode-description">
          <p>{gameModeDescription}</p>
        </div>

        <div className="game-mode-buttons-container">
          <label className="game-mode-label">
            {explorationModesLabel}
          </label>

          <div className="game-mode-buttons mt-2">
            {storyModeVisible && (
              <button
                className="rpgui-button golden gamemode-button-size"
                type="button"
                onClick={handleStoryMode}
                disabled={!storyModeEnabled}
              >
                <p className='revert-top'>{storyModeButtonText}</p>
              </button>
            )}

            {sandboxModeVisible && (
              <button
                className="rpgui-button golden gamemode-button-size"
                type="button"
                onClick={handleSandboxMode}
              >
                <p className='revert-top'>{sandboxModeButtonText}</p>
              </button>
            )}
          </div>
        </div>

        <div className="game-mode-footer">
          <hr className="golden" />
          <p className="game-mode-hint">
            {gameModeHint}
          </p>

          <button
            className="rpgui-button mt-3"
            type="button"
            style={{width:"250px"}}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {handleDownloadClick('download')}}
          >
            <p className='revert-top'>{downloadCVButtonText}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelector;