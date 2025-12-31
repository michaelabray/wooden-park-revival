import { formatPapers } from '@/lib/gameUtils';
import { Gift } from 'lucide-react';

interface WelcomeBackModalProps {
  earnings: number;
  onDismiss: () => void;
}

export function WelcomeBackModal({ earnings, onDismiss }: WelcomeBackModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="bento-card-gold max-w-sm w-full mx-4 animate-bounce-in text-center">
        <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
          <Gift className="w-8 h-8 text-gold" />
        </div>

        <h2 className="font-display text-3xl text-gold mb-2">Welcome Back!</h2>
        <p className="text-muted-foreground mb-4">
          Your students kept working while you were away
        </p>

        <div className="bg-secondary/50 rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground">You earned</p>
          <p className="text-3xl font-display text-gold">
            {formatPapers(earnings)} A+ Papers
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="w-full btn-gold py-3 rounded-lg font-display text-lg tracking-wide hover:opacity-90 transition-opacity"
        >
          COLLECT!
        </button>
      </div>
    </div>
  );
}
