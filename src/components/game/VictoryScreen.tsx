import { X } from 'lucide-react';

interface VictoryScreenProps {
  onClose: () => void;
}

export function VictoryScreen({ onClose }: VictoryScreenProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60">
      {/* Victory popup - image only, no code-generated text */}
      <div 
        className="relative w-[90vw] max-w-xl animate-bounce-in cursor-pointer"
        onClick={onClose}
      >
        <img 
          src="/wooden-park-revival/assets/ui/victory-popup.webp"
          alt="Victory!"
          className="w-full h-auto object-contain drop-shadow-2xl"
        />
        
        {/* Transparent close button in top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-[5%] right-[5%] p-2 rounded-full bg-secondary/60 hover:bg-secondary/80 transition-colors"
        >
          <X className="w-6 h-6 text-foreground" />
        </button>
      </div>
    </div>
  );
}
