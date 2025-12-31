import { useRef, useCallback } from 'react';
import { SettingsPanel } from './SettingsPanel';
import { Sparkles } from 'lucide-react';

interface GameHeaderProps {
  goldenSplinters: number;
  splinterMultiplier: number;
  onDevMenuTrigger: () => void;
}

export function GameHeader({ goldenSplinters, splinterMultiplier, onDevMenuTrigger }: GameHeaderProps) {
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
    <header className="flex items-center justify-between py-4">
      <div>
        <h1 
          onClick={handleTitleClick}
          className="font-display text-3xl md:text-4xl text-accent cursor-default select-none"
        >
          Bee-Kay Academy
        </h1>
        <p className="text-sm text-muted-foreground">Operation Wooden Park</p>
      </div>

      <div className="flex items-center gap-4">
        {goldenSplinters > 0 && (
          <div className="flex items-center gap-2 bg-gold/10 px-3 py-1.5 rounded-full border border-gold/30">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">
              {goldenSplinters} ({(splinterMultiplier * 100 - 100).toFixed(0)}% bonus)
            </span>
          </div>
        )}
        <SettingsPanel />
      </div>
    </header>
  );
}
