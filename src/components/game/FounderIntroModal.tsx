import { useState } from 'react';

interface FounderIntroModalProps {
  onComplete: () => void;
}

const DIALOGUE_STEPS = [
  "Welcome, Architect! I am the Founder of this Academy.",
  "Our beloved Wooden Park has withered into splinters over the years.",
  "I need your academic excellence to bring it back to life.",
  "Write papers, recruit students, and use Golden Splinters to rebuild our legacy.",
  "Rebuild all 5 pieces to reach victory. Let's begin!",
];

export function FounderIntroModal({ onComplete }: FounderIntroModalProps) {
  const [step, setStep] = useState(0);

  const handleClick = () => {
    if (step < DIALOGUE_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleClick}
    >
      <div 
        className="max-w-3xl w-full flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl bg-[#1A1A1A] border border-gold/30"
        style={{ 
          boxShadow: '0 0 40px rgba(255, 215, 0, 0.2)',
        }}
      >
        {/* Founder Image */}
        <div className="shrink-0">
          <img 
            src="/wooden-park-revival/assets/blueprints/founder.webp" 
            alt="The Founder"
            className="w-32 h-32 md:w-48 md:h-48 object-contain rounded-lg"
          />
        </div>

        {/* Dialogue Box */}
        <div className="flex-1 min-w-0">
          <div 
            className="bg-[#2A2418] rounded-lg p-4 md:p-6 border border-gold/20"
            style={{
              backgroundImage: 'linear-gradient(to bottom, rgba(255,215,0,0.05), transparent)',
            }}
          >
            <p className="text-white text-lg md:text-xl font-medium leading-relaxed animate-fade-in">
              "{DIALOGUE_STEPS[step]}"
            </p>
            
            {/* Progress dots */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-1.5">
                {DIALOGUE_STEPS.map((_, i) => (
                  <div 
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i <= step ? 'bg-gold' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
              
              <span className="text-gold/60 text-sm">
                {step < DIALOGUE_STEPS.length - 1 ? 'Click to continue...' : 'Click to begin!'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
