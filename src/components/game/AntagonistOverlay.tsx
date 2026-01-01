import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { ANTAGONIST_DIALOGUE } from '@/lib/gameUtils';
import { SlideToStudy } from './SlideToStudy';

interface AntagonistOverlayProps {
  type: 'soggy' | 'sentinel';
  onSuccess: () => void;
  onFailure: () => void;
}

export function AntagonistOverlay({ type, onSuccess, onFailure }: AntagonistOverlayProps) {
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
    setIsDismissing(true);
    setTimeout(onSuccess, 200);
  }, [onSuccess]);

  const isSoggy = type === 'soggy';
  const dialogue = ANTAGONIST_DIALOGUE[type];
  const characterImage = isSoggy 
    ? '/wooden-park-revival/assets/characters/soggy.webp' 
    : '/wooden-park-revival/assets/characters/sentinel.webp';

  return (
    <div className={`overlay-antagonist ${isDismissing ? 'opacity-0' : ''} transition-opacity duration-200`}>
      <div 
        className="relative max-w-xl w-full mx-4 animate-bounce-in rounded-2xl overflow-hidden"
        style={{
          backgroundImage: `url('/wooden-park-revival/assets/ui/panel-bg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="p-10 md:p-12">
          {/* Timer */}
          <div className={`absolute top-6 right-6 text-4xl md:text-5xl font-display ${
            timeLeft <= 2 ? 'text-destructive animate-shake' : 'text-warning'
          }`}>
            {timeLeft}s
          </div>

          {/* Character and Title */}
          <div className="flex items-start gap-5 mb-6">
            <img 
              src={characterImage}
              alt={dialogue.title}
              className="w-24 h-24 md:w-28 md:h-28 object-contain animate-bounce"
            />
            <div className="flex-1">
              <h2 className="font-display text-3xl md:text-4xl text-foreground">
                {dialogue.title}
              </h2>
              <p className="text-lg md:text-xl text-foreground/80 mt-2">
                {dialogue.line}
              </p>
            </div>
          </div>

          {/* Slide to Study */}
          <SlideToStudy 
            onComplete={handleSlideComplete}
            label="Slide to Study →"
          />

          {/* Penalty warning */}
          <p className="text-sm md:text-base text-muted-foreground text-center mt-4">
            {isSoggy 
              ? 'Fail: Production stops for 20 seconds' 
              : 'Fail: Lose 10% of your papers'}
          </p>
        </div>
      </div>
    </div>
  );
}
