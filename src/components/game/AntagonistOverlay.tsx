import { useState, useEffect, useCallback } from 'react';
import { UtensilsCrossed, ShieldAlert, X } from 'lucide-react';

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

  const handleDefend = useCallback(() => {
    setIsDismissing(true);
    setTimeout(onSuccess, 200);
  }, [onSuccess]);

  const isSoggy = type === 'soggy';

  return (
    <div className={`overlay-antagonist ${isDismissing ? 'opacity-0' : ''} transition-opacity duration-200`}>
      <div className="bento-card-accent max-w-md w-full mx-4 animate-bounce-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isSoggy ? 'bg-warning/20' : 'bg-destructive/20'
            }`}>
              {isSoggy ? (
                <UtensilsCrossed className="w-6 h-6 text-warning" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-destructive" />
              )}
            </div>
            <div>
              <h2 className="font-display text-2xl text-foreground">
                {isSoggy ? 'CHEF SOGGY!' : 'SAFETY SENTINEL!'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isSoggy ? 'Soggy Tray Incoming!' : 'Evidence Detected!'}
              </p>
            </div>
          </div>
          <div className={`text-3xl font-display ${timeLeft <= 2 ? 'text-destructive animate-shake' : 'text-warning'}`}>
            {timeLeft}s
          </div>
        </div>

        <p className="text-sm text-foreground/80 mb-4">
          {isSoggy
            ? 'Chef Soggy is serving mystery meatloaf! Avoid it or production stops for 20 seconds!'
            : 'The Safety Sentinel spotted your papers! Hide them or lose 10%!'}
        </p>

        <button
          onClick={handleDefend}
          className={`w-full py-4 rounded-lg font-display text-xl tracking-wide transition-all hover:scale-105 active:scale-95 ${
            isSoggy ? 'btn-accent' : 'btn-navy'
          }`}
        >
          {isSoggy ? 'DODGE THE TRAY!' : 'HIDE EVIDENCE!'}
        </button>
      </div>
    </div>
  );
}
