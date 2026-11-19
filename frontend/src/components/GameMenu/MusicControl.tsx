import React from 'react';
import { Music } from 'lucide-react';
import { setMusicMuted, setMusicVolume } from '../../store/settingsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import VolumeRow from './VolumeRow';

const MusicControl: React.FC = () => {
  const dispatch = useAppDispatch();
  const { musicVolume, musicMuted } = useAppSelector((state) => state.settings);

  return (
    <VolumeRow
      icon={Music}
      name="music"
      volume={musicVolume}
      muted={musicMuted}
      onVolumeChange={(volume) => dispatch(setMusicVolume(volume))}
      onMutedChange={(muted) => dispatch(setMusicMuted(muted))}
    />
  );
};

export default MusicControl;
