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
import { ParallaxBackground } from '@/components/game/ParallaxBackground';
import { TrophyMenu } from '@/components/game/TrophyMenu';
import { SettingsPanel } from '@/components/game/SettingsPanel';

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

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen pb-12 relative overflow-hidden">
      {/* Parallax Background */}
      <ParallaxBackground unlockedBlueprints={state.unlockedBlueprints} />

      <div className="relative z-10 container max-w-6xl mx-auto px-4">
        <GameHeader
          goldenSplinters={state.goldenSplinters}
          splinterMultiplier={splinterMultiplier}
          onDevMenuTrigger={() => setShowDevMenu(true)}
          onSettingsClick={() => setShowSettings(true)}
          onTrophyClick={() => setShowTrophyMenu(true)}
          onShopClick={() => {}}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
          <div className="lg:col-span-4 space-y-4">
            <PaperClicker
              currentPapers={state.currentPapers}
              passiveIncome={passiveIncome}
              clickPower={clickPower}
              onClick={handleClick}
            />
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

          <div className="lg:col-span-4">
            <UnitShop currentPapers={state.currentPapers} units={state.units} onBuy={buyUnit} />
          </div>

          <div className="lg:col-span-4 space-y-4">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowSettings(false)}>
          <div className="bento-card p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-display text-2xl text-foreground mb-4">Settings</h2>
            <SettingsPanel />
            <button onClick={() => setShowSettings(false)} className="mt-4 w-full btn-accent py-2 rounded-lg">Close</button>
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
