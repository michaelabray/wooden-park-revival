import { useCallback, useRef, useEffect, useState } from 'react';

interface AudioManagerState {
  volume: number;
  isMuted: boolean;
  isInitialized: boolean;
}

const STORAGE_KEY = 'bk-academy-audio';

export function useAudioManager() {
  const [state, setState] = useState<AudioManagerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { volume: 0.2, isMuted: false, isInitialized: false };
      }
    }
    return { volume: 0.2, isMuted: false, isInitialized: false };
  });

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const sfxRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Save settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Initialize audio on first user interaction
  const initialize = useCallback(() => {
    if (state.isInitialized) return;

    // Create background music
    const bgMusic = new Audio('/wooden-park-revival/assets/audio/bg-music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = state.isMuted ? 0 : state.volume * 0.2; // 20% base for bg
    bgMusicRef.current = bgMusic;

    // Pre-load SFX
    const sfxFiles = {
      click: '/wooden-park-revival/assets/audio/pencil-scribble.mp3',
      buy: '/wooden-park-revival/assets/audio/buy-item.mp3',
      antagonist: '/wooden-park-revival/assets/audio/antagonist-spawn.mp3',
      victory: '/wooden-park-revival/assets/audio/victory-theme.mp3',
    };

    Object.entries(sfxFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      sfxRefs.current[key] = audio;
    });

    // Start background music
    bgMusic.play().catch(() => {
      // Autoplay blocked - will try again on next interaction
    });

    setState(prev => ({ ...prev, isInitialized: true }));
  }, [state.isInitialized, state.isMuted, state.volume]);

  // Play SFX
  const playSFX = useCallback((sfxName: 'click' | 'buy' | 'antagonist' | 'victory') => {
    if (state.isMuted || !state.isInitialized) return;
    
    const audio = sfxRefs.current[sfxName];
    if (audio) {
      audio.volume = state.volume;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, [state.isMuted, state.isInitialized, state.volume]);

  // Set volume
  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume }));
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = volume * 0.2;
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setState(prev => {
      const newMuted = !prev.isMuted;
      if (bgMusicRef.current) {
        bgMusicRef.current.volume = newMuted ? 0 : prev.volume * 0.2;
      }
      return { ...prev, isMuted: newMuted };
    });
  }, []);

  return {
    ...state,
    initialize,
    playSFX,
    setVolume,
    toggleMute,
  };
}
