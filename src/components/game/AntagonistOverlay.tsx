import { useState, useEffect, useCallback, useRef } from 'react';
import { ANTAGONIST_DIALOGUE } from '@/lib/gameUtils';
import { SlideToStudy } from './SlideToStudy';

interface AntagonistOverlayProps {
  type: 'soggy' | 'sentinel';
  onSuccess: (completionTime: number) => void;
  onFailure: () => void;
  startTime: number;
}

export function AntagonistOverlay({ type, onSuccess, onFailure, startTime }: AntagonistOverlayProps) {
  const [timeLeft, setTimeLeft] = useState(type === 'soggy' ? 8 : 5);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFailure();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onFailure]);

  const handleSlideComplete = useCallback(() => {
    const completionTime = Date.now() - startTime;
    setIsDismissing(true);
    setTimeout(() => onSuccess(completionTime), 200);
  }, [onSuccess, startTime]);

  const isSoggy = type === 'soggy';
  const dialogue = ANTAGONIST_DIALOGUE[type];
  const characterImage = isSoggy 
    ? '/wooden-park-revival/assets/characters/soggy.webp' 
    : '/wooden-park-revival/assets/characters/sentinel.webp';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-background/60 ${isDismissing ? 'opacity-0' : ''} transition-opacity duration-200`}>
      <div className="relative w-[90vw] max-w-xl max-h-[80vh] overflow-hidden animate-bounce-in">
        {/* Panel background image - kept for antagonist */}
        <img 
          src="/wooden-park-revival/assets/ui/panel-bg.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Content overlay with padding inside the parchment - Dark charcoal text */}
        <div className="relative p-[15%]">
          {/* Timer */}
          <div className={`absolute top-[10%] right-[10%] text-3xl md:text-4xl font-display ${
            timeLeft <= 2 ? 'text-destructive animate-shake' : 'text-warning'
          }`}>
            {timeLeft}s
          </div>

          {/* Character and Title */}
          <div className="flex items-start gap-4 mb-6">
            <img 
              src={characterImage}
              alt={dialogue.title}
              className="w-16 h-16 md:w-20 md:h-20 object-contain animate-bounce shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl md:text-2xl text-[#1A1A1A]">
                {dialogue.title}
              </h2>
              <p className="text-sm md:text-base text-[#1A1A1A]/80 mt-1">
                {dialogue.line}
              </p>
            </div>
          </div>

          {/* Slide to Study - Full width of parchment */}
          <SlideToStudy 
            onComplete={handleSlideComplete}
            label="Slide to Study →"
          />

          {/* Penalty warning */}
          <p className="text-xs md:text-sm text-[#1A1A1A]/60 text-center mt-4">
            {isSoggy 
              ? 'Fail: Production stops for 20 seconds' 
              : 'Fail: Lose 10% of your papers'}
          </p>
        </div>
      </div>
    </div>
  );
}
