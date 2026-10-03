import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { setDifficulty, setOrientation } from '../../store/storySlice';
import { StoryDifficulty, StoryOrientation } from '../../types/story';
import { storyDifficultyLabels } from '../../config/story/difficulty';
import HomeButton from '../../Components/Common/HomeButton';
import { isMobileDevice } from '../../hooks/useIsMobile';
import { enterLandscape, isLandscape } from '../../hooks/screenOrientation';
import OrientationChoice from './OrientationChoice';
import '../../Components/Common/fullscreen-page.css';
import './StoryDifficultyPage.css';

const difficulties: StoryDifficulty[] = ['junior', 'middle', 'senior'];

const StoryDifficultyPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const orientation = useSelector((state: RootState) => state.story.orientation);
  // Decided once, when the page opens: a desktop that later turns into a phone
  // is not asked. Phones are asked until they have picked an orientation.
  const [isPhoneOnOpen] = useState(() => isMobileDevice());

  const handleSelect = (level: StoryDifficulty) => {
    dispatch(setDifficulty(level));
    navigate('/story');
  };

  const handleOrientation = (choice: StoryOrientation) => {
    dispatch(setOrientation(choice));
    if (isLandscape(choice)) {
      enterLandscape(choice);
    }
  };

  // `!orientation` also catches saves made before the field existed (undefined).
  if (isPhoneOnOpen && !orientation) {
    return (
      <>
        <div className="home-fixed-top-left">
          <HomeButton />
        </div>
        <OrientationChoice onChoose={handleOrientation} />
      </>
    );
  }

  return (
    <div className="story-difficulty-page fullscreen-page">
      <div className="home-fixed-top-left">
        <HomeButton />
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
  );
};

export default StoryDifficultyPage;
