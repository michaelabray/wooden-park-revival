import { X } from 'lucide-react';

interface VictoryScreenProps {
  onClose: () => void;
}

export function VictoryScreen({ onClose }: VictoryScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md">
      <div className="relative max-w-lg w-full mx-4 animate-bounce-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <X className="w-6 h-6 text-foreground" />
        </button>

        {/* Victory popup image as background */}
        <div 
          className="relative rounded-xl overflow-hidden"
          style={{
            backgroundImage: `url('/wooden-park-revival/assets/ui/victory-popup.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="bg-background/80 p-8 text-center backdrop-blur-sm">
            {/* Founder statue image */}
            <img 
              src="/wooden-park-revival/assets/blueprints/founder.webp"
              alt="Founder Statue"
              className="w-32 h-32 object-contain mx-auto mb-6 animate-pulse-glow"
            />

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
              className="relative overflow-hidden px-8 py-3 rounded-lg transition-transform hover:scale-105 active:scale-95"
            >
              <img 
                src="/wooden-park-revival/assets/ui/button.webp" 
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="relative z-10 font-display text-xl tracking-wide text-foreground">
                Continue Playing
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
