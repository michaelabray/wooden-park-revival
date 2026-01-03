import { Goal } from '@/lib/goalSystem';

interface GoalBannerProps {
  currentGoal: Goal | null;
  nextGoal: Goal | null;
  progress: { current: number; total: number };
}

export function GoalBanner({ currentGoal, nextGoal, progress }: GoalBannerProps) {
  if (!currentGoal) {
    // All goals complete - show victory state
    return (
      <div className="px-2 md:px-4 py-2">
        <div 
          className="bg-[#1A1A1A] rounded-lg px-4 py-3 animate-fade-in"
          style={{ 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.3)',
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-gold font-display text-lg">🏆 Victory Achieved!</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 md:px-4 py-2">
      <div 
        className="bg-[#1A1A1A] rounded-lg px-4 py-3 animate-fade-in"
        style={{ 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 215, 0, 0.2)',
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Current Goal */}
          <div className="flex items-center gap-2">
            <span className="text-gold font-display text-sm md:text-base">🎯 Goal {currentGoal.id}:</span>
            <span className="text-white font-semibold text-sm md:text-base">{currentGoal.description}</span>
          </div>

          {/* Progress indicator */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: progress.total }).map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i < progress.current ? 'bg-gold' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Next Goal Preview */}
          {nextGoal && (
            <div className="flex items-center gap-2 text-white/60 text-xs md:text-sm">
              <span>Next:</span>
              <span className="text-gold/80 italic">{nextGoal.nextHint}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
