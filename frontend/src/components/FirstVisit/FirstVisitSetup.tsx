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

// The one-time questions before the first game, whichever mode is opened first
// (Story or Sandbox): on phones how to hold it, then on every device whether
// to play with sound. Each is asked once and saved; afterwards `children` (the
// page) is shown straight away, and is not mounted before then.
const FirstVisitSetup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const orientation = useSelector((state: RootState) => state.story.orientation);
  // `!!` also catches settings saved before the field existed (undefined)
  const soundAsked = useSelector((state: RootState) => !!state.settings.soundAsked);
  // Decided once, when the page opens: a desktop that later turns into a phone
  // is not asked. Phones are asked until they have picked an orientation.
  const [isPhoneOnOpen] = useState(() => isMobileDevice());

  const handleOrientation = (choice: StoryOrientation) => {
    dispatch(setOrientation(choice));
    if (isLandscape(choice)) {
      void enterLandscape(choice);
    }
  };

  // `!orientation` also catches saves made before the field existed (undefined).
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
