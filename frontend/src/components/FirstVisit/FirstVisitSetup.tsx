import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { setOrientation } from '../../store/storySlice';
import { chooseSound } from '../../store/settingsSlice';
import { StoryOrientation } from '../../types/story';
import MenuButton from '../GameMenu/MenuButton';
import { isMobileDevice } from '../../hooks/useIsMobile';
import { enterLandscape, isLandscape } from '../../hooks/screenOrientation';
import OrientationChoice from './OrientationChoice';
import SoundChoice from './SoundChoice';

// Asked once before the first game, Story or Sandbox: orientation (phones), then sound.
const FirstVisitSetup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const orientation = useSelector((state: RootState) => state.story.orientation);
  const soundAsked = useSelector((state: RootState) => !!state.settings.soundAsked);
  // a desktop that later turns into a phone is not asked
  const [isPhoneOnOpen] = useState(() => isMobileDevice());

  const handleOrientation = (choice: StoryOrientation) => {
    dispatch(setOrientation(choice));
    if (isLandscape(choice)) {
      void enterLandscape(choice);
    }
  };

  const question =
    isPhoneOnOpen && !orientation ? (
      <OrientationChoice onChoose={handleOrientation} />
    ) : !soundAsked ? (
      <SoundChoice onChoose={(soundOn) => dispatch(chooseSound(soundOn))} />
    ) : null;

  if (!question) return <>{children}</>;
  return (
    <>
      <div className="menu-fixed-top-left">
        <MenuButton withMusic={false} />
      </div>
      {question}
    </>
  );
};

export default FirstVisitSetup;
