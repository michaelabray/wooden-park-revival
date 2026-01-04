import { useState, useEffect, useCallback, useRef } from 'react';
import { UNITS, calculateCost, calculateSplinters, getSplinterMultiplier } from '@/lib/gameUtils';

export interface GameState {
  currentPapers: number;
  totalPapersLifetime: number;
  goldenSplinters: number;
  totalSplintersEarned: number;
  unlockedBlueprints: string[];
  units: Record<string, number>;
  fruitSnackActive: boolean;
  fruitSnackEndTime: number;
  lastSaveTimestamp: number;
  antagonistPaused: boolean;
  antagonistPausedUntil: number;
  hasSeenVictory: boolean;
  antagonistsDefeated: number;
  autoBoostEnabled: boolean;
  autoBoostPurchased: boolean;
  prestigeTier: number;
  criticalStudyActive: boolean;
  criticalStudyEndTime: number;
  // Persistence for goals/tutorial
  highestGoalReached: number;
  hasSeenIntro: boolean;
}

const INITIAL_STATE: GameState = {
  currentPapers: 0,
  totalPapersLifetime: 0,
  goldenSplinters: 0,
  totalSplintersEarned: 0,
  unlockedBlueprints: [],
  units: {},
  fruitSnackActive: false,
  fruitSnackEndTime: 0,
  lastSaveTimestamp: Date.now(),
  antagonistPaused: false,
  antagonistPausedUntil: 0,
  hasSeenVictory: false,
  antagonistsDefeated: 0,
  autoBoostEnabled: false,
  autoBoostPurchased: false,
  prestigeTier: 0,
  criticalStudyActive: false,
  criticalStudyEndTime: 0,
  highestGoalReached: 0,
  hasSeenIntro: false,
};

