import { X } from 'lucide-react';

interface VictoryScreenProps {
  onClose: () => void;
}

export function VictoryScreen({ onClose }: VictoryScreenProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 backdrop-blur-md">
      <div 
        className="relative max-w-lg w-full mx-4 animate-bounce-in rounded-xl overflow-hidden"
        style={{
          backgroundImage: `url('./assets/ui/victory-popup.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="p-8 text-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-secondary/80 hover:bg-secondary transition-colors"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>

          {/* Founder statue image */}
          <img 
            src="./assets/blueprints/founder.webp"
            alt="Founder Statue"
            className="w-32 h-32 object-contain mx-auto mb-6 drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 20px hsl(var(--gold) / 0.6))' }}
          />

          <h1 className="font-display text-5xl md:text-6xl text-gold mb-4 drop-shadow-lg">
            VICTORY!
          </h1>
          <h2 className="font-display text-2xl text-accent mb-6">
            The Wooden Park Lives Again!
          </h2>

          <p className="text-foreground/90 leading-relaxed mb-6 max-w-md mx-auto">
            Through determination, teamwork, and an impressive amount of A+ papers,
            the students of Bee-Kay Academy have rebuilt the legendary Wooden Park.
          </p>

          <p className="text-foreground/70 text-sm mb-6">
            Your legacy will be remembered in the halls of BK forever.
          </p>

          <button
            onClick={onClose}
            className="relative overflow-hidden px-8 py-3 rounded-lg transition-transform hover:scale-105 active:scale-95"
          >
            <img 
              src="./assets/ui/button.webp" 
              alt=""
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
            <span className="relative z-10 font-display text-xl tracking-wide text-foreground">
              Continue Playing
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
