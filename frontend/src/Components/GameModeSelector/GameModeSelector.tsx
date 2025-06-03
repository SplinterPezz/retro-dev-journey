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
        <h2 className="mb-3 mb-md-4" style={{ color: '#ffd700', fontSize: 'clamp(1.2rem, 4vw, 1.0rem)' }}>
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
              className="rpgui-button golden"
              type="button"
              onClick={handleStoryMode}
              style={{ width: "200px" }}
              disabled
            >
              <p style={{marginTop:"revert"}}>Story Mode</p>
            </button>

            <button
              className="rpgui-button golden"
              type="button"
              onClick={handleSandboxMode}
              style={{ width: "200px" }}
            >
              <p style={{marginTop:"revert"}}>Sandbox</p>
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