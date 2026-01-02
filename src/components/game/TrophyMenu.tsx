import { X, Trophy, Sparkles, FileText, Building, Shield, Crown, Check, Lock, Zap, Bell, Clock } from 'lucide-react';
import { formatPapers } from '@/lib/gameUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Milestone {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isComplete: boolean;
  progress?: { current: number; target: number };
}

interface PrestigeTier {
  tier: number;
  name: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
}

interface TrophyMenuProps {
  isOpen: boolean;
  onClose: () => void;
  totalSplintersEarned: number;
  totalPapersGenerated: number;
  unlockedBlueprints: string[];
  antagonistsDefeated: number;
  goldenSplinters: number;
  prestigeTier: number;
  onPurchasePrestige?: (tier: number, cost: number) => void;
}

const PRESTIGE_TIERS: PrestigeTier[] = [
  {
    tier: 1,
    name: "Lead Sharpener",
    description: "Permanent +100% Click Power",
    cost: 500,
    icon: <Zap className="w-5 h-5" />,
  },
  {
    tier: 2,
    name: "Recess Bell",
    description: "Antagonists appear 30% less often",
    cost: 2000,
    icon: <Bell className="w-5 h-5" />,
  },
  {
    tier: 3,
    name: "Hall Pass",
    description: "Offline earnings increased to 75% rate",
    cost: 5000,
    icon: <Clock className="w-5 h-5" />,
  },
];

export function TrophyMenu({
  isOpen,
  onClose,
  totalSplintersEarned,
  totalPapersGenerated,
  unlockedBlueprints,
  antagonistsDefeated,
  goldenSplinters,
  prestigeTier,
  onPurchasePrestige,
}: TrophyMenuProps) {
  const milestones: Milestone[] = [
    {
      id: 'splinter-collector',
      name: 'Splinter Collector',
      description: 'Reach 1,000 total Splinters earned',
      icon: <Sparkles className="w-5 h-5" />,
      isComplete: totalSplintersEarned >= 1000,
      progress: { current: Math.min(totalSplintersEarned, 1000), target: 1000 },
    },
    {
      id: 'paper-trail',
      name: 'Paper Trail',
      description: 'Reach 100,000 total Papers generated',
      icon: <FileText className="w-5 h-5" />,
      isComplete: totalPapersGenerated >= 100000,
      progress: { current: Math.min(totalPapersGenerated, 100000), target: 100000 },
    },
    {
      id: 'academy-architect',
      name: 'Academy Architect',
      description: 'Unlock the first 3 Blueprint pieces',
      icon: <Building className="w-5 h-5" />,
      isComplete: unlockedBlueprints.length >= 3,
      progress: { current: Math.min(unlockedBlueprints.length, 3), target: 3 },
    },
    {
      id: 'great-defender',
      name: 'The Great Defender',
      description: 'Use "Slide to Study" on 25 Antagonists',
      icon: <Shield className="w-5 h-5" />,
      isComplete: antagonistsDefeated >= 25,
      progress: { current: Math.min(antagonistsDefeated, 25), target: 25 },
    },
    {
      id: 'founders-legacy',
      name: "Founder's Legacy",
      description: 'Complete the Founder Statue and trigger Victory',
      icon: <Crown className="w-5 h-5" />,
      isComplete: unlockedBlueprints.includes('statue'),
    },
  ];

  const completedCount = milestones.filter(m => m.isComplete).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-gold flex items-center gap-2">
            <img 
              src="/wooden-park-revival/assets/ui/trophy.webp" 
              alt="Trophy" 
              className="w-8 h-8 object-contain"
            />
            Milestones & Legacy
            <span className="text-sm text-muted-foreground font-normal ml-auto">
              {completedCount}/{milestones.length}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-background/40 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Total Splinters</p>
            <p className="text-lg font-display text-gold">{formatPapers(totalSplintersEarned)}</p>
          </div>
          <div className="bg-background/40 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Antagonists Defeated</p>
            <p className="text-lg font-display text-accent">{antagonistsDefeated}</p>
          </div>
        </div>

        {/* Prestige Tiers - Legacy Buffs */}
        <div className="mb-4">
          <h3 className="font-display text-lg text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            Legacy Buffs
          </h3>
          <div className="space-y-2">
            {PRESTIGE_TIERS.map(tier => {
              const isUnlocked = prestigeTier >= tier.tier;
              const canAfford = goldenSplinters >= tier.cost;
              const isNextTier = prestigeTier === tier.tier - 1;

              return (
                <div
                  key={tier.tier}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    isUnlocked
                      ? 'bg-success/20 border border-success/30'
                      : isNextTier && canAfford
                      ? 'bg-gold/10 border border-gold/30 cursor-pointer hover:bg-gold/20'
                      : 'bg-muted/30 opacity-60'
                  }`}
                  onClick={() => {
                    if (!isUnlocked && isNextTier && canAfford && onPurchasePrestige) {
                      onPurchasePrestige(tier.tier, tier.cost);
                    }
                  }}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isUnlocked ? 'bg-success/30 text-success' : 'bg-muted text-muted-foreground'
                  }`}>
                    {isUnlocked ? <Check className="w-5 h-5" /> : tier.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold text-sm ${isUnlocked ? 'text-success' : 'text-foreground'}`}>
                        Tier {tier.tier}: {tier.name}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{tier.description}</p>
                  </div>
                  {!isUnlocked && (
                    <div className="flex items-center gap-1 shrink-0">
                      <img 
                        src="/wooden-park-revival/assets/icons/splinter.webp" 
                        alt=""
                        className="w-4 h-4 object-contain"
                      />
                      <span className={`text-sm font-medium ${canAfford && isNextTier ? 'text-gold' : 'text-muted-foreground'}`}>
                        {tier.cost}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Founder Statue Progress Bar */}
        <div className="bg-background/30 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-foreground">Founder Progress</span>
            <span className="text-xs text-gold">{unlockedBlueprints.length}/5</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${(unlockedBlueprints.length / 5) * 100}%`,
                background: 'linear-gradient(90deg, hsl(var(--gold)), hsl(var(--accent)))',
              }}
            />
          </div>
        </div>

        {/* Milestones List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {milestones.map(milestone => (
            <div
              key={milestone.id}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                milestone.isComplete
                  ? 'bg-success/20'
                  : 'bg-background/30'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                milestone.isComplete ? 'bg-success/30 text-success' : 'bg-muted text-muted-foreground'
              }`}>
                {milestone.isComplete ? <Check className="w-4 h-4" /> : milestone.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-xs ${
                  milestone.isComplete ? 'text-success' : 'text-foreground'
                }`}>
                  {milestone.name}
                </h4>
                <p className="text-[10px] text-muted-foreground truncate">{milestone.description}</p>
                {milestone.progress && !milestone.isComplete && (
                  <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(milestone.progress.current / milestone.progress.target) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              {milestone.isComplete ? (
                <Trophy className="w-4 h-4 text-gold shrink-0" />
              ) : (
                <Lock className="w-3 h-3 text-muted-foreground shrink-0" />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
