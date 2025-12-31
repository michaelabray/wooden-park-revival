import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

export function SettingsPanel() {
  const [isMuted, setIsMuted] = useState(true);
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
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Volume2 className="w-5 h-5 text-foreground" />
        )}
      </button>

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
  );
}
