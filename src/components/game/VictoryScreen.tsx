interface VictoryScreenProps {
  onClose: () => void;
}

export function VictoryScreen({ onClose }: VictoryScreenProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80">
      {/* Victory popup - image only, no code-generated text */}
      {/* Entire image is clickable to dismiss */}
      <button 
        className="relative w-[90vw] max-w-xl animate-bounce-in focus:outline-none"
        onClick={onClose}
      >
        <img 
          src="/wooden-park-revival/assets/ui/victory-popup.webp"
          alt="Victory!"
          className="w-full h-auto object-contain drop-shadow-2xl"
        />
        
        {/* Transparent clickable overlay on "Continue Playing" area */}
        <div 
          className="absolute bottom-[10%] left-[20%] right-[20%] h-[15%] cursor-pointer"
          aria-label="Continue Playing"
        />
      </button>
    </div>
  );
}
