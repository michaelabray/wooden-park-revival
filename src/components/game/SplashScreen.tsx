import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fade after image loads and a brief display
    const timer = setTimeout(() => {
      setIsFading(true);
    }, 1500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, []); // Changing this to an empty array ensures it only runs once on mount

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <img 
        src="assets/ui/splash-screen.webp" 
        alt="Bee-Kay Academy"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}
