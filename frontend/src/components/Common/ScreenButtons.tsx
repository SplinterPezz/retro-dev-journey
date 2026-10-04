import React from 'react';
import FullscreenButton from './FullscreenButton';
import OrientationToggleButton from './OrientationToggleButton';
import '../AudioControls/AudioControls.css';

const ScreenButtons: React.FC = () => (
  <div className="volume-position">
    <div className="audio-container">
      <OrientationToggleButton />
      <FullscreenButton />
    </div>
  </div>
);

export default ScreenButtons;
