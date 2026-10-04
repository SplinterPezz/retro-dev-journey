import React, { useEffect, useState } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useIsMobile } from '../../hooks/useIsMobile';
import { isLandscape } from '../../hooks/screenOrientation';

interface FullscreenButtonProps {
  golden?: boolean;
}

// iOS Safari has no Fullscreen API for pages: the button hides where it is unsupported.
const FullscreenButton: React.FC<FullscreenButtonProps> = ({ golden = false }) => {
  const isMobile = useIsMobile();
  const orientation = useSelector((state: RootState) => state.story.orientation);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const supported = typeof document !== 'undefined'
    && document.fullscreenEnabled === true
    && typeof document.documentElement.requestFullscreen === 'function';

  useEffect(() => {
    const sync = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  if (!isMobile || !supported || isLandscape(orientation)) return null;

  const toggle = () => {
    const request = document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
    request.catch(() => { /* the browser refused (e.g. not from a user gesture) */ });
  };

  const Icon = isFullscreen ? Minimize : Maximize;

  return (
    <button
      className={`unmute-controls rpgui-button ${golden ? 'golden' : ''}`}
      type="button"
      onClick={toggle}
      title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
    >
      <Icon size={24} color="white" className="volume-filter" />
    </button>
  );
};

export default FullscreenButton;
