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
    <div className={`w-[80vw] max-w-xl mx-auto bg-secondary/60 backdrop-blur-sm rounded-full px-4 py-2 transition-all duration-300 ${isActive ? 'ring-2 ring-warning/50' : ''}`}>
      <div className="flex items-center gap-3">
        {/* Icon */}
        <img 
          src="/wooden-park-revival/assets/icons/fruit-snack.webp" 
          alt="Fruit Snack"
          className={`w-[6vw] max-w-[40px] min-w-[24px] object-contain shrink-0 ${isActive ? 'animate-bounce' : ''}`}
        />

        {/* Status/Action - Expands to fill */}
        <div className="flex-1 min-w-0">
          {isActive ? (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning shrink-0" />
              <span className="text-[clamp(0.6rem,1.5vw,0.875rem)] text-warning font-semibold whitespace-nowrap">2x</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-warning transition-all"
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
              <span className="text-[clamp(0.6rem,1.5vw,0.875rem)] font-medium text-foreground whitespace-nowrap">{timeLeft}s</span>
            </div>
          ) : (
            <button
              onClick={onActivate}
              disabled={!canAfford}
              className={`w-full py-1 px-3 rounded-full font-semibold transition-all text-[clamp(0.6rem,1.5vw,0.875rem)] ${
                canAfford 
                  ? 'bg-gold/20 hover:bg-gold/30 text-gold' 
                  : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
              }`}
            >
              Boost ({FRUIT_SNACK_COST})
            </button>
          )}
        </div>

        {/* Auto-Boost Toggle */}
        {autoBoostPurchased ? (
          <button
            onClick={onToggleAutoBoost}
            className="p-1 rounded-lg hover:bg-background/30 transition-colors shrink-0"
          >
            {autoBoostEnabled ? (
              <ToggleRight className="w-[4vw] max-w-[24px] min-w-[16px] h-auto text-success" />
            ) : (
              <ToggleLeft className="w-[4vw] max-w-[24px] min-w-[16px] h-auto text-muted-foreground" />
            )}
          </button>
        ) : (
          <button
            onClick={onPurchaseAutoBoost}
            disabled={!canAffordAutoBoost}
            className={`px-2 py-1 rounded-full text-[clamp(0.5rem,1.2vw,0.75rem)] whitespace-nowrap transition-all shrink-0 ${
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
