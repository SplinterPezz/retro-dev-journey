import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { setMusicMuted } from '../store/settingsSlice';

// When the browser blocks autoplay the music is switched to muted, so it never starts by surprise later.
export const useBackgroundMusic = (src?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { musicVolume, musicMuted } = useSelector((state: RootState) => state.settings);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
