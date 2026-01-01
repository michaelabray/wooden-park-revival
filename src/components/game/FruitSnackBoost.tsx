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
    <div className={`bg-secondary/60 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 ${isActive ? 'ring-2 ring-warning/50' : ''}`}>
      <div className="flex items-center gap-3">
        <img 
          src="./assets/icons/fruit-snack.webp" 
          alt="Fruit Snack"
          className={`w-10 h-10 object-contain ${isActive ? 'animate-bounce' : ''}`}
        />
        <div className="flex-1">
          {isActive ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-warning font-semibold flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  2x ACTIVE
                </span>
                <span className="text-sm font-medium text-foreground">{timeLeft}s</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-warning transition-all"
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
                src="./assets/ui/button.webp" 
                alt=""
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                style={{ filter: !canAfford ? 'grayscale(50%)' : 'none' }}
              />
              <span className="relative z-10 text-foreground text-sm">
                Boost ({FRUIT_SNACK_COST})
              </span>
            </button>
          )}
        </div>

        {/* Auto-Boost Toggle */}
        {autoBoostPurchased ? (
          <button
            onClick={onToggleAutoBoost}
            className="p-2 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
          >
            {autoBoostEnabled ? (
              <ToggleRight className="w-6 h-6 text-success" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-muted-foreground" />
            )}
          </button>
        ) : (
          <button
            onClick={onPurchaseAutoBoost}
            disabled={!canAffordAutoBoost}
            className={`px-3 py-2 rounded-lg text-xs transition-all ${
              canAffordAutoBoost
                ? 'bg-gold/20 hover:bg-gold/30 text-gold'
                : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
            }`}
          >
            Auto ({formatPapers(AUTO_BOOST_COST)})
          </button>
        )}
      </div>
    </div>
  );
}
