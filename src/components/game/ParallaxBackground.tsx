import { useEffect, useState } from 'react';
import { BLUEPRINTS } from '@/lib/gameUtils';

interface ParallaxBackgroundProps {
  unlockedBlueprints: string[];
}

// Blueprint positions on the world background
const BLUEPRINT_POSITIONS: Record<string, { x: string; y: string; scale: number }> = {
  steps: { x: '15%', y: '65%', scale: 0.8 },
  slide: { x: '35%', y: '55%', scale: 0.9 },
  swing: { x: '60%', y: '60%', scale: 0.85 },
  walls: { x: '80%', y: '58%', scale: 0.75 },
  statue: { x: '50%', y: '45%', scale: 1.1 },
};

const BLUEPRINT_IMAGES: Record<string, string> = {
  steps: './assets/blueprints/steps.webp',
  slide: './assets/blueprints/slide.webp',
  swing: './assets/blueprints/swings.webp',
  walls: './assets/blueprints/wall.webp',
  statue: './assets/blueprints/founder.webp',
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
      {/* Sky layer - moves slowly */}
      <div
        className="absolute inset-0 bg-repeat-x"
        style={{
          backgroundImage: `url('./assets/bg/bg-sky.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: `${skyOffset}px 0`,
          transform: 'scale(1.1)',
        }}
      />

      {/* World layer - static */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: `url('./assets/bg/bg-world.webp')`,
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
