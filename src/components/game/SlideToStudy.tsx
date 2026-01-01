import { useState, useRef, useCallback } from 'react';

interface SlideToStudyProps {
  onComplete: () => void;
  label: string;
}

export function SlideToStudy({ onComplete, label }: SlideToStudyProps) {
  const [sliderValue, setSliderValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback((clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderValue(percentage);

    if (percentage >= 95) {
      onComplete();
    }
  }, [onComplete]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleDrag(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleDrag(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (sliderValue < 95) {
      setSliderValue(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleDrag(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleDrag(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (sliderValue < 95) {
      setSliderValue(0);
    }
  };

  return (
    <div
      ref={sliderRef}
      className="relative h-14 rounded-full overflow-hidden cursor-pointer select-none touch-none"
      style={{
        background: 'linear-gradient(90deg, hsl(var(--secondary)), hsl(var(--muted)))',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress fill */}
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-colors"
        style={{
          width: `${sliderValue}%`,
          background: sliderValue >= 95 
            ? 'linear-gradient(90deg, hsl(var(--success)), hsl(145 60% 50%))' 
            : 'linear-gradient(90deg, hsl(var(--accent)), hsl(12 70% 60%))',
        }}
      />

      {/* Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className={`font-display text-lg tracking-wide transition-opacity ${
          sliderValue > 30 ? 'opacity-0' : 'opacity-100'
        }`}>
          {label}
        </span>
      </div>

      {/* Slider thumb */}
      <div
        className="absolute top-1 bottom-1 w-12 rounded-full flex items-center justify-center shadow-lg transition-transform"
        style={{
          left: `calc(${sliderValue}% - ${sliderValue > 5 ? '48px' : '4px'})`,
          background: 'linear-gradient(135deg, hsl(var(--paper)), hsl(var(--paper-dark)))',
        }}
      >
        <div className="flex gap-0.5">
          <div className="w-1 h-6 rounded-full bg-muted-foreground/40" />
          <div className="w-1 h-6 rounded-full bg-muted-foreground/40" />
          <div className="w-1 h-6 rounded-full bg-muted-foreground/40" />
        </div>
      </div>

      {/* Arrow hints */}
      {sliderValue < 30 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 animate-pulse pointer-events-none">
          <span className="text-muted-foreground">›</span>
          <span className="text-muted-foreground">›</span>
          <span className="text-muted-foreground">›</span>
        </div>
      )}
    </div>
  );
}
