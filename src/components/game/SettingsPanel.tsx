import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Music2, Maximize2, Minimize2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface SettingsPanelProps {
  // Legacy props
  volume?: number;
  isMuted?: boolean;
  onVolumeChange?: (volume: number) => void;
  onToggleMute?: () => void;
  // New split controls
  musicEnabled?: boolean;
  sfxEnabled?: boolean;
  musicVolume?: number;
  sfxVolume?: number;
  onToggleMusic?: () => void;
  onToggleSfx?: () => void;
  onMusicVolumeChange?: (volume: number) => void;
  onSfxVolumeChange?: (volume: number) => void;
}

export function SettingsPanel({ 
  musicEnabled = true,
  sfxEnabled = true,
  musicVolume = 0.3,
  sfxVolume = 0.5,
  onToggleMusic,
  onToggleSfx,
  onMusicVolumeChange,
  onSfxVolumeChange,
}: SettingsPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="space-y-5">
      {/* Music Control */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          {musicEnabled ? <Music className="w-4 h-4 text-gold" /> : <Music2 className="w-4 h-4 text-muted-foreground" />}
          Music
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMusic}
            className={`p-2 rounded-lg transition-colors ${
              musicEnabled ? 'bg-gold/20 hover:bg-gold/30' : 'bg-secondary hover:bg-secondary/80'
            }`}
            title={musicEnabled ? 'Mute Music' : 'Enable Music'}
          >
            {musicEnabled ? (
              <Music className="w-5 h-5 text-gold" />
            ) : (
              <Music2 className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          <Slider
            value={[musicEnabled ? musicVolume * 100 : 0]}
            onValueChange={(values) => onMusicVolumeChange?.(values[0] / 100)}
            max={100}
            step={1}
            className="flex-1"
            disabled={!musicEnabled}
          />
          <span className="text-sm text-muted-foreground w-10 text-right">
            {musicEnabled ? Math.round(musicVolume * 100) : '0'}%
          </span>
        </div>
      </div>

      {/* SFX Control */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          {sfxEnabled ? <Volume2 className="w-4 h-4 text-accent" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
          Sounds
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSfx}
            className={`p-2 rounded-lg transition-colors ${
              sfxEnabled ? 'bg-accent/20 hover:bg-accent/30' : 'bg-secondary hover:bg-secondary/80'
            }`}
            title={sfxEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {sfxEnabled ? (
              <Volume2 className="w-5 h-5 text-accent" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          <Slider
            value={[sfxEnabled ? sfxVolume * 100 : 0]}
            onValueChange={(values) => onSfxVolumeChange?.(values[0] / 100)}
            max={100}
            step={1}
            className="flex-1"
            disabled={!sfxEnabled}
          />
          <span className="text-sm text-muted-foreground w-10 text-right">
            {sfxEnabled ? Math.round(sfxVolume * 100) : '0'}%
          </span>
        </div>
      </div>

      {/* Fullscreen Control */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <label className="text-sm font-medium text-foreground">Fullscreen</label>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-foreground" />
          ) : (
            <Maximize2 className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}
