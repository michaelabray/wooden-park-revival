import { useState, useEffect, useCallback, useRef } from 'react';
import { UNITS, calculateCost, calculateSplinters, getSplinterMultiplier } from '@/lib/gameUtils';

export interface GameState {
  currentPapers: number;
  totalPapersLifetime: number;
  goldenSplinters: number;
  unlockedBlueprints: string[];
  units: Record<string, number>;
  fruitSnackActive: boolean;
  fruitSnackEndTime: number;
  lastSaveTimestamp: number;
  antagonistPaused: boolean;
  antagonistPausedUntil: number;
  hasSeenVictory: boolean;
}

const INITIAL_STATE: GameState = {
  currentPapers: 0,
  totalPapersLifetime: 0,
  goldenSplinters: 0,
  unlockedBlueprints: [],
  units: {},
  fruitSnackActive: false,
  fruitSnackEndTime: 0,
  lastSaveTimestamp: Date.now(),
  antagonistPaused: false,
  antagonistPausedUntil: 0,
  hasSeenVictory: false,
};

const STORAGE_KEY = 'bk-academy-save';

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  const [offlineEarnings, setOfflineEarnings] = useState<number | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Determine victory screen
  const markVictorySeen = () => {
    setState(prev => ({ ...prev, hasSeenVictory: true }));
  };
  
  // Calculate passive income per second
  const getPassiveIncome = useCallback(() => {
    let baseIncome = 0;
    UNITS.forEach(unit => {
      const owned = state.units[unit.id] || 0;
      baseIncome += owned * unit.baseYield;
    });

    // Apply splinter multiplier
    const splinterMult = getSplinterMultiplier(state.goldenSplinters);
    
    // Apply fruit snack multiplier
    const fruitSnackMult = state.fruitSnackActive ? 2 : 1;

    // Apply blueprint bonuses
    const slideMult = state.unlockedBlueprints.includes('slide') ? 1.5 : 1;
    const wallsMult = state.unlockedBlueprints.includes('walls') ? 3 : 1;

    return baseIncome * splinterMult * fruitSnackMult * slideMult * wallsMult;
  }, [state.units, state.goldenSplinters, state.fruitSnackActive, state.unlockedBlueprints]);

  // Calculate click power
  const getClickPower = useCallback(() => {
    const splinterMult = getSplinterMultiplier(state.goldenSplinters);
    const stepsMult = state.unlockedBlueprints.includes('steps') ? 1.2 : 1;
    const wallsMult = state.unlockedBlueprints.includes('walls') ? 3 : 1;
    return 1 * splinterMult * stepsMult * wallsMult;
  }, [state.goldenSplinters, state.unlockedBlueprints]);

  // Handle offline progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedState = JSON.parse(saved) as GameState;
        const now = Date.now();
        const secondsElapsed = Math.floor((now - parsedState.lastSaveTimestamp) / 1000);
        
        if (secondsElapsed > 10) {
          // Calculate offline earnings (50% of normal rate)
          let baseIncome = 0;
          UNITS.forEach(unit => {
            const owned = parsedState.units[unit.id] || 0;
            baseIncome += owned * unit.baseYield;
          });
          
          const splinterMult = getSplinterMultiplier(parsedState.goldenSplinters);
          const slideMult = parsedState.unlockedBlueprints.includes('slide') ? 1.5 : 1;
          const wallsMult = parsedState.unlockedBlueprints.includes('walls') ? 3 : 1;
          
          const passiveRate = baseIncome * splinterMult * slideMult * wallsMult;
          const earnings = Math.floor(passiveRate * 0.5 * secondsElapsed);
          
          if (earnings > 0) {
            setOfflineEarnings(earnings);
            setState(prev => ({
              ...prev,
              currentPapers: prev.currentPapers + earnings,
              totalPapersLifetime: prev.totalPapersLifetime + earnings,
              lastSaveTimestamp: now,
              fruitSnackActive: false,
            }));
          }
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    const saveState = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...stateRef.current,
        lastSaveTimestamp: Date.now(),
      }));
    };

    const interval = setInterval(saveState, 5000);
    window.addEventListener('beforeunload', saveState);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', saveState);
      saveState();
    };
  }, []);

  // Game loop
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const now = Date.now();
        
        // Check fruit snack expiry
        const fruitSnackActive = prev.fruitSnackActive && now < prev.fruitSnackEndTime;
        
        // Calculate passive income
        let baseIncome = 0;
        UNITS.forEach(unit => {
          const owned = prev.units[unit.id] || 0;
          baseIncome += owned * unit.baseYield;
        });

        const splinterMult = getSplinterMultiplier(prev.goldenSplinters);
        const fruitSnackMult = fruitSnackActive ? 2 : 1;
        const slideMult = prev.unlockedBlueprints.includes('slide') ? 1.5 : 1;
        const wallsMult = prev.unlockedBlueprints.includes('walls') ? 3 : 1;
        
        // Check antagonist pause expiry
        const antagonistPaused = prev.antagonistPaused && now < prev.antagonistPausedUntil;

        const income = baseIncome * splinterMult * fruitSnackMult * slideMult * wallsMult;

        return {
          ...prev,
          currentPapers: prev.currentPapers + income,
          totalPapersLifetime: prev.totalPapersLifetime + income,
          fruitSnackActive,
          antagonistPaused,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Click handler
  const handleClick = useCallback(() => {
    const clickPower = getClickPower();
    setState(prev => ({
      ...prev,
      currentPapers: prev.currentPapers + clickPower,
      totalPapersLifetime: prev.totalPapersLifetime + clickPower,
    }));
    return clickPower;
  }, [getClickPower]);

  // Buy unit
  const buyUnit = useCallback((unitId: string) => {
    const unit = UNITS.find(u => u.id === unitId);
    if (!unit) return false;

    const owned = state.units[unitId] || 0;
    const cost = calculateCost(unit.baseCost, owned);

    if (state.currentPapers >= cost) {
      setState(prev => ({
        ...prev,
        currentPapers: prev.currentPapers - cost,
        units: {
          ...prev.units,
          [unitId]: (prev.units[unitId] || 0) + 1,
        },
      }));
      return true;
    }
    return false;
  }, [state.currentPapers, state.units]);

  // Activate fruit snack
  const activateFruitSnack = useCallback(() => {
    if (state.currentPapers >= 50) {
      setState(prev => ({
        ...prev,
        currentPapers: prev.currentPapers - 50,
        fruitSnackActive: true,
        fruitSnackEndTime: Date.now() + 30000,
      }));
      return true;
    }
    return false;
  }, [state.currentPapers]);

  // Buy blueprint
  const buyBlueprint = useCallback((blueprintId: string, cost: number) => {
    if (state.goldenSplinters >= cost && !state.unlockedBlueprints.includes(blueprintId)) {
      setState(prev => ({
        ...prev,
        goldenSplinters: prev.goldenSplinters - cost,
        unlockedBlueprints: [...prev.unlockedBlueprints, blueprintId],
      }));
      return true;
    }
    return false;
  }, [state.goldenSplinters, state.unlockedBlueprints]);

  // Graduate (prestige)
  const graduate = useCallback(() => {
    const newSplinters = calculateSplinters(state.totalPapersLifetime);
    if (newSplinters > state.goldenSplinters) {
      setState(prev => ({
        ...INITIAL_STATE,
        goldenSplinters: newSplinters,
        unlockedBlueprints: prev.unlockedBlueprints,
        lastSaveTimestamp: Date.now(),
      }));
      return newSplinters - state.goldenSplinters;
    }
    return 0;
  }, [state.totalPapersLifetime, state.goldenSplinters]);

  // Antagonist effects
  const applyAntagonistPenalty = useCallback((type: 'soggy' | 'sentinel') => {
    setState(prev => {
      if (type === 'soggy') {
        return {
          ...prev,
          antagonistPaused: true,
          antagonistPausedUntil: Date.now() + 20000,
        };
      } else {
        return {
          ...prev,
          currentPapers: prev.currentPapers * 0.9,
        };
      }
    });
  }, []);

  // Dev functions
  const addPapers = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      currentPapers: prev.currentPapers + amount,
      totalPapersLifetime: prev.totalPapersLifetime + amount,
    }));
  }, []);

  const addSplinters = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      goldenSplinters: prev.goldenSplinters + amount,
    }));
  }, []);

  const wipeSave = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_STATE);
  }, []);

  const dismissOfflineEarnings = useCallback(() => {
    setOfflineEarnings(null);
  }, []);

  return {
    state,
    offlineEarnings,
    dismissOfflineEarnings,
    getPassiveIncome,
    getClickPower,
    handleClick,
    buyUnit,
    activateFruitSnack,
    buyBlueprint,
    graduate,
    applyAntagonistPenalty,
    addPapers,
    addSplinters,
    wipeSave,
    markVictorySeen,
  };
}
