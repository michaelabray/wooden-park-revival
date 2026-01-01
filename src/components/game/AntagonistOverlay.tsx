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
  const [timeLeft, setTimeLeft] = useState(type === 'soggy' ? 5 : 3);
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
    ? 'assets/characters/soggy.webp' 
    : 'assets/characters/sentinel.webp';

  return (
    <div className={`overlay-antagonist ${isDismissing ? 'opacity-0' : ''} transition-opacity duration-200`}>
      <div 
        className="relative max-w-md w-full mx-4 animate-bounce-in rounded-xl overflow-hidden"
        style={{
          backgroundImage: `url('assets/ui/panel-bg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-background/85 p-6 backdrop-blur-sm">
          {/* Timer */}
          <div className={`absolute top-4 right-4 text-3xl font-display ${
            timeLeft <= 2 ? 'text-destructive animate-shake' : 'text-warning'
          }`}>
            {timeLeft}s
          </div>

          {/* Character and Title */}
          <div className="flex items-start gap-4 mb-4">
            <img 
              src={characterImage}
              alt={dialogue.title}
              className="w-20 h-20 object-contain animate-bounce"
            />
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-foreground">
                {dialogue.title}
              </h2>
              <p className="text-sm text-foreground/80 mt-1">
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
          <p className="text-xs text-muted-foreground text-center mt-3">
            {isSoggy 
              ? 'Fail: Production stops for 20 seconds' 
              : 'Fail: Lose 10% of your papers'}
          </p>
        </div>
      </div>
    </div>
  );
}