const STORAGE_KEY = 'bk-academy-save';
const FRUIT_SNACK_COST = 50;
const AUTO_BOOST_COST = 5000;

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate old saves
        return {
          ...INITIAL_STATE,
          ...parsed,
          totalSplintersEarned: parsed.totalSplintersEarned || parsed.goldenSplinters || 0,
          antagonistsDefeated: parsed.antagonistsDefeated || 0,
          autoBoostEnabled: parsed.autoBoostEnabled || false,
          autoBoostPurchased: parsed.autoBoostPurchased || false,
          prestigeTier: parsed.prestigeTier || 0,
          criticalStudyActive: false,
          criticalStudyEndTime: 0,
          highestGoalReached: parsed.highestGoalReached || 0,
          hasSeenIntro: parsed.hasSeenIntro || false,
        };
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

  // Mark intro as seen
  const markIntroSeen = useCallback(() => {
    setState(prev => ({ ...prev, hasSeenIntro: true }));
  }, []);

  // Update highest goal reached (never decreases)
  const updateHighestGoal = useCallback((goalId: number) => {
    setState(prev => ({
      ...prev,
      highestGoalReached: Math.max(prev.highestGoalReached, goalId),
    }));
  }, []);

  // Increment antagonists defeated
  const incrementAntagonistsDefeated = useCallback(() => {
    setState(prev => ({
      ...prev,
      antagonistsDefeated: prev.antagonistsDefeated + 1,
    }));
  }, []);

  // Trigger Critical Study (5x production for 10 seconds)
  const triggerCriticalStudy = useCallback(() => {
    setState(prev => ({
      ...prev,
      criticalStudyActive: true,
      criticalStudyEndTime: Date.now() + 10000,
    }));
  }, []);
  
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

    // Apply critical study multiplier (5x)
    const criticalMult = state.criticalStudyActive ? 5 : 1;

    // Apply blueprint bonuses
    const slideMult = state.unlockedBlueprints.includes('slide') ? 1.5 : 1;
    const wallsMult = state.unlockedBlueprints.includes('walls') ? 3 : 1;

    return baseIncome * splinterMult * fruitSnackMult * slideMult * wallsMult * criticalMult;
  }, [state.units, state.goldenSplinters, state.fruitSnackActive, state.unlockedBlueprints, state.criticalStudyActive]);

  // Calculate click power
  const getClickPower = useCallback(() => {
    const splinterMult = getSplinterMultiplier(state.goldenSplinters);
    const stepsMult = state.unlockedBlueprints.includes('steps') ? 1.2 : 1;
    const wallsMult = state.unlockedBlueprints.includes('walls') ? 3 : 1;
    
    // Apply Tier 1 prestige bonus (+100% click power)
    const prestigeMult = state.prestigeTier >= 1 ? 2 : 1;
    
    // Apply critical study multiplier (5x)
    const criticalMult = state.criticalStudyActive ? 5 : 1;
    
    return 1 * splinterMult * stepsMult * wallsMult * prestigeMult * criticalMult;
  }, [state.goldenSplinters, state.unlockedBlueprints, state.prestigeTier, state.criticalStudyActive]);

  // Handle offline progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedState = JSON.parse(saved) as GameState;
        const now = Date.now();
        const secondsElapsed = Math.floor((now - parsedState.lastSaveTimestamp) / 1000);
        
        if (secondsElapsed > 10) {
          // Calculate offline earnings
          // Base rate is 50%, but Tier 3 prestige increases to 75%
          const offlineRate = (parsedState.prestigeTier || 0) >= 3 ? 0.75 : 0.5;
          
          let baseIncome = 0;
          UNITS.forEach(unit => {
            const owned = parsedState.units[unit.id] || 0;
            baseIncome += owned * unit.baseYield;
          });
          
          const splinterMult = getSplinterMultiplier(parsedState.goldenSplinters);
          const slideMult = parsedState.unlockedBlueprints.includes('slide') ? 1.5 : 1;
          const wallsMult = parsedState.unlockedBlueprints.includes('walls') ? 3 : 1;
          
          const passiveRate = baseIncome * splinterMult * slideMult * wallsMult;
          const earnings = Math.floor(passiveRate * offlineRate * secondsElapsed);
          
          if (earnings > 0) {
            setOfflineEarnings(earnings);
            setState(prev => ({
              ...prev,
              currentPapers: prev.currentPapers + earnings,
              totalPapersLifetime: prev.totalPapersLifetime + earnings,
              lastSaveTimestamp: now,
              fruitSnackActive: false,
              criticalStudyActive: false,
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
        // Don't persist critical study across sessions
        criticalStudyActive: false,
        criticalStudyEndTime: 0,
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
        
        // Check critical study expiry
        const criticalStudyActive = prev.criticalStudyActive && now < prev.criticalStudyEndTime;
        
        // Auto-boost logic: if enabled and not active, and can afford
        let newPapers = prev.currentPapers;
        let newFruitSnackActive = fruitSnackActive;
        let newFruitSnackEndTime = prev.fruitSnackEndTime;

        if (prev.autoBoostEnabled && prev.autoBoostPurchased && !fruitSnackActive && newPapers >= FRUIT_SNACK_COST) {
          newPapers -= FRUIT_SNACK_COST;
          newFruitSnackActive = true;
          newFruitSnackEndTime = now + 30000;
        }

        // Calculate passive income
        let baseIncome = 0;
        UNITS.forEach(unit => {
          const owned = prev.units[unit.id] || 0;
          baseIncome += owned * unit.baseYield;
        });

        const splinterMult = getSplinterMultiplier(prev.goldenSplinters);
        const fruitSnackMult = newFruitSnackActive ? 2 : 1;
        const slideMult = prev.unlockedBlueprints.includes('slide') ? 1.5 : 1;
        const wallsMult = prev.unlockedBlueprints.includes('walls') ? 3 : 1;
        const criticalMult = criticalStudyActive ? 5 : 1;
        
        // Check antagonist pause expiry
        const antagonistPaused = prev.antagonistPaused && now < prev.antagonistPausedUntil;

        const income = baseIncome * splinterMult * fruitSnackMult * slideMult * wallsMult * criticalMult;

        return {
          ...prev,
          currentPapers: newPapers + income,
          totalPapersLifetime: prev.totalPapersLifetime + income,
          fruitSnackActive: newFruitSnackActive,
          fruitSnackEndTime: newFruitSnackEndTime,
          antagonistPaused,
          criticalStudyActive,
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
    if (state.currentPapers >= FRUIT_SNACK_COST) {
      setState(prev => ({
        ...prev,
        currentPapers: prev.currentPapers - FRUIT_SNACK_COST,
        fruitSnackActive: true,
        fruitSnackEndTime: Date.now() + 30000,
      }));
      return true;
    }
    return false;
  }, [state.currentPapers]);

  // Purchase auto-boost
  const purchaseAutoBoost = useCallback(() => {
    if (state.currentPapers >= AUTO_BOOST_COST && !state.autoBoostPurchased) {
      setState(prev => ({
        ...prev,
        currentPapers: prev.currentPapers - AUTO_BOOST_COST,
        autoBoostPurchased: true,
        autoBoostEnabled: true,
      }));
      return true;
    }
    return false;
  }, [state.currentPapers, state.autoBoostPurchased]);

  // Toggle auto-boost
  const toggleAutoBoost = useCallback(() => {
    if (state.autoBoostPurchased) {
      setState(prev => ({
        ...prev,
        autoBoostEnabled: !prev.autoBoostEnabled,
      }));
    }
  }, [state.autoBoostPurchased]);

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

  // Purchase prestige tier
  const purchasePrestige = useCallback((tier: number, cost: number) => {
    if (state.goldenSplinters >= cost && state.prestigeTier === tier - 1) {
      setState(prev => ({
        ...prev,
        goldenSplinters: prev.goldenSplinters - cost,
        prestigeTier: tier,
      }));
      return true;
    }
    return false;
  }, [state.goldenSplinters, state.prestigeTier]);

  // Graduate (prestige)
  const graduate = useCallback(() => {
    const newSplinters = calculateSplinters(state.totalPapersLifetime);
    if (newSplinters > state.goldenSplinters) {
      const splinterGain = newSplinters - state.goldenSplinters;
      setState(prev => ({
        ...INITIAL_STATE,
        goldenSplinters: newSplinters,
        totalSplintersEarned: prev.totalSplintersEarned + splinterGain,
        unlockedBlueprints: prev.unlockedBlueprints,
        antagonistsDefeated: prev.antagonistsDefeated,
        autoBoostPurchased: prev.autoBoostPurchased,
        autoBoostEnabled: prev.autoBoostEnabled,
        prestigeTier: prev.prestigeTier,
        lastSaveTimestamp: Date.now(),
      }));
      return splinterGain;
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
      totalSplintersEarned: prev.totalSplintersEarned + amount,
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
    purchaseAutoBoost,
    toggleAutoBoost,
    buyBlueprint,
    purchasePrestige,
    graduate,
    applyAntagonistPenalty,
    incrementAntagonistsDefeated,
    triggerCriticalStudy,
    addPapers,
    addSplinters,
    wipeSave,
    markVictorySeen,
    markIntroSeen,
    updateHighestGoal,
  };
}
