import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { AppDispatch, RootState } from '../../store/store';
import { setMusicMuted, setMusicVolume } from '../../store/settingsSlice';
import '../AudioControls/AudioControls.css';

const MusicControl: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { musicVolume, musicMuted } = useSelector((state: RootState) => state.settings);

  const changeVolume = (volume: number) => {
    dispatch(setMusicVolume(volume));
    if (musicMuted && volume > 0) dispatch(setMusicMuted(false));
  };

  const MuteIcon = musicMuted ? VolumeX : Volume2;

  return (
    <div className="game-menu-music">
      <Music size={20} color="white" className="volume-filter game-menu-sound-icon" aria-hidden="true" />
      <input
        type="range"
        className="game-menu-volume"
        min={0}
        max={100}
        step={5}
        value={musicVolume}
        onChange={(e) => changeVolume(Number(e.target.value))}
        aria-label="Music volume"
      />
      <button
        type="button"
        className="unmute-controls rpgui-button game-menu-mute"
        onClick={() => dispatch(setMusicMuted(!musicMuted))}
        title={musicMuted ? 'Turn the music on' : 'Turn the music off'}
        aria-pressed={musicMuted}
      >
        <MuteIcon size={24} color="white" className="volume-filter" />
      </button>
    </div>
  );
};

export default MusicControl;
