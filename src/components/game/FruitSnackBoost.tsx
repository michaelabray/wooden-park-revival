import { useEffect, useState } from 'react';
import { Apple, Zap } from 'lucide-react';

interface FruitSnackBoostProps {
  currentPapers: number;
  isActive: boolean;
  endTime: number;
  onActivate: () => boolean;
}

export function FruitSnackBoost({ currentPapers, isActive, endTime, onActivate }: FruitSnackBoostProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const canAfford = currentPapers >= 50;

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
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isActive ? 'bg-warning/20' : 'bg-secondary'}`}>
          <Apple className={`w-5 h-5 ${isActive ? 'text-warning' : 'text-accent'}`} />
        </div>
        <div>
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
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
            canAfford 
              ? 'btn-accent hover:opacity-90' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          Distribute (50 papers)
        </button>
      )}
    </div>
  );
}
