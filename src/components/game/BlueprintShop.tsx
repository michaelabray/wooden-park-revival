import { BLUEPRINTS } from '@/lib/gameUtils';
import { Check, Lock } from 'lucide-react';

interface BlueprintShopProps {
  goldenSplinters: number;
  unlockedBlueprints: string[];
  onBuy: (blueprintId: string, cost: number) => boolean;
}

export function BlueprintShop({ goldenSplinters, unlockedBlueprints, onBuy }: BlueprintShopProps) {
  return (
    <div className="bento-card-gold">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-2xl text-gold">The Blueprint</h3>
        <div className="flex items-center gap-2">
          <img 
            src="/wooden-park-revival/assets/icons/splinter.webp" 
            alt="Splinters"
            className="w-5 h-5 object-contain"
          />
          <span className="text-sm font-medium text-gold">{goldenSplinters}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Rebuild the Wooden Park piece by piece
      </p>

      <div className="grid grid-cols-1 gap-3">
        {BLUEPRINTS.map(piece => {
          const isUnlocked = unlockedBlueprints.includes(piece.id);
          const canAfford = goldenSplinters >= piece.cost;

          return (
            <button
              key={piece.id}
              onClick={() => !isUnlocked && onBuy(piece.id, piece.cost)}
              disabled={isUnlocked || !canAfford}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isUnlocked
                  ? 'bg-success/10 border-success/30'
                  : canAfford
                  ? 'bg-secondary/50 border-gold/30 hover:border-gold/60 hover:scale-[1.02]'
                  : 'bg-secondary/30 border-border opacity-60'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden ${
                isUnlocked ? 'bg-success/20' : 'bg-gold/10'
              }`}>
                {isUnlocked ? (
                  <Check className="w-6 h-6 text-success" />
                ) : (
                  <img 
                    src={piece.image} 
                    alt={piece.name}
                    className="w-10 h-10 object-contain"
                  />
                )}
              </div>
              <div className="flex-1 text-left">
                <h4 className={`font-semibold ${isUnlocked ? 'text-success' : 'text-foreground'}`}>
                  {piece.name}
                </h4>
                <p className="text-xs text-muted-foreground">{piece.effect}</p>
              </div>
              {!isUnlocked && (
                <div className="flex items-center gap-1">
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
