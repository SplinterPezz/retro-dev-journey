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
          <OrientationToggleButton golden={buttonStyle === 'golden'} />
          <FullscreenButton golden={buttonStyle === 'golden'} />

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

        {showVolumeControls && (
          <div
            className={`volume-buttons-container rpgui-container ${containerStyle} d-none d-sm-flex`}
          >
            {showVolumePercentage && (
              <span className='volume-text-percentage'>
                {volume}%
              </span>
            )}

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