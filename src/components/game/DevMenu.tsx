import { X, Plus, Trash2, Sparkles } from 'lucide-react';

interface DevMenuProps {
  onClose: () => void;
  onAddPapers: (amount: number) => void;
  onAddSplinters: (amount: number) => void;
  onWipeSave: () => void;
}

export function DevMenu({ onClose, onAddPapers, onAddSplinters, onWipeSave }: DevMenuProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="bento-card max-w-sm w-full mx-4 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-accent">🔧 Dev Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Secret developer tools. Shh!
        </p>

        <div className="space-y-3">
          <button
            onClick={() => onAddPapers(1000000)}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Plus className="w-5 h-5 text-success" />
            <span className="font-medium">Add 1M Papers</span>
          </button>

          <button
            onClick={() => onAddSplinters(1000)}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="font-medium">Add 1k Splinters</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure? This will erase ALL progress!')) {
                onWipeSave();
                onClose();
              }
            }}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-destructive/20 hover:bg-destructive/30 transition-colors text-destructive"
          >
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Wipe Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
