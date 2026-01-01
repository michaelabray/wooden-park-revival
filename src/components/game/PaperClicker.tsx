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
    <div className="flex flex-col items-center justify-center p-6 relative">
      {/* Paper Counter with icon */}
      <div className="flex items-center gap-6 mb-8">
        <img 
          src="./assets/icons/paper.webp" 
          alt="Papers" 
          className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg"
        />
        <div className="text-center">
          <h2 className="text-6xl md:text-8xl font-display text-gold drop-shadow-lg"
            style={{ textShadow: '0 0 30px hsl(var(--gold) / 0.5)' }}
          >
            {formatPapers(currentPapers)}
          </h2>
          <p className="text-xl md:text-2xl text-foreground/80 font-medium">A+ Papers</p>
        </div>
      </div>

      {/* Pencil Click Button - The Hero */}
      <button
        onClick={handleClick}
        className={`relative w-48 h-48 md:w-64 md:h-64 transition-transform duration-100 ${
          isClicking ? 'scale-90' : 'hover:scale-105'
        }`}
      >
        <img 
          src="./assets/hero/pencil.webp" 
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
              src="./assets/icons/click-plus-one.webp" 
              alt="+1"
              className="w-12 h-12 object-contain"
            />
          </div>
        ))}
      </button>

      {/* Stats - Compact visual counters */}
      <div className="mt-8 flex items-center gap-8">
        <div className="flex items-center gap-3 bg-secondary/60 backdrop-blur-sm px-8 py-4 rounded-full border border-accent/30">
          <span className="text-accent font-display text-3xl md:text-4xl">{formatPapers(clickPower)}</span>
          <span className="text-foreground/70 text-xl md:text-2xl">/click</span>
        </div>
        <div className="flex items-center gap-3 bg-secondary/60 backdrop-blur-sm px-8 py-4 rounded-full border border-gold/30">
          <span className="text-gold font-display text-3xl md:text-4xl">{formatPapers(passiveIncome)}</span>
          <span className="text-foreground/70 text-xl md:text-2xl">/sec</span>
        </div>
      </div>
    </div>
  );
}
