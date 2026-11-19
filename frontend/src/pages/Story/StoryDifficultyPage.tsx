import React from 'react';
import { Navigate } from 'react-router';
import { setDifficulty } from '../../store/storySlice';
import { StoryDifficulty } from '../../types/story';
import { storyDifficultyLabels } from '../../config/story/difficulty';
import MenuButton from '../../components/GameMenu/MenuButton';
import FirstVisitSetup from '../../components/FirstVisit/FirstVisitSetup';
import { ROUTES } from '../../config/routes';
import '../../components/Common/fullscreen-page.css';
import './StoryDifficultyPage.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const difficulties: StoryDifficulty[] = ['junior', 'middle', 'senior'];

const StoryDifficultyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const difficulty = useAppSelector((state) => state.story.difficulty);

  const handleSelect = (level: StoryDifficulty) => {
    dispatch(setDifficulty(level));
  };

  if (difficulty) {
    return <Navigate to={ROUTES.storyMap} replace />;
  }

  return (
    <FirstVisitSetup>
      <div className="story-difficulty-page fullscreen-page">
        <div className="menu-fixed-top-left">
          <MenuButton withMusic={false} />
        </div>
        <div className="rpgui-container framed-golden story-difficulty-box">
          <h2 className="story-difficulty-title">Are you a developer?</h2>
          <p className="story-difficulty-hint">There are a few tech questions in this game</p>
          <div className="story-difficulty-buttons">
            {difficulties.map((level) => (
              <button
                key={level}
                type="button"
                className="rpgui-button golden story-difficulty-button"
                onClick={() => handleSelect(level)}
              >
                <p className="revert-top">{storyDifficultyLabels[level]}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </FirstVisitSetup>
  );
};

export default StoryDifficultyPage;
