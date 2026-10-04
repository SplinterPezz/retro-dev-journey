import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VolumeX, Volume2, ChevronUp, ChevronDown, Headphones } from 'lucide-react';
import FullscreenButton from '../Common/FullscreenButton';
import OrientationToggleButton from '../Common/OrientationToggleButton';
import { AppDispatch, RootState } from '../../store/store';
import { setMusicMuted, setMusicVolume } from '../../store/settingsSlice';
import { useBackgroundMusic } from '../../hooks/useBackgroundMusic';
import './AudioControls.css'

interface AudioControlsProps {
  audioSrc: string;
  className?: string;
  showVolumePercentage?: boolean;
  containerStyle?: 'framed' | 'framed-golden' | 'framed-grey';
  buttonStyle?: 'normal' | 'golden';
  volumeStep?: number;
}

// The home page's music controls: volume up / down and mute. Volume and mute
// are the same saved setting the game menu changes (state.settings), so a
// choice made here holds on every page, and the other way round.
const AudioControls: React.FC<AudioControlsProps> = ({
  audioSrc,
  className = '',
  showVolumePercentage = true,
  containerStyle = 'framed-grey',
  buttonStyle = 'normal',
  volumeStep = 10
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { musicVolume: volume, musicMuted: isMuted } = useSelector((state: RootState) => state.settings);
  const [showVolumeControls, setShowVolumeControls] = useState(false);
  useBackgroundMusic(audioSrc);

  const toggleMute = () => dispatch(setMusicMuted(!isMuted));

  const toggleVolumeControls = () => {
    setShowVolumeControls(!showVolumeControls);
  };

  // Raising the volume turns muted music back on; lowering it to 0 mutes it.
  const increaseVolume = () => {
    const newVolume = Math.min(volume + volumeStep, 100);
    dispatch(setMusicVolume(newVolume));
    if (newVolume > 0 && isMuted) dispatch(setMusicMuted(false));
  };

  const decreaseVolume = () => {
    const newVolume = Math.max(volume - volumeStep, 0);
    dispatch(setMusicVolume(newVolume));
    if (newVolume === 0 && !isMuted) dispatch(setMusicMuted(true));
  };

  return (
    <div className={`rpgui-content`}>
      <div className={`volume-position ${className}`}>
        <div className='audio-container'>
          {/* Mobile only: sit to the left of the volume controls */}
          <OrientationToggleButton golden={buttonStyle === 'golden'} />
          <FullscreenButton golden={buttonStyle === 'golden'} />

          {/* Volume Controls Button */}
          <button
            className={`volume-controls d-none d-sm-block rpgui-button ${buttonStyle === 'golden' ? 'golden' : ''}`}
            type="button"
            onClick={toggleVolumeControls}
            title="Volume Controls"
          >
            <Headphones
              size={24}
              color="white"
              className="volume-filter"
            />
          </button>

          {/* Mute/Unmute Button */}
          <button
            className={`unmute-controls rpgui-button ${buttonStyle === 'golden' ? 'golden' : ''}`}
            type="button"
            onClick={toggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX
                size={24}
                color="white"
                className="volume-filter"
              />
            ) : (
              <Volume2
                size={24}
                color="white"
                className="volume-filter"
              />
            )}
          </button>
        </div>

        {/* Volume Arrow Controls */}
        {showVolumeControls && (
          <div
            className={`volume-buttons-container rpgui-container ${containerStyle} d-none d-sm-flex`}
          >
            {showVolumePercentage && (
              <span className='volume-text-percentage'>
                {volume}%
              </span>
            )}

            {/* Volume Up Button */}
            <button
              className={`volume-buttons rpgui-button ${buttonStyle === 'golden' ? 'golden' : ''}`}
              type="button"
              onClick={increaseVolume}
              title={`Increase Volume (+${volumeStep}%)`}
              disabled={volume >= 100}
            >
              <ChevronUp
                size={18}
                color="white"
                className={`volume-filter ${volume < 100 ? '' : 'opacity-not-loaded'}`}
              />
            </button>

            {/* Volume Down Button */}
            <button
              className={`volume-buttons rpgui-button ${buttonStyle === 'golden' ? 'golden' : ''}`}
              type="button"
              onClick={decreaseVolume}
              title={`Decrease Volume (-${volumeStep}%)`}
              disabled={volume <= 0}
            >
              <ChevronDown
                size={18}
                color="white"
                className={`volume-filter ${volume > 0 ? '' : 'opacity-not-loaded'}`}
              />
            </button>

            <label className='volume-text'>
              Volume
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioControls;