import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RectangleHorizontal, RectangleVertical } from 'lucide-react';
import { AppDispatch, RootState } from '../../store/store';
import { setOrientation } from '../../store/storySlice';
import { useIsMobile } from './useIsMobile';
import { enterLandscape, isLandscape, isPortraitViewport, unlockOrientation } from './screenOrientation';

interface OrientationToggleButtonProps {
  golden?: boolean;
}

// Mobile-only switch between portrait and landscape, always visible. The icon
// shows the layout a tap will switch to: horizontal while upright, vertical
// while in landscape.
const OrientationToggleButton: React.FC<OrientationToggleButtonProps> = ({ golden = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const orientation = useSelector((state: RootState) => state.story.orientation);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const landscape = isLandscape(orientation);

  const toggle = () => {
    // Landscape was chosen but the phone is upright (e.g. after the browser was
    // reopened, which drops the screen lock): a tap asks for the lock again.
    if (landscape && isPortraitViewport()) {
      enterLandscape(orientation as 'landscape-primary' | 'landscape-secondary');
      return;
    }
    if (landscape) {
      dispatch(setOrientation('portrait'));
      unlockOrientation();
    } else {
      dispatch(setOrientation('landscape-primary'));
      enterLandscape('landscape-primary');
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
