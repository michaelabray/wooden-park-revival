import { Crown, Sparkles } from 'lucide-react';

interface VictoryScreenProps {
  onClose: () => void;
}

export function VictoryScreen({ onClose }: VictoryScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="max-w-lg w-full mx-4 text-center animate-bounce-in">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-gold/20 flex items-center justify-center mx-auto animate-pulse-glow">
            <Crown className="w-16 h-16 text-gold" />
          </div>
          <Sparkles className="absolute top-0 right-1/4 w-8 h-8 text-gold animate-bounce" />
          <Sparkles className="absolute bottom-0 left-1/4 w-6 h-6 text-accent animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>

        <h1 className="font-display text-5xl md:text-6xl text-gold mb-4">
          VICTORY!
        </h1>
        <h2 className="font-display text-2xl text-accent mb-6">
          The Wooden Park Lives Again!
        </h2>

        <div className="bento-card-gold p-6 mb-6">
          <p className="text-foreground/90 leading-relaxed">
            Through determination, teamwork, and an impressive amount of A+ papers,
            the students of Bee-Kay Academy have rebuilt the legendary Wooden Park.
            The Modern Playground regime has fallen. Recess will never be the same.
          </p>
        </div>

        <p className="text-muted-foreground mb-6">
          Your legacy will be remembered in the halls of BK forever.
        </p>

        <button
          onClick={onClose}
          className="btn-accent px-8 py-3 rounded-lg font-display text-xl tracking-wide hover:opacity-90 transition-opacity"
        >
          Continue Playing
        </button>
      </div>
    </div>
  );
}
