import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameModeSelector.css';

const GameModeSelector: React.FC = () => {
  const navigate = useNavigate();

  const handleStoryMode = () => {
    console.log('Story Mode clicked!');
    navigate('/story');
  };

  const handleSandboxMode = () => {
    console.log('Sandbox Mode clicked!');
    navigate('/sandbox');
  };

  return (
    <div className="game-mode-selector">
      <div className="rpgui-container framed-golden">
        <h2 className="game-mode-title">Get to Know Me!</h2>

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
              style={{width:"200px"}}
              disabled
            >
              <p>Story Mode</p>
            </button>

            <button 
              className="rpgui-button golden" 
              type="button" 
              onClick={handleSandboxMode}
              style={{width:"200px"}}
            >
              <p>Sandbox</p>
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