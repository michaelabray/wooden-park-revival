import { useEffect, useState, useRef } from 'react';
import { BLUEPRINTS } from '@/lib/gameUtils';

interface ParallaxBackgroundProps {
  unlockedBlueprints: string[];
}

// Blueprint images for the 2x2 + center layout in the right column
const BLUEPRINT_IMAGES: Record<string, string> = {
  steps: '/wooden-park-revival/assets/blueprints/steps.webp',
  slide: '/wooden-park-revival/assets/blueprints/slide.webp',
  swing: '/wooden-park-revival/assets/blueprints/swings.webp',
  walls: '/wooden-park-revival/assets/blueprints/wall.webp',
  statue: '/wooden-park-revival/assets/blueprints/founder.webp',
};

export function ParallaxBackground({ unlockedBlueprints }: ParallaxBackgroundProps) {
  const [skyOffset, setSkyOffset] = useState(0);
  const directionRef = useRef(1); // 1 = right-to-left, -1 = left-to-right

  useEffect(() => {
    let animationFrame: number;
    let lastTime = 0;

    const animate = (time: number) => {
      if (lastTime === 0) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      // Ping-pong parallax movement - 50% slower (0.0025 instead of 0.005)
      setSkyOffset(prev => {
        const newOffset = prev + delta * 0.0025 * directionRef.current;
        
        // Reverse direction at boundaries
        if (newOffset >= 100) {
          directionRef.current = -1;
          return 100;
        } else if (newOffset <= 0) {
          directionRef.current = 1;
          return 0;
        }
        
        return newOffset;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Sky layer - moves with ping-pong parallax */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/wooden-park-revival/assets/bg/bg-sky.webp')`,
          backgroundSize: '200% 100%',
          backgroundPosition: `${skyOffset}% 0`,
          backgroundRepeat: 'repeat-x',
        }}
      />

      {/* World layer - static */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: `url('/wooden-park-revival/assets/bg/bg-world.webp')`,
          top: '10%',
        }}
      />

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}

// Separate component for the blueprint grid in the right column
export function BlueprintDisplay({ unlockedBlueprints }: { unlockedBlueprints: string[] }) {
  const gridBlueprints = ['steps', 'slide', 'swing', 'walls'];
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 2x2 Grid for first 4 blueprints */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-full">
        {gridBlueprints.map(id => {
          const isUnlocked = unlockedBlueprints.includes(id);
          const imageSrc = BLUEPRINT_IMAGES[id];
          const blueprint = BLUEPRINTS.find(b => b.id === id);
          
          return (
            <div 
              key={id}
              className={`aspect-square flex items-center justify-center rounded-lg transition-all duration-300 ${
                isUnlocked ? 'bg-gold/10' : 'bg-muted/30'
              }`}
            >
              {isUnlocked && imageSrc ? (
                <img
                  src={imageSrc}
                  alt={blueprint?.name || id}
                  className="w-[50%] h-auto object-contain drop-shadow-lg animate-fade-in"
                />
              ) : (
                <div className="w-[50%] aspect-square bg-muted/50 rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-[clamp(0.5rem,1vw,0.75rem)]">?</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Founder statue - larger, overlays center of grid */}
      {unlockedBlueprints.includes('statue') && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={BLUEPRINT_IMAGES.statue}
            alt="Founder Statue"
            className="w-[60%] h-auto object-contain drop-shadow-2xl animate-bounce-in z-10"
            style={{ filter: 'drop-shadow(0 0 20px hsl(var(--gold) / 0.6))' }}
          />
        </div>
      )}
    </div>
  );
}
