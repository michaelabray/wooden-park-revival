import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useAudioManager } from '@/hooks/useAudioManager';
import { getSplinterMultiplier } from '@/lib/gameUtils';
import { getCurrentGoal, getNextGoal, getGoalProgress, GoalCheckState } from '@/lib/goalSystem';
import { GameHeader } from '@/components/game/GameHeader';
import { PaperClicker } from '@/components/game/PaperClicker';
import { UnitShop } from '@/components/game/UnitShop';
import { FruitSnackBoost } from '@/components/game/FruitSnackBoost';
import { BlueprintShop } from '@/components/game/BlueprintShop';
import { GraduationPanel } from '@/components/game/GraduationPanel';
import { NewsTicker } from '@/components/game/NewsTicker';
import { AntagonistOverlay } from '@/components/game/AntagonistOverlay';
import { DevMenu } from '@/components/game/DevMenu';
import { WelcomeBackModal } from '@/components/game/WelcomeBackModal';
import { VictoryScreen } from '@/components/game/VictoryScreen';
import { SplashScreen } from '@/components/game/SplashScreen';
import { ParallaxBackground, BlueprintDisplay } from '@/components/game/ParallaxBackground';
import { TrophyMenu } from '@/components/game/TrophyMenu';
import { SettingsPanel } from '@/components/game/SettingsPanel';
import { GoalBanner } from '@/components/game/GoalBanner';
import { VictoryPathBox } from '@/components/game/VictoryPathBox';
import { TutorialHand } from '@/components/game/TutorialHand';
import { FounderIntroModal } from '@/components/game/FounderIntroModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Index() {
  const {
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
    graduate,
    applyAntagonistPenalty,
    incrementAntagonistsDefeated,
    triggerCriticalStudy,
    purchasePrestige,
    addPapers,
    addSplinters,
    wipeSave,
    markVictorySeen,
    markIntroSeen,
    updateHighestGoal,
  } = useGameState();

  const audio = useAudioManager();

  const [showSplash, setShowSplash] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [showTrophyMenu, setShowTrophyMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [antagonist, setAntagonist] = useState<'soggy' | 'sentinel' | null>(null);
  const [antagonistStartTime, setAntagonistStartTime] = useState<number>(0);
  const [showVictory, setShowVictory] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [lastAntagonistTime, setLastAntagonistTime] = useState(Date.now() - 60000);

  // Goal system state
  const goalCheckState: GoalCheckState = useMemo(() => ({
    totalPapersLifetime: state.totalPapersLifetime,
    currentPapers: state.currentPapers,
    units: state.units,
    goldenSplinters: state.goldenSplinters,
    totalSplintersEarned: state.totalSplintersEarned,
    unlockedBlueprints: state.unlockedBlueprints,
    hasGraduated: state.totalSplintersEarned > 0,
    highestGoalReached: state.highestGoalReached,
    hasUsedFruitSnack: state.hasUsedFruitSnack,
  }), [state]);

  const currentGoal = useMemo(() => getCurrentGoal(goalCheckState), [goalCheckState]);
  const nextGoal = useMemo(() => getNextGoal(goalCheckState), [goalCheckState]);
  const goalProgress = useMemo(() => getGoalProgress(goalCheckState), [goalCheckState]);

  // Update highest goal reached when a goal is completed (never decreases)
  useEffect(() => {
    if (currentGoal) {
      // Current goal is the first incomplete goal, so completed = currentGoal.id - 1
      const completedGoals = currentGoal.id - 1;
      if (completedGoals > 0) {
        updateHighestGoal(completedGoals);
      }
    } else {
      // All goals complete (currentGoal is null)
      updateHighestGoal(9);
    }
  }, [currentGoal, updateHighestGoal]);

  // Check for victory condition
  useEffect(() => {
    if (state.unlockedBlueprints.includes('statue') && !state.hasSeenVictory && !showVictory) {
      setShowVictory(true);
      audio.playSFX('victory');
    }
  }, [state.unlockedBlueprints, state.hasSeenVictory, showVictory, audio]);

  useEffect(() => {
    if (showSplash) return;
    
    const checkAntagonist = () => {
      if (antagonist || state.antagonistPaused) return;
      
      const now = Date.now();
      const timeSinceLastAntagonist = now - lastAntagonistTime;
      
      // Base delays
      let minDelay = state.unlockedBlueprints.includes('swing') ? 90000 : 60000;
      let maxDelay = state.unlockedBlueprints.includes('swing') ? 180000 : 90000;
      
      // Apply Tier 2 prestige bonus (30% less often = 30% longer delays)
      if (state.prestigeTier >= 2) {
        minDelay = Math.floor(minDelay * 1.3);
        maxDelay = Math.floor(maxDelay * 1.3);
      }
      
      if (timeSinceLastAntagonist >= minDelay && Math.random() < 0.2) {
        setAntagonist(Math.random() > 0.5 ? 'soggy' : 'sentinel');
        setAntagonistStartTime(Date.now());
        setLastAntagonistTime(now);
        audio.playSFX('antagonist');
      }
    };

    const interval = setInterval(checkAntagonist, 5000);
    return () => clearInterval(interval);
  }, [antagonist, state.antagonistPaused, state.unlockedBlueprints, showSplash, lastAntagonistTime, state.prestigeTier, audio]);

  const handleAntagonistSuccess = useCallback((completionTime: number) => {
    incrementAntagonistsDefeated();
    
    // Check for Critical Study (completed within 1.5 seconds)
    if (completionTime <= 1500) {
      triggerCriticalStudy();
    }
    
    setAntagonist(null);
  }, [incrementAntagonistsDefeated, triggerCriticalStudy]);

  const handleAntagonistFailure = useCallback(() => {
    if (antagonist) {
      applyAntagonistPenalty(antagonist);
    }
    setAntagonist(null);
  }, [antagonist, applyAntagonistPenalty]);

  const passiveIncome = getPassiveIncome();
  const clickPower = getClickPower();
  const splinterMultiplier = getSplinterMultiplier(state.goldenSplinters);

  // Wrap handleClick to play SFX
  const handleClickWithAudio = useCallback(() => {
    audio.initialize(); // Initialize on first user interaction
    audio.playSFX('click');
    return handleClick();
  }, [handleClick, audio]);

  // Wrap buy functions to play SFX
  const handleBuyUnit = useCallback((unitId: string) => {
    const success = buyUnit(unitId);
    if (success) audio.playSFX('buy');
    return success;
  }, [buyUnit, audio]);

  const handleBuyBlueprint = useCallback((blueprintId: string, cost: number) => {
    const success = buyBlueprint(blueprintId, cost);
    if (success) {
      audio.playSFX('buy');
      // Auto-close shop when statue is purchased
      if (blueprintId === 'statue') {
        setShowShop(false);
      }
    }
    return success;
  }, [buyBlueprint, audio]);

  // Stable callback to prevent the splash screen from resetting every second
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    // Show intro modal if player hasn't seen it
    if (!state.hasSeenIntro) {
      setShowIntro(true);
    }
  }, [state.hasSeenIntro]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    markIntroSeen();
    audio.initialize();
  }, [markIntroSeen, audio]);
  
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Parallax Background */}
      <ParallaxBackground unlockedBlueprints={state.unlockedBlueprints} />

      {/* Main layout container - 100vh, no scrolling, pb-20 for ticker */}
      <div className="relative z-10 h-full w-full flex flex-col pb-20">
        {/* Top Row: HUD */}
        <div className="px-2 md:px-4">
          <GameHeader
            goldenSplinters={state.goldenSplinters}
            splinterMultiplier={splinterMultiplier}
            onDevMenuTrigger={() => setShowDevMenu(true)}
            onSettingsClick={() => setShowSettings(true)}
            onTrophyClick={() => setShowTrophyMenu(true)}
          />
        </div>

        {/* Goal Banner - High contrast dark charcoal with gold */}
        <GoalBanner currentGoal={currentGoal} nextGoal={nextGoal} progress={goalProgress} />

        {/* Main Body: 3-column grid (desktop) or stacked (mobile) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[25%_50%_25%] gap-2 px-2 md:px-4 py-2 min-h-0">
          {/* Left Column: Cart button to toggle shop */}
          <div className="flex items-start justify-center md:items-center md:justify-center order-3 md:order-1">
            <div className="relative">
              <button
                onClick={() => setShowShop(true)}
                className="transition-transform hover:scale-110 active:scale-95"
                title="Shop"
              >
                <img 
                  src="/wooden-park-revival/assets/ui/cart.webp" 
                  alt="Shop"
                  className="w-[60%] md:w-[70%] max-w-[180px] min-w-[80px] object-contain drop-shadow-lg"
                />
              </button>
              {/* Tutorial Hand for Goal 2 */}
              <TutorialHand
                currentGoal={currentGoal}
                totalPapersLifetime={state.totalPapersLifetime}
                currentPapers={state.currentPapers}
                isShopOpen={showShop}
                targetRef="cart"
              />
            </div>
          </div>

          {/* Middle Column: Main clicker area */}
          <div className="flex flex-col items-center justify-center order-1 md:order-2 min-h-0">
            <PaperClicker
              currentPapers={state.currentPapers}
              passiveIncome={passiveIncome}
              clickPower={clickPower}
              onClick={handleClickWithAudio}
              criticalStudyActive={state.criticalStudyActive}
              showTutorial={currentGoal?.id === 1 && state.totalPapersLifetime < 15}
              onTutorialDismiss={() => {}}
            />
          </div>

          {/* Right Column: Blueprints grid + Victory Path */}
          <div className="hidden md:flex flex-col items-center justify-center order-2 md:order-3 p-2 gap-3">
            <div className="w-full max-w-[180px]">
              <BlueprintDisplay unlockedBlueprints={state.unlockedBlueprints} />
            </div>
            <div className="w-full max-w-[180px]">
              <VictoryPathBox unlockedCount={state.unlockedBlueprints.length} />
            </div>
          </div>
        </div>

        {/* Bottom: Fruit Snack Boost - horizontal bar */}
        <div className="px-2 md:px-4 py-2 flex justify-center relative">
          <FruitSnackBoost
            currentPapers={state.currentPapers}
            isActive={state.fruitSnackActive}
            endTime={state.fruitSnackEndTime}
            onActivate={activateFruitSnack}
            autoBoostPurchased={state.autoBoostPurchased}
            autoBoostEnabled={state.autoBoostEnabled}
            onPurchaseAutoBoost={purchaseAutoBoost}
            onToggleAutoBoost={toggleAutoBoost}
            criticalStudyActive={state.criticalStudyActive}
            criticalStudyEndTime={state.criticalStudyEndTime}
          />
          {/* Tutorial Hand for Goal 3 - points at Fruit Snack until first use */}
          {currentGoal?.id === 3 && state.currentPapers >= 50 && !state.hasUsedFruitSnack && (
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
          )}
        </div>
      </div>

      {/* Shop Modal - Shadcn Dialog with dark backdrop */}
      <Dialog open={showShop} onOpenChange={setShowShop}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-gold flex items-center gap-2">
              <img 
                src="/wooden-park-revival/assets/ui/cart.webp" 
                alt=""
                className="w-8 h-8 object-contain"
              />
              Academy Shop
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <UnitShop 
              currentPapers={state.currentPapers} 
              units={state.units} 
              onBuy={handleBuyUnit}
              showDaydreamerTutorial={currentGoal?.id === 2 && showShop}
            />
            <div className="space-y-4">
              <GraduationPanel
                currentPapers={state.currentPapers}
                totalPapersLifetime={state.totalPapersLifetime}
                currentSplinters={state.goldenSplinters}
                onGraduate={graduate}
              />
              <BlueprintShop
                goldenSplinters={state.goldenSplinters}
                unlockedBlueprints={state.unlockedBlueprints}
                onBuy={handleBuyBlueprint}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal - Shadcn Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground flex items-center gap-2">
              <img 
                src="/wooden-park-revival/assets/ui/cog.webp" 
                alt=""
                className="w-6 h-6 object-contain"
              />
              Settings
            </DialogTitle>
          </DialogHeader>
          <SettingsPanel 
            musicEnabled={audio.musicEnabled}
            sfxEnabled={audio.sfxEnabled}
            musicVolume={audio.musicVolume}
            sfxVolume={audio.sfxVolume}
            onToggleMusic={audio.toggleMusic}
            onToggleSfx={audio.toggleSfx}
            onMusicVolumeChange={audio.setMusicVolume}
            onSfxVolumeChange={audio.setSfxVolume}
          />
        </DialogContent>
      </Dialog>

      <NewsTicker />

      {offlineEarnings !== null && offlineEarnings > 0 && (
        <WelcomeBackModal earnings={offlineEarnings} onDismiss={dismissOfflineEarnings} />
      )}

      {antagonist && (
        <div className="fixed inset-0 z-[100]">
          <AntagonistOverlay
            type={antagonist} 
            onSuccess={handleAntagonistSuccess} 
            onFailure={handleAntagonistFailure}
            startTime={antagonistStartTime}
          />
        </div>
      )}

      {showDevMenu && (
        <DevMenu onClose={() => setShowDevMenu(false)} onAddPapers={addPapers} onAddSplinters={addSplinters} onWipeSave={wipeSave} />
      )}

      <TrophyMenu
        isOpen={showTrophyMenu}
        onClose={() => setShowTrophyMenu(false)}
        totalSplintersEarned={state.totalSplintersEarned}
        totalPapersGenerated={state.totalPapersLifetime}
        unlockedBlueprints={state.unlockedBlueprints}
        antagonistsDefeated={state.antagonistsDefeated}
        goldenSplinters={state.goldenSplinters}
        prestigeTier={state.prestigeTier}
        onPurchasePrestige={(tier, cost) => {
          const success = purchasePrestige(tier, cost);
          if (success) audio.playSFX('buy');
        }}
      />

      {showVictory && (
        <VictoryScreen onClose={() => { setShowVictory(false); markVictorySeen(); }} />
      )}

      {/* Founder Intro Modal - First time play */}
      {showIntro && (
        <FounderIntroModal onComplete={handleIntroComplete} />
      )}
    </div>
  );
}
