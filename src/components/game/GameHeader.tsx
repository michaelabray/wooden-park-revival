import { useRef, useCallback } from 'react';

interface GameHeaderProps {
  goldenSplinters: number;
  splinterMultiplier: number;
  onDevMenuTrigger: () => void;
  onSettingsClick: () => void;
  onTrophyClick: () => void;
}

export function GameHeader({ 
  goldenSplinters, 
  splinterMultiplier, 
  onDevMenuTrigger,
  onSettingsClick,
  onTrophyClick,
}: GameHeaderProps) {
  const clickTimestamps = useRef<number[]>([]);

  const handleTitleClick = useCallback(() => {
    const now = Date.now();
    clickTimestamps.current.push(now);
    
    // Keep only clicks within last 3 seconds
    clickTimestamps.current = clickTimestamps.current.filter(t => now - t < 3000);
    
    if (clickTimestamps.current.length >= 5) {
      clickTimestamps.current = [];
      onDevMenuTrigger();
    }
  }, [onDevMenuTrigger]);

  return (
    <header className="relative z-20 w-full">
      {/* 3-column HUD layout */}
      <div className="grid grid-cols-3 items-center py-2 gap-2">
        {/* Left: Logo (25% width) */}
        <div 
          onClick={handleTitleClick}
          className="cursor-default select-none flex justify-start"
        >
          <img 
            src="/wooden-park-revival/assets/ui/game-logo-header.webp" 
            alt="Bee-Kay Academy"
            className="w-[25vw] max-w-[200px] object-contain"
          />
        </div>

        {/* Center: Splinter status as horizontal pill */}
        <div className="flex justify-center">
          {goldenSplinters > 0 && (
            <div className="flex items-center gap-2 bg-gold/15 px-4 py-1 rounded-full border border-gold/30">
              <img 
                src="/wooden-park-revival/assets/icons/splinter.webp" 
                alt="Splinters"
                className="w-[4vw] max-w-[32px] min-w-[16px] object-contain"
              />
              <span className="text-[clamp(0.75rem,2vw,1.25rem)] font-medium text-gold whitespace-nowrap">
                {goldenSplinters} ({(splinterMultiplier * 100 - 100).toFixed(0)}%)
              </span>
            </div>
          )}
        </div>

        {/* Right: Trophy and Settings buttons */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onTrophyClick}
            className="transition-transform hover:scale-110 active:scale-95"
            title="Trophies"
          >
            <img 
              src="/wooden-park-revival/assets/ui/trophy.webp" 
              alt="Trophies"
              className="w-[6vw] max-w-[48px] min-w-[24px] object-contain"
            />
          </button>

          <button
            onClick={onSettingsClick}
            className="transition-transform hover:scale-110 active:scale-95"
            title="Settings"
          >
            <img 
              src="/wooden-park-revival/assets/ui/cog.webp" 
              alt="Settings"
              className="w-[6vw] max-w-[48px] min-w-[24px] object-contain"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
