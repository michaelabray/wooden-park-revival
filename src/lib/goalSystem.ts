// Goal progression system for Bee-Kay Academy

export interface Goal {
  id: number;
  title: string;
  description: string;
  nextHint: string;
  isComplete: (state: GoalCheckState) => boolean;
}

export interface GoalCheckState {
  totalPapersLifetime: number;
  currentPapers: number;
  units: Record<string, number>;
  goldenSplinters: number;
  totalSplintersEarned: number;
  unlockedBlueprints: string[];
  hasGraduated: boolean;
}

export const GOALS: Goal[] = [
  {
    id: 1,
    title: "Start Writing",
    description: "Reach 15 Papers",
    nextHint: "Recruit help",
    isComplete: (state) => state.totalPapersLifetime >= 15,
  },
  {
    id: 2,
    title: "Recruitment",
    description: "Open Shop and buy 1 Daydreamer",
    nextHint: "Stock up",
    isComplete: (state) => (state.units['daydreamer'] || 0) >= 1,
  },
  {
    id: 3,
    title: "Boost Power",
    description: "Reach 50 Papers",
    nextHint: "Earn Degree",
    isComplete: (state) => state.currentPapers >= 50,
  },
  {
    id: 4,
    title: "Graduate",
    description: "Use the Graduation Panel to earn Splinters",
    nextHint: "Fix the Steps",
    isComplete: (state) => state.totalSplintersEarned > 0,
  },
  {
    id: 5,
    title: "Architect Phase 1",
    description: "Buy 'The Steps' blueprint",
    nextHint: "Fix the Slide",
    isComplete: (state) => state.unlockedBlueprints.includes('steps'),
  },
  {
    id: 6,
    title: "Architect Phase 2",
    description: "Buy 'The Slide' blueprint",
    nextHint: "Fix the Swings",
    isComplete: (state) => state.unlockedBlueprints.includes('slide'),
  },
  {
    id: 7,
    title: "Architect Phase 3",
    description: "Buy 'The Swings' blueprint",
    nextHint: "Fix the Walls",
    isComplete: (state) => state.unlockedBlueprints.includes('swing'),
  },
  {
    id: 8,
    title: "Architect Phase 4",
    description: "Buy 'The Walls' blueprint",
    nextHint: "The Founder",
    isComplete: (state) => state.unlockedBlueprints.includes('walls'),
  },
  {
    id: 9,
    title: "Final Victory",
    description: "Buy 'The Founder Statue' to win",
    nextHint: "Victory!",
    isComplete: (state) => state.unlockedBlueprints.includes('statue'),
  },
];

export function getCurrentGoal(state: GoalCheckState): Goal | null {
  for (const goal of GOALS) {
    if (!goal.isComplete(state)) {
      return goal;
    }
  }
  return null; // All goals complete
}

export function getNextGoal(state: GoalCheckState): Goal | null {
  const current = getCurrentGoal(state);
  if (!current) return null;
  
  const nextIndex = GOALS.findIndex(g => g.id === current.id) + 1;
  if (nextIndex < GOALS.length) {
    return GOALS[nextIndex];
  }
  return null;
}

export function getGoalProgress(state: GoalCheckState): { current: number; total: number } {
  let completed = 0;
  for (const goal of GOALS) {
    if (goal.isComplete(state)) {
      completed++;
    } else {
      break;
    }
  }
  return { current: completed, total: GOALS.length };
}
