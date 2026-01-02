import { useState, useCallback, useRef } from 'react';
import { formatPapers } from '@/lib/gameUtils';

interface Particle {
  id: number;
  x: number;
  y: number;
  offsetX: number;
  value: number;
}

interface SplinterParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
}

interface PaperClickerProps {
  currentPapers: number;
  passiveIncome: number;
  clickPower: number;
  onClick: () => number;
  criticalStudyActive?: boolean;
}

export function PaperClicker({ currentPapers, passiveIncome, clickPower, onClick, criticalStudyActive }: PaperClickerProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [splinterParticles, setSplinterParticles] = useState<SplinterParticle[]>([]);
  const [isClicking, setIsClicking] = useState(false);
  const [tiltAngle, setTiltAngle] = useState(0);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const value = onClick();
    
    // Rapid tilt and scale animation
    setIsClicking(true);
    setTiltAngle((Math.random() - 0.5) * 20); // Random tilt between -10 and 10 degrees
    setTimeout(() => {
      setIsClicking(false);
      setTiltAngle(0);
    }, 50); // 0.05s duration

    // Create particle at click location with horizontal jitter
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const offsetX = (Math.random() - 0.5) * 60;

    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x,
      y,
      offsetX,
      value,
    };

    setParticles(prev => [...prev, newParticle]);

    // Create 3-5 splinter particles
    const splinterCount = Math.floor(Math.random() * 3) + 3;
    const newSplinters: SplinterParticle[] = [];
    for (let i = 0; i < splinterCount; i++) {
      newSplinters.push({
        id: Date.now() + Math.random() + i,
        x: rect.width / 2,
        y: rect.height * 0.3, // Near pencil tip
        angle: Math.random() * 360,
        distance: 30 + Math.random() * 40,
      });
    }
    setSplinterParticles(prev => [...prev, ...newSplinters]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);

    setTimeout(() => {
      setSplinterParticles(prev => prev.filter(p => !newSplinters.find(ns => ns.id === p.id)));
    }, 500);
  }, [onClick]);

  return (
    <div className="flex flex-col items-center justify-center relative">
      {/* Critical Study Banner */}
      {criticalStudyActive && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 animate-pulse">
          <div className="bg-warning/90 text-warning-foreground px-4 py-1 rounded-full font-display text-lg whitespace-nowrap"
            style={{ textShadow: '0 0 10px hsl(var(--warning))' }}
          >
            ⚡ CRITICAL STUDY! 5x ⚡
          </div>
        </div>
      )}

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
        className={`relative w-[30vw] max-w-[200px] min-w-[100px] aspect-square transition-all duration-[50ms] ${
          criticalStudyActive ? 'animate-pulse-glow' : ''
        }`}
        style={{
          transform: isClicking 
            ? `scale(0.92) rotate(${tiltAngle}deg)` 
            : 'scale(1) rotate(0deg)',
        }}
      >
        <img 
          src="/wooden-park-revival/assets/hero/pencil.webp" 
          alt="Click to write papers"
          className="w-full h-full object-contain drop-shadow-2xl"
          style={{
            filter: criticalStudyActive 
              ? 'drop-shadow(0 0 40px hsl(var(--warning) / 0.8))' 
              : 'drop-shadow(0 0 30px hsl(var(--gold) / 0.6))',
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

        {/* Splinter Particle Bursts */}
        {splinterParticles.map(particle => (
          <div
            key={particle.id}
            className="absolute pointer-events-none z-20 w-2 h-2 bg-gold rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              animation: 'splinter-burst 0.5s ease-out forwards',
              '--angle': `${particle.angle}deg`,
              '--distance': `${particle.distance}px`,
            } as React.CSSProperties}
          />
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
