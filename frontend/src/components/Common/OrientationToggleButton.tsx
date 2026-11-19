import React from 'react';
import { RectangleHorizontal, RectangleVertical } from 'lucide-react';
import { setOrientation } from '../../store/storySlice';
import { useIsMobile } from '../../hooks/useIsMobile';
import { enterLandscape, isLandscape, isPortraitViewport, unlockOrientation } from '../../hooks/screenOrientation';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

interface OrientationToggleButtonProps {
  golden?: boolean;
}

const OrientationToggleButton: React.FC<OrientationToggleButtonProps> = ({ golden = false }) => {
  const dispatch = useAppDispatch();
  const orientation = useAppSelector((state) => state.story.orientation);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const landscape = isLandscape(orientation);

  const toggle = () => {
    // reopening the browser drops the screen lock: a tap asks for it again
    if (landscape && isPortraitViewport()) {
      void enterLandscape(orientation as 'landscape-primary' | 'landscape-secondary');
      return;
    }
    if (landscape) {
      dispatch(setOrientation('portrait'));
      unlockOrientation();
    } else {
      dispatch(setOrientation('landscape-primary'));
      void enterLandscape('landscape-primary');
    }
  };

  const Icon = landscape ? RectangleVertical : RectangleHorizontal;

  return (
    <button
      className={`unmute-controls rpgui-button ${golden ? 'golden' : ''}`}
      type="button"
      onClick={toggle}
      title={landscape ? 'Switch to portrait' : 'Switch to landscape'}
    >
      <Icon size={24} color="white" className="volume-filter" />
    </button>
  );
};

export default OrientationToggleButton;
