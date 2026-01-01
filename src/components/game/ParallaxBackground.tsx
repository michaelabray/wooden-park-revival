import { useEffect, useState } from 'react';
import { BLUEPRINTS } from '@/lib/gameUtils';

interface ParallaxBackgroundProps {
  unlockedBlueprints: string[];
}

// Blueprint positions - organized in a row at the bottom of the screen
const BLUEPRINT_POSITIONS: Record<string, { x: string; y: string; scale: number }> = {
  steps: { x: '10%', y: '78%', scale: 0.7 },
  slide: { x: '30%', y: '76%', scale: 0.75 },
  swing: { x: '50%', y: '77%', scale: 0.7 },
  walls: { x: '70%', y: '78%', scale: 0.65 },
  statue: { x: '90%', y: '75%', scale: 0.8 },
};

const BLUEPRINT_IMAGES: Record<string, string> = {
  steps: '/wooden-park-revival/assets/blueprints/steps.webp',
  slide: '/wooden-park-revival/assets/blueprints/slide.webp',
  swing: '/wooden-park-revival/assets/blueprints/swings.webp',
  walls: '/wooden-park-revival/assets/blueprints/wall.webp',
  statue: '/wooden-park-revival/assets/blueprints/founder.webp',
};

export function ParallaxBackground({ unlockedBlueprints }: ParallaxBackgroundProps) {
  const [skyOffset, setSkyOffset] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    let lastTime = 0;

    const animate = (time: number) => {
      if (lastTime === 0) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;

      // Slow parallax movement
      setSkyOffset(prev => (prev + delta * 0.002) % 200);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Sky layer - moves slowly with smooth parallax */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/wooden-park-revival/assets/bg/bg-sky.webp')`,
          backgroundSize: '200% 100%',
          backgroundPosition: `${skyOffset % 100}% 0`,
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

      {/* Unlocked blueprints rendered on top of world */}
      {unlockedBlueprints.map(blueprintId => {
        const position = BLUEPRINT_POSITIONS[blueprintId];
        const imageSrc = BLUEPRINT_IMAGES[blueprintId];
        
        if (!position || !imageSrc) return null;

        return (
          <img
            key={blueprintId}
            src={imageSrc}
            alt={BLUEPRINTS.find(b => b.id === blueprintId)?.name || blueprintId}
            className="absolute animate-fade-in drop-shadow-2xl"
            style={{
              left: position.x,
              top: position.y,
              transform: `translate(-50%, -50%) scale(${position.scale})`,
              maxWidth: '120px',
              zIndex: 5,
            }}
          />
        );
      })}

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}
