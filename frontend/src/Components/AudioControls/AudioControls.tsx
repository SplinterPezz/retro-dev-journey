import React, { useState, useEffect, useRef } from 'react';
import { VolumeX, Volume2, ChevronUp, ChevronDown, Headphones } from 'lucide-react';
import './AudioControls.css'

interface AudioControlsProps {
  audioSrc: string;
  className?: string;
  defaultVolume?: number;
  defaultMuted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  showVolumePercentage?: boolean;
  containerStyle?: 'framed' | 'framed-golden' | 'framed-grey';
  buttonStyle?: 'normal' | 'golden';
  volumeStep?: number;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  audioSrc,
  className = '',
  defaultVolume = 30,
  defaultMuted = true,
  loop = true,
  autoPlay = false,
  showVolumePercentage = true,
  containerStyle = 'framed-grey',
  buttonStyle = 'normal',
  volumeStep = 10
}) => {
  const [isMuted, setIsMuted] = useState(defaultMuted);
  const [volume, setVolume] = useState(defaultVolume);
  const [showVolumeControls, setShowVolumeControls] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
      audioRef.current.loop = loop;

      if (autoPlay && !isMuted) {
        audioRef.current.play().catch(console.error);
      }
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    } else {
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const toggleVolumeControls = () => {
    setShowVolumeControls(!showVolumeControls);
  };

  const increaseVolume = () => {
    const newVolume = Math.min(volume + volumeStep, 100);
    setVolume(newVolume);

    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  const decreaseVolume = () => {
    const newVolume = Math.max(volume - volumeStep, 0);
    setVolume(newVolume);

    if (newVolume === 0 && !isMuted) {
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const handleAudioLoad = () => {
    setIsLoaded(true);
  };

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error('Audio failed to load:', audioSrc, e);
  };

  return (
    <div className={`rpgui-content`}>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        onLoadedData={handleAudioLoad}
        onError={handleAudioError}
      />

      <div className={`volume-position ${className}`}>
        <div className='audio-container'>
          {/* Volume Controls Button */}
          <button
            className={`volume-controls d-none d-sm-block rpgui-button ${buttonStyle === 'golden' ? 'golden' : ''}`}
            type="button"
            onClick={toggleVolumeControls}
            title="Volume Controls"
            disabled={!isLoaded}
          >
            <Headphones
              size={24}
              color="white"
              className={`volume-filter ${isLoaded ? '' : 'opacity-not-loaded'}`}
            />
          </button>

          {/* Mute/Unmute Button */}
          <button
            className={`unmute-controls rpgui-button ${buttonStyle === 'golden' ? 'golden' : ''}`}
            type="button"
            onClick={toggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            disabled={!isLoaded}
          >
            {isMuted ? (
              <VolumeX
                size={24}
                color="white"
                className={`volume-filter ${isLoaded ? '':'opacity-not-loaded'}`}
              />
            ) : (
              <Volume2
                size={24}
                color="white"
                className={`volume-filter ${isLoaded ? '':'opacity-not-loaded'}`}
              />
            )}
          </button>
        </div>

        {/* Volume Arrow Controls */}
        {showVolumeControls && (
          <div
            className={`volume-buttons-container rpgui-container ${containerStyle}`}
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
              disabled={!isLoaded || volume >= 100}
            >
              <ChevronUp
                size={18}
                color="white"
                className={`volume-filter ${(isLoaded && volume < 100) ? '':'opacity-not-loaded'}`}
              />
            </button>

            {/* Volume Down Button */}
            <button
              className={`volume-buttons rpgui-button ${buttonStyle === 'golden' ? 'golden' : ''}`}
              type="button"
              onClick={decreaseVolume}
              title={`Decrease Volume (-${volumeStep}%)`}
              disabled={!isLoaded || volume <= 0}
            >
              <ChevronDown
                size={18}
                color="white"
                className={`volume-filter ${(isLoaded && volume > 0)? '' : 'opacity-not-loaded'}`}
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