import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { setMusicMuted } from '../store/settingsSlice';

// Plays a page's music in a loop, at the volume and mute state saved in
// state.settings (shared by the home page controls and the game menu).
//
// Browsers refuse to start sound on a page nobody has clicked or typed on yet
// (e.g. right after a reload). When that happens the music is switched to
// muted, so the controls show it off and it only starts when the player turns
// it on - never by surprise on some unrelated click.
export const useBackgroundMusic = (src?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { musicVolume, musicMuted } = useSelector((state: RootState) => state.settings);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // One audio element per track, stopped when the page goes away.
  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = musicVolume / 100;
    if (musicMuted) {
      audio.pause();
      return;
    }
    audio.play().catch((error: unknown) => {
      // only the browser's autoplay block: a play() cut short by a pause or a track change is not one
      if (error instanceof DOMException && error.name === 'NotAllowedError') dispatch(setMusicMuted(true));
    });
  }, [src, musicVolume, musicMuted, dispatch]);
};
