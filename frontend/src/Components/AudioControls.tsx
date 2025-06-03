// src/Components/AudioControls.tsx
import React, { useState, useEffect, useRef } from 'react';
import { VolumeX, Volume2, ChevronUp, ChevronDown, Headphones } from 'lucide-react';

interface AudioControlsProps {
  audioSrc: string;
  className?: string;
  defaultVolume?: number;
  defaultMuted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
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
  position = 'top-right',
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

  const getPositionStyle = () => {
    const baseStyle = {
      position: 'fixed' as const,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '10px',
      alignItems: 'flex-end' as const
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyle, top: '20px', left: '20px', alignItems: 'flex-start' as const };
      case 'bottom-right':
        return { ...baseStyle, bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { ...baseStyle, bottom: '20px', left: '20px', alignItems: 'flex-start' as const };
      default:
        return { ...baseStyle, top: '20px', right: '20px' };
    }
  };

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
    <div className={`rpgui-content ${className}`}>
      <audio 
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        onLoadedData={handleAudioLoad}
        onError={handleAudioError}
      />
      
      <div style={getPositionStyle()}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Volume Controls Button */}
          <button 
            className={`rpgui-button ${buttonStyle === 'golden' ? 'golden' : ''}`}
            type="button"
            onClick={toggleVolumeControls}
            style={{
              padding: '8px',
              minWidth: '50px',
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Volume Controls"
            disabled={!isLoaded}
          >
            <Headphones
              size={24} 
              color="white"
              style={{
                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))',
                opacity: isLoaded ? 1 : 0.5
              }}
            />
          </button>

          {/* Mute/Unmute Button */}
          <button 
            className={`rpgui-button ${buttonStyle === 'golden' ? 'golden' : ''}`}
            type="button"
            onClick={toggleMute}
            style={{
              padding: '8px',
              minWidth: '50px',
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            disabled={!isLoaded}
          >
            {isMuted ? (
              <VolumeX 
                size={24} 
                color="white"
                style={{
                  filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))',
                  opacity: isLoaded ? 1 : 0.5
                }}
              />
            ) : (
              <Volume2 
                size={24} 
                color="white"
                style={{
                  filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))',
                  opacity: isLoaded ? 1 : 0.5
                }}
              />
            )}
          </button>
        </div>

        {/* Volume Arrow Controls */}
        {showVolumeControls && (
          <div 
            className={`rpgui-container ${containerStyle}`}
            style={{
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
              minWidth: '80px',
              marginTop: position.includes('bottom') ? '0' : '10px',
              marginBottom: position.includes('top') ? '0' : '10px'
            }}
          >
            {showVolumePercentage && (
              <span 
                style={{ 
                  fontSize: '12px', 
                  color: 'white',
                  marginBottom: '5px',
                  textAlign: 'center'
                }}
              >
                {volume}%
              </span>
            )}

            {/* Volume Up Button */}
            <button 
              className={`rpgui-button ${buttonStyle === 'golden' ? 'golden' : ''}`}
              type="button"
              onClick={increaseVolume}
              style={{
                padding: '5px',
                minWidth: '40px',
                minHeight: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={`Increase Volume (+${volumeStep}%)`}
              disabled={!isLoaded || volume >= 100}
            >
              <ChevronUp 
                size={18} 
                color="white"
                style={{
                  filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))',
                  opacity: (isLoaded && volume < 100) ? 1 : 0.5
                }}
              />
            </button>

            {/* Volume Down Button */}
            <button 
              className={`rpgui-button ${buttonStyle === 'golden' ? 'golden' : ''}`}
              type="button"
              onClick={decreaseVolume}
              style={{
                padding: '5px',
                minWidth: '40px',
                minHeight: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={`Decrease Volume (-${volumeStep}%)`}
              disabled={!isLoaded || volume <= 0}
            >
              <ChevronDown 
                size={18} 
                color="white"
                style={{
                  filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))',
                  opacity: (isLoaded && volume > 0) ? 1 : 0.5
                }}
              />
            </button>

            <label 
              style={{ 
                fontSize: '10px', 
                color: 'white',
                marginTop: '5px',
                textAlign: 'center'
              }}
            >
              Volume
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioControls;