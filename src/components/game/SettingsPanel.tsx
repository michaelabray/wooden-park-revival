import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface SettingsPanelProps {
  volume?: number;
  isMuted?: boolean;
  onVolumeChange?: (volume: number) => void;
  onToggleMute?: () => void;
}

export function SettingsPanel({ 
  volume = 0.5, 
  isMuted = false, 
  onVolumeChange, 
  onToggleMute 
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
    <div className="space-y-4">
      {/* Volume Control */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          Volume
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Volume2 className="w-5 h-5 text-foreground" />
            )}
          </button>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            onValueChange={(values) => onVolumeChange?.(values[0] / 100)}
            max={100}
            step={1}
            className="flex-1"
            disabled={isMuted}
          />
          <span className="text-sm text-muted-foreground w-10 text-right">
            {isMuted ? '0' : Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Fullscreen Control */}
      <div className="flex items-center justify-between">
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
