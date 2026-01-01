import { X, Trophy, Sparkles, FileText, Building, Shield, Crown, Check, Lock } from 'lucide-react';
import { formatPapers } from '@/lib/gameUtils';

interface Milestone {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isComplete: boolean;
  progress?: { current: number; target: number };
}

interface TrophyMenuProps {
  isOpen: boolean;
  onClose: () => void;
  totalSplintersEarned: number;
  totalPapersGenerated: number;
  unlockedBlueprints: string[];
  antagonistsDefeated: number;
}

export function TrophyMenu({
  isOpen,
  onClose,
  totalSplintersEarned,
  totalPapersGenerated,
  unlockedBlueprints,
  antagonistsDefeated,
}: TrophyMenuProps) {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div 
        className="relative max-w-md w-full mx-4 animate-bounce-in"
        style={{
          backgroundImage: `url('/wooden-park-revival/assets/ui/panel-bg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-background/90 rounded-xl p-6 border border-gold/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <img 
              src="/wooden-park-revival/assets/ui/trophy.webp" 
              alt="Trophy" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h2 className="font-display text-2xl text-gold">Milestones</h2>
              <p className="text-sm text-muted-foreground">
                {completedCount}/{milestones.length} Complete
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Total Splinters</p>
              <p className="text-lg font-display text-gold">{formatPapers(totalSplintersEarned)}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Antagonists Defeated</p>
              <p className="text-lg font-display text-accent">{antagonistsDefeated}</p>
            </div>
          </div>

          {/* Founder Statue Progress Bar */}
          <div className="bg-secondary/30 rounded-lg p-4 mb-4 border border-gold/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Founder Statue Progress</span>
              <span className="text-sm text-gold">{unlockedBlueprints.length}/5</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
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
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {milestones.map(milestone => (
              <div
                key={milestone.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  milestone.isComplete
                    ? 'bg-success/10 border-success/30'
                    : 'bg-secondary/30 border-border'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  milestone.isComplete ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                }`}>
                  {milestone.isComplete ? <Check className="w-5 h-5" /> : milestone.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm ${
                    milestone.isComplete ? 'text-success' : 'text-foreground'
                  }`}>
                    {milestone.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">{milestone.description}</p>
                  {milestone.progress && !milestone.isComplete && (
                    <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${(milestone.progress.current / milestone.progress.target) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
                {milestone.isComplete ? (
                  <Trophy className="w-5 h-5 text-gold" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
