import { UNITS, calculateCost, formatPapers } from '@/lib/gameUtils';

interface UnitShopProps {
  currentPapers: number;
  units: Record<string, number>;
  onBuy: (unitId: string) => boolean;
}

export function UnitShop({ currentPapers, units, onBuy }: UnitShopProps) {
  return (
    <div>
      <h3 className="font-display text-2xl text-accent mb-4">Recruit Students</h3>
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
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                canAfford 
                  ? 'bg-secondary/60 hover:bg-secondary/80 hover:scale-[1.02]' 
                  : 'bg-secondary/30 opacity-60'
              }`}
            >
              <div className="w-12 h-12 rounded-lg bg-background/50 flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src={unit.image} 
                  alt={unit.name}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-foreground truncate text-sm">{unit.name}</h4>
                  <span className="text-xs bg-accent/30 px-2 py-0.5 rounded-full text-accent">
                    x{owned}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
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
