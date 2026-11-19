import React from 'react';
import { LucideIcon, Volume2, VolumeX } from 'lucide-react';
import '../AudioControls/AudioControls.css';

const VOLUME_STEP = 5;

interface VolumeRowProps {
  icon: LucideIcon;
  // lower case, as it reads inside a sentence: "music", "dialogue sound"
  name: string;
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onMutedChange: (muted: boolean) => void;
}

// A sound row of the game menu: moving the bar while muted turns the sound back on.
const VolumeRow: React.FC<VolumeRowProps> = ({ icon: Icon, name, volume, muted, onVolumeChange, onMutedChange }) => {
  const changeVolume = (value: number) => {
    onVolumeChange(value);
    if (muted && value > 0) onMutedChange(false);
  };

  const MuteIcon = muted ? VolumeX : Volume2;

  return (
    <div className="game-menu-music">
      <Icon size={20} color="white" className="volume-filter game-menu-sound-icon" aria-hidden="true" />
      <input
        type="range"
        className="game-menu-volume"
        min={0}
        max={100}
        step={VOLUME_STEP}
        value={volume}
        onChange={(e) => changeVolume(Number(e.target.value))}
        aria-label={`${name[0].toUpperCase()}${name.slice(1)} volume`}
      />
      <button
        type="button"
        className="unmute-controls rpgui-button game-menu-mute"
        onClick={() => onMutedChange(!muted)}
        title={`Turn the ${name} ${muted ? 'on' : 'off'}`}
        aria-pressed={muted}
      >
        <MuteIcon size={24} color="white" className="volume-filter" />
      </button>
    </div>
  );
};

export default VolumeRow;
