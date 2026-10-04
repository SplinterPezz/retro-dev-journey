import React from 'react';
import FullscreenButton from './FullscreenButton';
import OrientationToggleButton from './OrientationToggleButton';
import '../AudioControls/AudioControls.css';

// Top-right corner of the game screens, phones only: landscape / portrait and
// fullscreen. Each button hides itself on desktop, so nothing shows there.
// (The music controls moved into the game menu.)
const ScreenButtons: React.FC = () => (
  <div className="volume-position">
    <div className="audio-container">
      <OrientationToggleButton />
      <FullscreenButton />
    </div>
  </div>
);

export default ScreenButtons;
