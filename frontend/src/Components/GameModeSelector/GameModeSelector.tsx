import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameModeSelector.css';

const GameModeSelector: React.FC = () => {
  const navigate = useNavigate();
  const [backgroundVisible, setBackgroundVisible] = useState(true);

  const handleStoryMode = () => {
    console.log('Story Mode clicked!');
    navigate('/story');
  };

  const handleSandboxMode = () => {
    console.log('Sandbox Mode clicked!');
    navigate('/sandbox');
  };

  const toggleBackground = () => {
    setBackgroundVisible(!backgroundVisible);
  };

  return (
    <div className="game-mode-selector">
      <div 
        className="rpgui-container framed-golden w-100"
        style={{
          background: backgroundVisible ? 'rgba(0, 0, 0, 0.1)' : 'rgb(133 76 48)',
          backdropFilter: backgroundVisible ? 'blur(2px)' : 'none'
        }}
      >
        <h2 className="title-gamemode-box mb-3 mb-md-4 " >
          Get to Know{' '}
          <span 
            className="easter-egg-btn"
            onClick={toggleBackground}
            title=""
          >
            Me
          </span>
           !
        </h2>

        <div className="game-mode-description">
          <p>Pick your preferred way to discover my journey</p>
        </div>

        <div className="game-mode-buttons-container">
          <label className="game-mode-label">
            Exploration Modes:
          </label>

          <div className="game-mode-buttons">
            <button
              className="rpgui-button golden gamemode-button-size"
              type="button"
              onClick={handleStoryMode}
              disabled
            >
              <p className='revert-top'>Story Mode</p>
            </button>

            <button
              className="rpgui-button golden gamemode-button-size"
              type="button"
              onClick={handleSandboxMode}
            >
              <p className='revert-top'>Sandbox</p>
            </button>
          </div>
        </div>

        <div className="game-mode-footer">
          <hr className="golden" />
          <p className="game-mode-hint">
            Choose wisely, adventurer!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelector;