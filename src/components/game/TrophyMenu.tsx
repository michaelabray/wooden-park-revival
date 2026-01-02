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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/60" 
      onClick={onClose}
    >
      <div 
        className="relative w-[85vw] max-w-lg max-h-[80vh] overflow-hidden animate-bounce-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Panel background image */}
        <img 
          src="/wooden-park-revival/assets/ui/panel-bg.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Content overlay with padding inside the parchment */}
        <div className="relative p-[12%]">
          <button
            onClick={onClose}
            className="absolute top-[8%] right-[8%] p-2 rounded-full bg-secondary/60 hover:bg-secondary/80 transition-colors z-10"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <img 
              src="/wooden-park-revival/assets/ui/trophy.webp" 
              alt="Trophy" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <h2 className="font-display text-xl text-gold">Milestones</h2>
              <p className="text-xs text-muted-foreground">
                {completedCount}/{milestones.length} Complete
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-background/40 rounded-lg p-2 text-center">
              <p className="text-[10px] text-muted-foreground">Total Splinters</p>
              <p className="text-sm font-display text-gold">{formatPapers(totalSplintersEarned)}</p>
            </div>
            <div className="bg-background/40 rounded-lg p-2 text-center">
              <p className="text-[10px] text-muted-foreground">Defeated</p>
              <p className="text-sm font-display text-accent">{antagonistsDefeated}</p>
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
          <div className="space-y-2 max-h-40 overflow-y-auto">
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
        </div>
      </div>
    </div>
  );
}
