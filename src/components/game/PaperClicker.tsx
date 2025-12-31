import { useState, useCallback } from 'react';
import { Pencil } from 'lucide-react';
import { formatPapers } from '@/lib/gameUtils';

interface Particle {
  id: number;
  x: number;
  y: number;
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

    // Create particle
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x,
      y,
      value,
    };

    setParticles(prev => [...prev, newParticle]);

    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  }, [onClick]);

  return (
    <div className="bento-card-accent flex flex-col items-center justify-center p-8 relative">
      {/* Main Counter */}
      <div className="text-center mb-6">
        <h2 className="text-5xl md:text-6xl font-display text-gold mb-2 animate-pulse-glow inline-block px-4 py-2 rounded-lg">
          {formatPapers(currentPapers)}
        </h2>
        <p className="text-lg text-foreground/80">A+ Papers</p>
      </div>

      {/* Click Button */}
      <button
        onClick={handleClick}
        className={`btn-clicker w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-xl transition-transform duration-100 relative ${
          isClicking ? 'scale-90' : 'hover:scale-105'
        }`}
      >
        <Pencil className="w-16 h-16 md:w-20 md:h-20 text-primary rotate-45" />
        
        {/* Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="paper-particle"
            style={{
              left: particle.x,
              top: particle.y,
            }}
          >
            +{particle.value.toFixed(1)} A+
          </div>
        ))}
      </button>

      {/* Stats */}
      <div className="mt-6 text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          <span className="text-accent font-semibold">{clickPower.toFixed(1)}</span> per click
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="text-gold font-semibold">{formatPapers(passiveIncome)}</span> per second
        </p>
      </div>
    </div>
  );
}
