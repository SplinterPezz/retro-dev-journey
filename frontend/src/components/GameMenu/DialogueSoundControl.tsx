import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquareText, Volume2, VolumeX } from 'lucide-react';
import { AppDispatch, RootState } from '../../store/store';
import { selectDialogueSound, setDialogueMuted, setDialogueVolume } from '../../store/settingsSlice';
import '../AudioControls/AudioControls.css';

// The dialogue row of the game menu: volume bar and mute toggle of the typing
// sound the dialogue box makes, working like the music row.
const DialogueSoundControl: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector((state: RootState) => state.settings);
  const { dialogueVolume, dialogueMuted } = selectDialogueSound(settings);

  const changeVolume = (volume: number) => {
    dispatch(setDialogueVolume(volume));
    if (dialogueMuted && volume > 0) dispatch(setDialogueMuted(false));
  };

  const MuteIcon = dialogueMuted ? VolumeX : Volume2;

  return (
    <div className="game-menu-music">
      <MessageSquareText size={20} color="white" className="volume-filter game-menu-sound-icon" aria-hidden="true" />
      <input
        type="range"
        className="game-menu-volume"
        min={0}
        max={100}
        step={5}
        value={dialogueVolume}
        onChange={(e) => changeVolume(Number(e.target.value))}
        aria-label="Dialogue sound volume"
      />
      <button
        type="button"
        className="unmute-controls rpgui-button game-menu-mute"
        onClick={() => dispatch(setDialogueMuted(!dialogueMuted))}
        title={dialogueMuted ? 'Turn the dialogue sound on' : 'Turn the dialogue sound off'}
        aria-pressed={dialogueMuted}
      >
        <MuteIcon size={24} color="white" className="volume-filter" />
      </button>
    </div>
  );
};

export default DialogueSoundControl;
