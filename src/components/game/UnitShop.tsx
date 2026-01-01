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
      <div className="space-y-3">
        {UNITS.map(unit => {
          const owned = units[unit.id] || 0;
          const cost = calculateCost(unit.baseCost, owned);
          const canAfford = currentPapers >= cost;

          return (
            <button
              key={unit.id}
              onClick={() => onBuy(unit.id)}
              disabled={!canAfford}
              className={`w-full flex items-center gap-4 p-2 rounded-xl transition-all ${
                canAfford 
                  ? 'hover:bg-gold/10 hover:scale-[1.02]' 
                  : 'opacity-50'
              }`}
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src={unit.image} 
                  alt={unit.name}
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-foreground truncate text-base">{unit.name}</h4>
                  <span className="text-sm bg-accent/30 px-3 py-1 rounded-full text-accent font-medium">
                    x{owned}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-base font-medium ${canAfford ? 'text-gold' : 'text-muted-foreground'}`}>
                    {formatPapers(cost)}
                  </span>
                  <span className="text-sm text-accent">
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
