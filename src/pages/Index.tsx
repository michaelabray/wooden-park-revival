import { useState, useEffect, useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { getSplinterMultiplier } from '@/lib/gameUtils';
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
import { X } from 'lucide-react';

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
    addPapers,
    addSplinters,
    wipeSave,
    markVictorySeen,
  } = useGameState();

  const [showSplash, setShowSplash] = useState(true);
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [showTrophyMenu, setShowTrophyMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [antagonist, setAntagonist] = useState<'soggy' | 'sentinel' | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [lastAntagonistTime, setLastAntagonistTime] = useState(Date.now());

  // Check for victory condition
  useEffect(() => {
    if (state.unlockedBlueprints.includes('statue') && !state.hasSeenVictory && !showVictory) {
      setShowVictory(true);
    }
  }, [state.unlockedBlueprints, state.hasSeenVictory, showVictory]);

  // Random antagonist spawns (60-90 seconds)
  useEffect(() => {
    if (showSplash) return;
    
    const checkAntagonist = () => {
      if (antagonist || state.antagonistPaused) return;
      
      const now = Date.now();
      const timeSinceLastAntagonist = now - lastAntagonistTime;
      const minDelay = state.unlockedBlueprints.includes('swing') ? 90000 : 60000;
      const maxDelay = state.unlockedBlueprints.includes('swing') ? 180000 : 90000;
      
      if (timeSinceLastAntagonist >= minDelay && Math.random() < 0.1) {
        setAntagonist(Math.random() > 0.5 ? 'soggy' : 'sentinel');
        setLastAntagonistTime(now);
      }
    };

    const interval = setInterval(checkAntagonist, 5000);
    return () => clearInterval(interval);
  }, [antagonist, state.antagonistPaused, state.unlockedBlueprints, showSplash, lastAntagonistTime]);

  const handleAntagonistSuccess = useCallback(() => {
    incrementAntagonistsDefeated();
    setAntagonist(null);
  }, [incrementAntagonistsDefeated]);

  const handleAntagonistFailure = useCallback(() => {
    if (antagonist) {
      applyAntagonistPenalty(antagonist);
    }
    setAntagonist(null);
  }, [antagonist, applyAntagonistPenalty]);

  const passiveIncome = getPassiveIncome();
  const clickPower = getClickPower();
  const splinterMultiplier = getSplinterMultiplier(state.goldenSplinters);

  // Stable callback to prevent the splash screen from resetting every second
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);
  
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Parallax Background */}
      <ParallaxBackground unlockedBlueprints={state.unlockedBlueprints} />

      {/* Main layout container - 100vh, no scrolling */}
      <div className="relative z-10 h-full w-full flex flex-col">
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

        {/* Main Body: 3-column grid (desktop) or stacked (mobile) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[25%_50%_25%] gap-2 px-2 md:px-4 py-2 min-h-0">
          {/* Left Column: Cart button to toggle shop */}
          <div className="flex items-start justify-center md:items-center md:justify-center order-3 md:order-1">
            <button
              onClick={() => setShowShop(true)}
              className="transition-transform hover:scale-110 active:scale-95"
              title="Shop"
            >
              <img 
                src="/wooden-park-revival/assets/ui/cart.webp" 
                alt="Shop"
                className="w-[15vw] md:w-[40%] max-w-[80px] min-w-[40px] object-contain drop-shadow-lg"
              />
            </button>
          </div>

          {/* Middle Column: Main clicker area */}
          <div className="flex flex-col items-center justify-center order-1 md:order-2 min-h-0">
            <PaperClicker
              currentPapers={state.currentPapers}
              passiveIncome={passiveIncome}
              clickPower={clickPower}
              onClick={handleClick}
            />
          </div>

          {/* Right Column: Blueprints grid */}
          <div className="hidden md:flex items-center justify-center order-2 md:order-3 p-2">
            <div className="w-full max-w-[150px]">
              <BlueprintDisplay unlockedBlueprints={state.unlockedBlueprints} />
            </div>
          </div>
        </div>

        {/* Bottom: Fruit Snack Boost - horizontal bar */}
        <div className="px-2 md:px-4 py-2 flex justify-center">
          <FruitSnackBoost
            currentPapers={state.currentPapers}
            isActive={state.fruitSnackActive}
            endTime={state.fruitSnackEndTime}
            onActivate={activateFruitSnack}
            autoBoostPurchased={state.autoBoostPurchased}
            autoBoostEnabled={state.autoBoostEnabled}
            onPurchaseAutoBoost={purchaseAutoBoost}
            onToggleAutoBoost={toggleAutoBoost}
          />
        </div>
      </div>

      {/* Shop Modal */}
      {showShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60" onClick={() => setShowShop(false)}>
          <div 
            className="relative w-[85vw] max-w-2xl max-h-[80vh] overflow-hidden animate-bounce-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Panel background image */}
            <img 
              src="/wooden-park-revival/assets/ui/panel-bg.webp"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Content with padding inside the parchment */}
            <div className="relative p-[10%] max-h-[80vh] overflow-y-auto">
              <button
                onClick={() => setShowShop(false)}
                className="absolute top-[6%] right-[6%] p-2 rounded-full bg-secondary/60 hover:bg-secondary/80 transition-colors z-10"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>

              <h2 className="font-display text-2xl text-gold mb-4 text-center">Academy Shop</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UnitShop currentPapers={state.currentPapers} units={state.units} onBuy={buyUnit} />
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
                    onBuy={buyBlueprint}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <NewsTicker />

      {offlineEarnings !== null && offlineEarnings > 0 && (
        <WelcomeBackModal earnings={offlineEarnings} onDismiss={dismissOfflineEarnings} />
      )}

      {antagonist && (
        <AntagonistOverlay type={antagonist} onSuccess={handleAntagonistSuccess} onFailure={handleAntagonistFailure} />
      )}

      {showDevMenu && (
        <DevMenu onClose={() => setShowDevMenu(false)} onAddPapers={addPapers} onAddSplinters={addSplinters} onWipeSave={wipeSave} />
      )}

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60" onClick={() => setShowSettings(false)}>
          <div 
            className="relative w-[85vw] max-w-md max-h-[80vh] overflow-hidden animate-bounce-in"
            onClick={e => e.stopPropagation()}
          >
            <img 
              src="/wooden-park-revival/assets/ui/panel-bg.webp"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative p-[12%]">
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-[8%] right-[8%] p-2 rounded-full bg-secondary/60 hover:bg-secondary/80 transition-colors z-10"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
              <h2 className="font-display text-xl text-foreground mb-4">Settings</h2>
              <SettingsPanel />
            </div>
          </div>
        </div>
      )}

      <TrophyMenu
        isOpen={showTrophyMenu}
        onClose={() => setShowTrophyMenu(false)}
        totalSplintersEarned={state.totalSplintersEarned}
        totalPapersGenerated={state.totalPapersLifetime}
        unlockedBlueprints={state.unlockedBlueprints}
        antagonistsDefeated={state.antagonistsDefeated}
      />

      {showVictory && (
        <VictoryScreen onClose={() => { setShowVictory(false); markVictorySeen(); }} />
      )}
    </div>
  );
}
