import React from 'react';
import { MessageSquareText } from 'lucide-react';
import { selectDialogueSound, setDialogueMuted, setDialogueVolume } from '../../store/settingsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import VolumeRow from './VolumeRow';

const DialogueSoundControl: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dialogueVolume, dialogueMuted } = selectDialogueSound(useAppSelector((state) => state.settings));

  return (
    <VolumeRow
      icon={MessageSquareText}
      name="dialogue sound"
      volume={dialogueVolume}
      muted={dialogueMuted}
      onVolumeChange={(volume) => dispatch(setDialogueVolume(volume))}
      onMutedChange={(muted) => dispatch(setDialogueMuted(muted))}
    />
  );
};

export default DialogueSoundControl;
