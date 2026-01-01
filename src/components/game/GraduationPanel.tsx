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
    <div className="bg-gold/10 rounded-xl p-5 border border-gold/30">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-8 h-8 text-gold" />
        <h3 className="font-display text-2xl text-gold">Graduation</h3>
      </div>

      <div className="flex items-center justify-between text-base mb-4">
        <span className="text-muted-foreground">Lifetime: {formatPapers(totalPapersLifetime)}</span>
        <span className="text-gold font-semibold text-lg">✦ {currentSplinters}</span>
      </div>

      {canGraduate ? (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-success text-base">
            <span className="font-medium">+{splinterGain} Splinters</span>
            <ArrowRight className="w-5 h-5" />
          </div>
          <button
            onClick={onGraduate}
            className="w-full bg-gold text-gold-foreground py-3 rounded-xl font-display text-lg tracking-wide hover:opacity-90 transition-opacity"
          >
            GRADUATE!
          </button>
        </div>
      ) : (
        <p className="text-sm text-center text-muted-foreground">
          Earn more papers to graduate
        </p>
      )}
    </div>
  );
}
