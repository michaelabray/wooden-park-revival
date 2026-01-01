import { useRef, useCallback } from 'react';

interface GameHeaderProps {
  goldenSplinters: number;
  splinterMultiplier: number;
  onDevMenuTrigger: () => void;
  onSettingsClick: () => void;
  onTrophyClick: () => void;
  onShopClick: () => void;
}

export function GameHeader({ 
  goldenSplinters, 
  splinterMultiplier, 
  onDevMenuTrigger,
  onSettingsClick,
  onTrophyClick,
  onShopClick,
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
    <header className="relative z-20 flex items-center justify-between py-4">
      {/* Logo and Title */}
      <div 
        onClick={handleTitleClick}
        className="cursor-default select-none flex items-center gap-3"
      >
        <img 
          src="/wooden-park-revival/assets/ui/game-logo-header.webp" 
          alt="Bee-Kay Academy"
          className="h-40 md:h-56 lg:h-64 object-contain"
        />
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Splinter display */}
        {goldenSplinters > 0 && (
          <div className="flex items-center gap-3 bg-gold/10 px-5 py-3 rounded-full border border-gold/30">
            <img 
              src="/wooden-park-revival/assets/icons/splinter.webp" 
              alt="Splinters"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <span className="text-xl md:text-2xl font-medium text-gold">
              {goldenSplinters} ({(splinterMultiplier * 100 - 100).toFixed(0)}%)
            </span>
          </div>
        )}

        {/* UI Buttons */}
        <button
          onClick={onShopClick}
          className="p-3 rounded-lg transition-transform hover:scale-110 active:scale-95"
          title="Shop"
        >
          <img 
            src="/wooden-park-revival/assets/ui/cart.webp" 
            alt="Shop"
            className="w-16 h-16 md:w-20 md:h-20 object-contain"
          />
        </button>

        <button
          onClick={onTrophyClick}
          className="p-3 rounded-lg transition-transform hover:scale-110 active:scale-95"
          title="Trophies"
        >
          <img 
            src="/wooden-park-revival/assets/ui/trophy.webp" 
            alt="Trophies"
            className="w-16 h-16 md:w-20 md:h-20 object-contain"
          />
        </button>

        <button
          onClick={onSettingsClick}
          className="p-3 rounded-lg transition-transform hover:scale-110 active:scale-95"
          title="Settings"
        >
          <img 
            src="/wooden-park-revival/assets/ui/cog.webp" 
            alt="Settings"
            className="w-16 h-16 md:w-20 md:h-20 object-contain"
          />
        </button>
      </div>
    </header>
  );
}
