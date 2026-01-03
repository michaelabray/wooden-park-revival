import { UNITS, calculateCost, formatPapers } from '@/lib/gameUtils';

interface UnitShopProps {
  currentPapers: number;
  units: Record<string, number>;
  onBuy: (unitId: string) => boolean;
  showDaydreamerTutorial?: boolean;
}

export function UnitShop({ currentPapers, units, onBuy, showDaydreamerTutorial }: UnitShopProps) {
  return (
    <div>
      <h3 className="font-display text-xl text-accent mb-3">Recruit Students</h3>
      <div className="space-y-2">
        {UNITS.map(unit => {
          const owned = units[unit.id] || 0;
          const cost = calculateCost(unit.baseCost, owned);
          const canAfford = currentPapers >= cost;
          const isDaydreamer = unit.id === 'daydreamer';
          const showTutorial = isDaydreamer && showDaydreamerTutorial && owned === 0;

          return (
            <div key={unit.id} className="relative">
              <button
                onClick={() => onBuy(unit.id)}
                disabled={!canAfford}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                  canAfford 
                    ? 'hover:bg-gold/10 hover:scale-[1.02] active:scale-[0.98]' 
                    : 'opacity-50'
                } ${showTutorial ? 'ring-2 ring-gold ring-offset-2 ring-offset-card' : ''}`}
              >
                <img 
                  src={unit.image} 
                  alt={unit.name}
                  className="w-10 h-10 object-contain shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-semibold text-foreground truncate text-sm">{unit.name}</h4>
                    <span className="text-xs bg-accent/30 px-2 py-0.5 rounded-full text-accent font-medium shrink-0">
                      x{owned}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className={`text-sm font-medium ${canAfford ? 'text-gold' : 'text-muted-foreground'}`}>
                      {formatPapers(cost)}
                    </span>
                    <span className="text-xs text-accent">
                      +{unit.baseYield.toFixed(2)}/s
                    </span>
                  </div>
                </div>
              </button>
              {/* Tutorial Hand for Daydreamer */}
              {showTutorial && (
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full animate-tutorial-pulse z-30 pointer-events-none">
                  <img 
                    src="/wooden-park-revival/assets/ui/tutorial-hand.webp" 
                    alt="Buy this!"
                    className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-lg -rotate-90"
                  />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gold/90 text-background px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                    Buy Daydreamer!
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
