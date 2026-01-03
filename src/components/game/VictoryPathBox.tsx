interface VictoryPathBoxProps {
  unlockedCount: number;
}

export function VictoryPathBox({ unlockedCount }: VictoryPathBoxProps) {
  return (
    <div 
      className="bg-[#1A1A1A]/80 backdrop-blur-sm rounded-lg p-3 border border-gold/20"
      style={{ 
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
      }}
    >
      <h4 className="text-gold font-display text-sm mb-2 flex items-center gap-1">
        <img 
          src="/wooden-park-revival/assets/icons/splinter.webp" 
          alt=""
          className="w-4 h-4 object-contain"
        />
        Victory Path
      </h4>
      <p className="text-white/80 text-xs leading-relaxed">
        Graduate to earn <span className="text-gold font-semibold">Golden Splinters</span>. 
        Use Splinters to unlock pieces of the Wooden Park. 
        Unlock all <span className="text-gold font-semibold">5 pieces</span> to restore the park and reach victory!
      </p>
      <div className="mt-2 flex items-center gap-1">
        <span className="text-white/60 text-xs">Progress:</span>
        <span className="text-gold font-semibold text-xs">{unlockedCount}/5</span>
        <div className="flex-1 ml-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gold rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
