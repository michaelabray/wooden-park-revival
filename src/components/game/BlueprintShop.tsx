import { BLUEPRINTS } from '@/lib/gameUtils';
import { Footprints, TrendingDown, Wind, Boxes, Crown, Lock, Check } from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Footprints,
  TrendingDown,
  Wind,
  Boxes,
  Crown,
};

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
        <span className="text-sm font-medium text-gold">
          ✦ {goldenSplinters} Splinters
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Rebuild the Wooden Park piece by piece
      </p>

      <div className="grid grid-cols-1 gap-3">
        {BLUEPRINTS.map(piece => {
          const isUnlocked = unlockedBlueprints.includes(piece.id);
          const canAfford = goldenSplinters >= piece.cost;
          const IconComponent = ICONS[piece.icon];

          return (
            <button
              key={piece.id}
              onClick={() => !isUnlocked && onBuy(piece.id, piece.cost)}
              disabled={isUnlocked || !canAfford}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                isUnlocked
                  ? 'bg-success/10 border-success/30'
                  : canAfford
                  ? 'bg-secondary/50 border-gold/30 hover:border-gold/60'
                  : 'bg-secondary/30 border-border opacity-60'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isUnlocked ? 'bg-success/20' : 'bg-gold/10'
              }`}>
                {isUnlocked ? (
                  <Check className="w-5 h-5 text-success" />
                ) : IconComponent ? (
                  <IconComponent className="w-5 h-5 text-gold" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 text-left">
                <h4 className={`font-semibold ${isUnlocked ? 'text-success' : 'text-foreground'}`}>
                  {piece.name}
                </h4>
                <p className="text-xs text-muted-foreground">{piece.effect}</p>
              </div>
              {!isUnlocked && (
                <span className={`text-sm font-medium ${canAfford ? 'text-gold' : 'text-muted-foreground'}`}>
                  ✦ {piece.cost}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
