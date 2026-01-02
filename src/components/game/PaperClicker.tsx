import { useState, useCallback } from 'react';
import { formatPapers } from '@/lib/gameUtils';

interface Particle {
  id: number;
  x: number;
  y: number;
  offsetX: number;
  value: number;
}

interface PaperClickerProps {
  currentPapers: number;
  passiveIncome: number;
  clickPower: number;
  onClick: () => number;
}

export function PaperClicker({ currentPapers, passiveIncome, clickPower, onClick }: PaperClickerProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClicking, setIsClicking] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const value = onClick();
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 100);

    // Create particle at click location with horizontal jitter
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const offsetX = (Math.random() - 0.5) * 60; // Random horizontal jitter

    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x,
      y,
      offsetX,
      value,
    };

    setParticles(prev => [...prev, newParticle]);

    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  }, [onClick]);

  return (
    <div className="flex flex-col items-center justify-center relative">
      {/* Paper Counter with icon - Top of middle column */}
      <div className="flex items-center gap-3 mb-4">
        <img 
          src="/wooden-park-revival/assets/icons/paper.webp" 
          alt="Papers" 
          className="w-[8vw] max-w-[64px] min-w-[32px] object-contain drop-shadow-lg"
        />
        <div className="text-center">
          <h2 className="text-[clamp(1.5rem,6vw,4rem)] font-display text-gold drop-shadow-lg leading-none"
            style={{ textShadow: '0 0 30px hsl(var(--gold) / 0.5)' }}
          >
            {formatPapers(currentPapers)}
          </h2>
          <p className="text-[clamp(0.6rem,1.5vw,1rem)] text-foreground/80 font-medium">A+ Papers</p>
        </div>
      </div>

      {/* Pencil Click Button - The Hero (Center) */}
      <button
        onClick={handleClick}
        className={`relative w-[30vw] max-w-[200px] min-w-[100px] aspect-square transition-transform duration-100 ${
          isClicking ? 'scale-90' : 'hover:scale-105'
        }`}
      >
        <img 
          src="/wooden-park-revival/assets/hero/pencil.webp" 
          alt="Click to write papers"
          className="w-full h-full object-contain drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 0 30px hsl(var(--gold) / 0.6))',
          }}
        />
        
        {/* Floating +1 Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute pointer-events-none z-20"
            style={{
              left: particle.x,
              top: particle.y,
              animation: 'float-up-jitter 1s ease-out forwards',
              '--jitter-x': `${particle.offsetX}px`,
            } as React.CSSProperties}
          >
            <img 
              src="/wooden-park-revival/assets/icons/click-plus-one.webp" 
              alt="+1"
              className="w-8 h-8 object-contain"
            />
          </div>
        ))}
      </button>

      {/* Stats - Side by side to save vertical space */}
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1 bg-secondary/60 backdrop-blur-sm px-3 py-1 rounded-full border border-accent/30">
          <span className="text-accent font-display text-[clamp(0.75rem,2vw,1.5rem)]">{formatPapers(clickPower)}</span>
          <span className="text-foreground/70 text-[clamp(0.5rem,1.2vw,0.875rem)]">/click</span>
        </div>
        <div className="flex items-center gap-1 bg-secondary/60 backdrop-blur-sm px-3 py-1 rounded-full border border-gold/30">
          <span className="text-gold font-display text-[clamp(0.75rem,2vw,1.5rem)]">{formatPapers(passiveIncome)}</span>
          <span className="text-foreground/70 text-[clamp(0.5rem,1.2vw,0.875rem)]">/sec</span>
        </div>
      </div>
    </div>
  );
}
