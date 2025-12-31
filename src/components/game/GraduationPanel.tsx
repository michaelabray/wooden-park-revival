import { calculateSplinters, formatPapers } from '@/lib/gameUtils';
import { Sparkles, ArrowRight } from 'lucide-react';

interface GraduationPanelProps {
  currentPapers: number;
  totalPapersLifetime: number;
  currentSplinters: number;
  onGraduate: () => number;
}

export function GraduationPanel({
  currentPapers,
  totalPapersLifetime,
  currentSplinters,
  onGraduate,
}: GraduationPanelProps) {
  const potentialSplinters = calculateSplinters(totalPapersLifetime);
  const splinterGain = potentialSplinters - currentSplinters;
  const canGraduate = splinterGain > 0;

  return (
    <div className="bento-card border-gold/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h3 className="font-display text-xl text-gold">Graduation</h3>
          <p className="text-xs text-muted-foreground">Prestige for Golden Splinters</p>
        </div>
      </div>

      <div className="bg-secondary/50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Current Splinters</span>
          <span className="text-gold font-semibold">✦ {currentSplinters}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Lifetime Papers</span>
          <span className="text-foreground font-medium">{formatPapers(totalPapersLifetime)}</span>
        </div>
      </div>

      {canGraduate ? (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-success">
            <span className="font-medium">+{splinterGain} Golden Splinters</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          <button
            onClick={onGraduate}
            className="w-full btn-gold py-3 rounded-lg font-display text-lg tracking-wide hover:opacity-90 transition-opacity"
          >
            GRADUATE!
          </button>
          <p className="text-xs text-center text-muted-foreground">
            Resets papers & students. Keeps blueprints.
          </p>
        </div>
      ) : (
        <div className="text-center py-3">
          <p className="text-sm text-muted-foreground">
            Earn more papers to unlock graduation
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Need ~{formatPapers(2500 * Math.pow((currentSplinters + 1) / 10, 2))} lifetime papers
          </p>
        </div>
      )}
    </div>
  );
}
