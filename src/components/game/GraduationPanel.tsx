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
    <div className="bg-gold/10 rounded-lg p-3 border border-gold/30">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-gold" />
        <h3 className="font-display text-lg text-gold">Graduation</h3>
      </div>

      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-muted-foreground">Lifetime: {formatPapers(totalPapersLifetime)}</span>
        <span className="text-gold font-semibold">✦ {currentSplinters}</span>
      </div>

      {canGraduate ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1 text-success text-sm">
            <span className="font-medium">+{splinterGain} Splinters</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          <button
            onClick={onGraduate}
            className="w-full bg-gold text-gold-foreground py-2 rounded-lg font-display text-sm tracking-wide hover:opacity-90 transition-opacity"
          >
            GRADUATE!
          </button>
        </div>
      ) : (
        <p className="text-xs text-center text-muted-foreground">
          Earn more papers to graduate
        </p>
      )}
    </div>
  );
}
