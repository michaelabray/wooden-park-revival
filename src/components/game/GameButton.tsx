import React from 'react';

interface GameButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'gold' | 'accent';
  className?: string;
}

export function GameButton({ 
  onClick, 
  children, 
  disabled = false, 
  variant = 'primary',
  className = '' 
}: GameButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden transition-all duration-150 hover:scale-105 active:scale-95 ${
        disabled ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100' : ''
      } ${className}`}
    >
      {/* Button background image */}
      <img 
        src="./assets/ui/button.webp" 
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: disabled ? 'grayscale(50%)' : 'none' }}
      />
      
      {/* Content overlay */}
      <span className={`relative z-10 px-6 py-3 font-display text-lg tracking-wide block ${
        variant === 'gold' ? 'text-background' : 'text-foreground'
      }`}>
        {children}
      </span>
    </button>
  );
}
