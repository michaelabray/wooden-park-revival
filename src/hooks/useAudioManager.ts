import { useCallback, useRef, useEffect, useState } from 'react';

interface AudioManagerState {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  isInitialized: boolean;
}

const STORAGE_KEY = 'bk-academy-audio';

const DEFAULT_STATE: AudioManagerState = {
  musicEnabled: true,
  sfxEnabled: true,
  musicVolume: 0.3,
  sfxVolume: 0.5,
  isInitialized: false,
};

export function useAudioManager() {
  const [state, setState] = useState<AudioManagerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate from old format
        if ('volume' in parsed && !('musicVolume' in parsed)) {
          return {
            ...DEFAULT_STATE,
            musicVolume: parsed.volume * 0.5,
            sfxVolume: parsed.volume,
            musicEnabled: !parsed.isMuted,
            sfxEnabled: !parsed.isMuted,
          };
        }
        return { ...DEFAULT_STATE, ...parsed, isInitialized: false };
      } catch {
        return DEFAULT_STATE;
      }
    }
    return DEFAULT_STATE;
  });

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const sfxRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Save settings (exclude isInitialized)
  useEffect(() => {
    const { isInitialized, ...rest } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  }, [state]);

  // Update music volume when state changes
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = state.musicEnabled ? state.musicVolume * 0.2 : 0;
    }
  }, [state.musicEnabled, state.musicVolume]);

  // Initialize audio on first user interaction
  const initialize = useCallback(() => {
    if (state.isInitialized) return;

    // Create background music
    const bgMusic = new Audio('/wooden-park-revival/assets/audio/bg-music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = state.musicEnabled ? state.musicVolume * 0.2 : 0;
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
    if (state.musicEnabled) {
      bgMusic.play().catch(() => {
        // Autoplay blocked - will try again on next interaction
      });
    }

    setState(prev => ({ ...prev, isInitialized: true }));
  }, [state.isInitialized, state.musicEnabled, state.musicVolume]);

  // Play SFX
  const playSFX = useCallback((sfxName: 'click' | 'buy' | 'antagonist' | 'victory') => {
    if (!state.sfxEnabled || !state.isInitialized) return;
    
    const audio = sfxRefs.current[sfxName];
    if (audio) {
      audio.volume = state.sfxVolume;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, [state.sfxEnabled, state.isInitialized, state.sfxVolume]);

  // Music controls
  const setMusicVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, musicVolume: volume }));
  }, []);

  const toggleMusic = useCallback(() => {
    setState(prev => {
      const newEnabled = !prev.musicEnabled;
      if (bgMusicRef.current) {
        if (newEnabled) {
          bgMusicRef.current.volume = prev.musicVolume * 0.2;
          bgMusicRef.current.play().catch(() => {});
        } else {
          bgMusicRef.current.pause();
        }
      }
      return { ...prev, musicEnabled: newEnabled };
    });
  }, []);

  // SFX controls
  const setSfxVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, sfxVolume: volume }));
  }, []);

  const toggleSfx = useCallback(() => {
    setState(prev => ({ ...prev, sfxEnabled: !prev.sfxEnabled }));
  }, []);

  // Legacy compatibility
  const isMuted = !state.musicEnabled && !state.sfxEnabled;
  const volume = state.sfxVolume;
  
  const setVolume = useCallback((vol: number) => {
    setState(prev => ({ ...prev, musicVolume: vol * 0.6, sfxVolume: vol }));
  }, []);

  const toggleMute = useCallback(() => {
    setState(prev => {
      const shouldMute = prev.musicEnabled || prev.sfxEnabled;
      return {
        ...prev,
        musicEnabled: !shouldMute,
        sfxEnabled: !shouldMute,
      };
    });
  }, []);

  return {
    ...state,
    // Legacy props
    isMuted,
    volume,
    setVolume,
    toggleMute,
    // New split controls
    initialize,
    playSFX,
    setMusicVolume,
    toggleMusic,
    setSfxVolume,
    toggleSfx,
  };
}
