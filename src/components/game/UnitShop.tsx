import { UNITS, calculateCost, formatPapers } from '@/lib/gameUtils';
import { Cloud, Star, Trophy, Cpu, GraduationCap } from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Cloud,
  Star,
  Trophy,
  Cpu,
  GraduationCap,
};

interface UnitShopProps {
  currentPapers: number;
  units: Record<string, number>;
  onBuy: (unitId: string) => boolean;
}

export function UnitShop({ currentPapers, units, onBuy }: UnitShopProps) {
  return (
    <div className="bento-card">
      <h3 className="font-display text-2xl text-accent mb-4">Recruit Students</h3>
      <div className="space-y-3">
        {UNITS.map(unit => {
          const owned = units[unit.id] || 0;
          const cost = calculateCost(unit.baseCost, owned);
          const canAfford = currentPapers >= cost;
          const IconComponent = ICONS[unit.icon];

          return (
            <button
              key={unit.id}
              onClick={() => onBuy(unit.id)}
              disabled={!canAfford}
              className="unit-card w-full text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                {IconComponent && <IconComponent className="w-6 h-6 text-accent" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-foreground truncate">{unit.name}</h4>
                  <span className="text-xs bg-primary/50 px-2 py-0.5 rounded-full text-primary-foreground">
                    x{owned}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{unit.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-sm font-medium ${canAfford ? 'text-gold' : 'text-muted-foreground'}`}>
                    {formatPapers(cost)} papers
                  </span>
                  <span className="text-xs text-accent">
                    +{unit.baseYield}/sec
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
