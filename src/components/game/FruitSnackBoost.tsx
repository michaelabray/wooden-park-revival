import { useEffect, useState } from 'react';
import { Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatPapers } from '@/lib/gameUtils';

interface FruitSnackBoostProps {
  currentPapers: number;
  isActive: boolean;
  endTime: number;
  onActivate: () => boolean;
  autoBoostPurchased: boolean;
  autoBoostEnabled: boolean;
  onPurchaseAutoBoost: () => boolean;
  onToggleAutoBoost: () => void;
}

const FRUIT_SNACK_COST = 50;
const AUTO_BOOST_COST = 5000;

export function FruitSnackBoost({ 
  currentPapers, 
  isActive, 
  endTime, 
  onActivate,
  autoBoostPurchased,
  autoBoostEnabled,
  onPurchaseAutoBoost,
  onToggleAutoBoost,
}: FruitSnackBoostProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const canAfford = currentPapers >= FRUIT_SNACK_COST;
  const canAffordAutoBoost = currentPapers >= AUTO_BOOST_COST;

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(0);
      return;
    }

    const update = () => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [isActive, endTime]);

  return (
    <div className={`bento-card transition-all duration-300 ${isActive ? 'border-warning/50 glow-gold' : ''}`}>
      <div className="flex items-center gap-3 mb-3">
        <img 
          src="/wooden-park-revival/assets/icons/fruit-snack.webp" 
          alt="Fruit Snack"
          className={`w-12 h-12 object-contain ${isActive ? 'animate-bounce' : ''}`}
        />
        <div className="flex-1">
          <h3 className="font-display text-xl text-foreground">Fruit Snack Boost</h3>
          <p className="text-xs text-muted-foreground">2x production for 30s</p>
        </div>
      </div>

      {isActive ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-warning font-semibold flex items-center gap-1">
              <Zap className="w-4 h-4" />
              ACTIVE!
            </span>
            <span className="text-sm font-medium text-foreground">{timeLeft}s</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill bg-warning"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={onActivate}
          disabled={!canAfford}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-all relative overflow-hidden ${
            canAfford 
              ? 'hover:scale-105 active:scale-95' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <img 
            src="/wooden-park-revival/assets/ui/button.webp" 
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: !canAfford ? 'grayscale(50%)' : 'none' }}
          />
          <span className="relative z-10 text-foreground">
            Distribute ({FRUIT_SNACK_COST} papers)
          </span>
        </button>
      )}

      {/* Auto-Boost Section */}
      <div className="mt-4 pt-4 border-t border-border">
        {autoBoostPurchased ? (
          <button
            onClick={onToggleAutoBoost}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
          >
            <span className="text-sm text-foreground">Auto-Boost</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${autoBoostEnabled ? 'text-success' : 'text-muted-foreground'}`}>
                {autoBoostEnabled ? 'ON' : 'OFF'}
              </span>
              {autoBoostEnabled ? (
                <ToggleRight className="w-6 h-6 text-success" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
          </button>
        ) : (
          <button
            onClick={onPurchaseAutoBoost}
            disabled={!canAffordAutoBoost}
            className={`w-full py-2 px-4 rounded-lg text-sm transition-all ${
              canAffordAutoBoost
                ? 'bg-gold/20 border border-gold/30 hover:bg-gold/30 text-gold'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            Unlock Auto-Boost ({formatPapers(AUTO_BOOST_COST)} papers)
          </button>
        )}
      </div>
    </div>
  );
}
