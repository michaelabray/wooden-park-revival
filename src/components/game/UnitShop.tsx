import { UNITS, calculateCost, formatPapers } from '@/lib/gameUtils';

interface UnitShopProps {
  currentPapers: number;
  units: Record<string, number>;
  onBuy: (unitId: string) => boolean;
}

export function UnitShop({ currentPapers, units, onBuy }: UnitShopProps) {
  return (
    <div>
      <h3 className="font-display text-xl text-accent mb-3">Recruit Students</h3>
      <div className="space-y-2">
        {UNITS.map(unit => {
          const owned = units[unit.id] || 0;
          const cost = calculateCost(unit.baseCost, owned);
          const canAfford = currentPapers >= cost;

          return (
            <button
              key={unit.id}
              onClick={() => onBuy(unit.id)}
              disabled={!canAfford}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                canAfford 
                  ? 'hover:bg-gold/10 hover:scale-[1.02] active:scale-[0.98]' 
                  : 'opacity-50'
              }`}
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
          );
        })}
      </div>
    </div>
  );
}
