import { BLUEPRINTS } from '@/lib/gameUtils';
import { Check } from 'lucide-react';

interface BlueprintShopProps {
  goldenSplinters: number;
  unlockedBlueprints: string[];
  onBuy: (blueprintId: string, cost: number) => boolean;
}

export function BlueprintShop({ goldenSplinters, unlockedBlueprints, onBuy }: BlueprintShopProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg text-gold">The Blueprint</h3>
        <div className="flex items-center gap-1 bg-gold/10 px-2 py-1 rounded-full">
          <img 
            src="/wooden-park-revival/assets/icons/splinter.webp" 
            alt="Splinters"
            className="w-4 h-4 object-contain"
          />
          <span className="text-sm font-medium text-gold">{goldenSplinters}</span>
        </div>
      </div>

      <div className="space-y-2">
        {BLUEPRINTS.map(piece => {
          const isUnlocked = unlockedBlueprints.includes(piece.id);
          const canAfford = goldenSplinters >= piece.cost;

          return (
            <button
              key={piece.id}
              onClick={() => !isUnlocked && onBuy(piece.id, piece.cost)}
              disabled={isUnlocked || !canAfford}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                isUnlocked
                  ? 'bg-success/10'
                  : canAfford
                  ? 'hover:bg-gold/10 hover:scale-[1.02] active:scale-[0.98]'
                  : 'opacity-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0 ${
                isUnlocked ? 'bg-success/20' : ''
              }`}>
                {isUnlocked ? (
                  <Check className="w-6 h-6 text-success" />
                ) : (
                  <img 
                    src={piece.image} 
                    alt={piece.name}
                    className="w-8 h-8 object-contain"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h4 className={`font-semibold text-sm ${isUnlocked ? 'text-success' : 'text-foreground'}`}>
                  {piece.name}
                </h4>
                <p className="text-xs text-muted-foreground truncate">{piece.effect}</p>
              </div>
              {!isUnlocked && (
                <div className="flex items-center gap-1 shrink-0">
                  <img 
                    src="/wooden-park-revival/assets/icons/splinter.webp" 
                    alt=""
                    className="w-4 h-4 object-contain"
                  />
                  <span className={`text-sm font-medium ${canAfford ? 'text-gold' : 'text-muted-foreground'}`}>
                    {piece.cost}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
