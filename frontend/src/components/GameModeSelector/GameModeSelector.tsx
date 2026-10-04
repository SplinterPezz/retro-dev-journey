import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { resetStory } from '../../store/storySlice';
import { ROUTES } from '../../config/routes';
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
  storyInProgressTitle,
  storyInProgressDescription,
  storyInProgressWarning,
  continueStoryButtonText,
  newStoryButtonText,
  storyInProgressBackText,
} from '../../config/gameModeSelector';

interface GameSelectorProps {
  handleDownloadClick(platform:string): void
}

const GameModeSelector: React.FC<GameSelectorProps> = ({ handleDownloadClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const hasStory = useSelector((state: RootState) => state.story.difficulty !== null);
  const [backgroundVisible, setBackgroundVisible] = useState(true);
  const [askingStory, setAskingStory] = useState(false);

  const handleStoryMode = () => {
    if (hasStory) {
      setAskingStory(true);
    } else {
      void navigate(ROUTES.storyDifficulty);
    }
  };

  const handleContinueStory = () => {
    void navigate(ROUTES.storyMap);
  };

  const handleNewStory = () => {
    dispatch(resetStory());
    void navigate(ROUTES.storyDifficulty);
  };

  const handleSandboxMode = () => {
    void navigate(ROUTES.sandbox);
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
        {askingStory ? (
          <>
            <h2 className="title-gamemode-box mb-3 mb-md-4">{storyInProgressTitle}</h2>

            <div className="game-mode-description">
              <p>{storyInProgressDescription}</p>
            </div>

            <div className="game-mode-buttons mt-2">
              <button className="rpgui-button golden gamemode-button-size" type="button" onClick={handleContinueStory}>
                <p className='revert-top'>{continueStoryButtonText}</p>
              </button>
              <button className="rpgui-button golden gamemode-button-size" type="button" onClick={handleNewStory}>
                <p className='revert-top'>{newStoryButtonText}</p>
              </button>
            </div>

            <div className="game-mode-footer">
              <hr className="golden" />
              <p className="game-mode-hint">{storyInProgressWarning}</p>
              <button className="rpgui-button mt-3" type="button" onClick={() => setAskingStory(false)}>
                <p className='revert-top'>{storyInProgressBackText}</p>
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="title-gamemode-box mb-3 mb-md-4 " >
              {gameModeTitlePrefix}{' '}
              {easterEggEnabled ? (
                <button type="button" className="easter-egg-btn" onClick={toggleBackground} aria-pressed={backgroundVisible}>
                  {gameModeTitleEasterEggWord}
                </button>
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
                onClick={() => handleDownloadClick('download')}
              >
                <p className='revert-top'>{downloadCVButtonText}</p>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameModeSelector;