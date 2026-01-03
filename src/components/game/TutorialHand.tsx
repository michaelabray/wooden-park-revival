import { Goal } from '@/lib/goalSystem';

interface TutorialHandProps {
  currentGoal: Goal | null;
  totalPapersLifetime: number;
  currentPapers: number;
  isShopOpen: boolean;
  targetRef?: 'pencil' | 'cart' | 'fruitsnack' | 'daydreamer' | null;
}

export function TutorialHand({ 
  currentGoal, 
  totalPapersLifetime, 
  currentPapers,
  isShopOpen,
  targetRef,
}: TutorialHandProps) {
  if (!currentGoal) return null;

  // Goal 1: Show hand on pencil until 15 papers reached
  if (currentGoal.id === 1 && totalPapersLifetime < 15) {
    if (targetRef !== 'pencil') return null;
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 animate-tutorial-pulse">
          <img 
            src="/wooden-park-revival/assets/ui/tutorial-hand.webp" 
            alt="Click here!"
            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg"
          />
        </div>
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-gold/90 text-background px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap animate-fade-in">
          Click to write A+ papers!
        </div>
      </div>
    );
  }

  // Goal 2: Show hand on cart, then on Daydreamer in shop
  if (currentGoal.id === 2) {
    if (!isShopOpen && targetRef === 'cart') {
      return (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full animate-tutorial-pulse z-30 pointer-events-none">
          <img 
            src="/wooden-park-revival/assets/ui/tutorial-hand.webp" 
            alt="Click here!"
            className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-lg"
          />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gold/90 text-background px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
            Open Shop!
          </div>
        </div>
      );
    }
    if (isShopOpen && targetRef === 'daydreamer') {
      return (
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full animate-tutorial-pulse z-30 pointer-events-none">
          <img 
            src="/wooden-park-revival/assets/ui/tutorial-hand.webp" 
            alt="Buy this!"
            className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-lg -rotate-90"
          />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gold/90 text-background px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
            Buy Daydreamer!
          </div>
        </div>
      );
    }
  }

  // Goal 3: Show hand on Fruit Snack once player hits 50 papers
  if (currentGoal.id === 3 && currentPapers >= 50 && targetRef === 'fruitsnack') {
    return (
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full animate-tutorial-pulse z-30 pointer-events-none">
        <img 
          src="/wooden-park-revival/assets/ui/tutorial-hand.webp" 
          alt="Click here!"
          className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-lg rotate-180"
        />
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gold/90 text-background px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
          Activate Boost!
        </div>
      </div>
    );
  }

  return null;
}
