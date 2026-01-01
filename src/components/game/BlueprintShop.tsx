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
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl text-gold">The Blueprint</h3>
        <div className="flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-full">
          <img 
            src="./assets/icons/splinter.webp" 
            alt="Splinters"
            className="w-6 h-6 object-contain"
          />
          <span className="text-base font-medium text-gold">{goldenSplinters}</span>
        </div>
      </div>

      <div className="space-y-3">
        {BLUEPRINTS.map(piece => {
          const isUnlocked = unlockedBlueprints.includes(piece.id);
          const canAfford = goldenSplinters >= piece.cost;

          return (
            <button
              key={piece.id}
              onClick={() => !isUnlocked && onBuy(piece.id, piece.cost)}
              disabled={isUnlocked || !canAfford}
              className={`w-full flex items-center gap-4 p-2 rounded-xl transition-all ${
                isUnlocked
                  ? 'bg-success/10'
                  : canAfford
                  ? 'hover:bg-gold/10 hover:scale-[1.02]'
                  : 'opacity-50'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden ${
                isUnlocked ? 'bg-success/20' : ''
              }`}>
                {isUnlocked ? (
                  <Check className="w-8 h-8 text-success" />
                ) : (
                  <img 
                    src={piece.image} 
                    alt={piece.name}
                    className="w-12 h-12 object-contain"
                  />
                )}
              </div>
              <div className="flex-1 text-left">
                <h4 className={`font-semibold text-base ${isUnlocked ? 'text-success' : 'text-foreground'}`}>
                  {piece.name}
                </h4>
                <p className="text-sm text-muted-foreground">{piece.effect}</p>
              </div>
              {!isUnlocked && (
                <div className="flex items-center gap-2">
                  <img 
                    src="./assets/icons/splinter.webp" 
                    alt=""
                    className="w-6 h-6 object-contain"
                  />
                  <span className={`text-base font-medium ${canAfford ? 'text-gold' : 'text-muted-foreground'}`}>
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
