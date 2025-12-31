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
    buyBlueprint,
    graduate,
    applyAntagonistPenalty,
    addPapers,
    addSplinters,
    wipeSave,
    markVictorySeen, 
  } = useGameState();

  const [showDevMenu, setShowDevMenu] = useState(false);
  const [antagonist, setAntagonist] = useState<'soggy' | 'sentinel' | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [victoryDismissed, setVictoryDismissed] = useState(false);

  // Check for victory condition
  useEffect(() => {
    // We check state.hasSeenVictory which comes from your localStorage/DB
    if (state.unlockedBlueprints.includes('statue') && !state.hasSeenVictory && !showVictory) {
      setShowVictory(true);
    }
  }, [state.unlockedBlueprints, state.hasSeenVictory, showVictory]);

  // Random antagonist spawns
  useEffect(() => {
    const spawnAntagonist = () => {
      if (antagonist || state.antagonistPaused) return;
      
      // Reduce frequency if swing blueprint is unlocked
      const baseChance = state.unlockedBlueprints.includes('swing') ? 0.01 : 0.02;
      
      if (Math.random() < baseChance) {
        setAntagonist(Math.random() > 0.5 ? 'soggy' : 'sentinel');
      }
    };

    const interval = setInterval(spawnAntagonist, 5000);
    return () => clearInterval(interval);
  }, [antagonist, state.antagonistPaused, state.unlockedBlueprints]);

  const handleAntagonistSuccess = useCallback(() => {
    setAntagonist(null);
  }, []);

  const handleAntagonistFailure = useCallback(() => {
    if (antagonist) {
      applyAntagonistPenalty(antagonist);
    }
    setAntagonist(null);
  }, [antagonist, applyAntagonistPenalty]);

  const passiveIncome = getPassiveIncome();
  const clickPower = getClickPower();
  const splinterMultiplier = getSplinterMultiplier(state.goldenSplinters);

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container max-w-6xl mx-auto px-4">
        <GameHeader
          goldenSplinters={state.goldenSplinters}
          splinterMultiplier={splinterMultiplier}
          onDevMenuTrigger={() => setShowDevMenu(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
          {/* Left Column - Clicker & Boosts */}
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
            />
          </div>

          {/* Center Column - Unit Shop */}
          <div className="lg:col-span-4">
            <UnitShop
              currentPapers={state.currentPapers}
              units={state.units}
              onBuy={buyUnit}
            />
          </div>

          {/* Right Column - Prestige & Blueprints */}
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

      {/* News Ticker */}
      <NewsTicker />

      {/* Overlays */}
      {offlineEarnings !== null && offlineEarnings > 0 && (
        <WelcomeBackModal
          earnings={offlineEarnings}
          onDismiss={dismissOfflineEarnings}
        />
      )}

      {antagonist && (
        <AntagonistOverlay
          type={antagonist}
          onSuccess={handleAntagonistSuccess}
          onFailure={handleAntagonistFailure}
        />
      )}

      {showDevMenu && (
        <DevMenu
          onClose={() => setShowDevMenu(false)}
          onAddPapers={addPapers}
          onAddSplinters={addSplinters}
          onWipeSave={wipeSave}
        />
      )}

      {showVictory && (
        <VictoryScreen 
          onClose={() => {
            setShowVictory(false);
            markVictorySeen(); // <--- This saves the "seen" status permanently
          }} 
        />
      )}
    </div>
  );
}
