// Format large numbers for display with 2 decimal precision
export function formatPapers(num: number): string {
  if (num < 1000) return Math.floor(num).toString();
  if (num < 1000000) return (Math.floor(num / 10) / 100).toFixed(2) + 'k';
  if (num < 1000000000) return (Math.floor(num / 10000) / 100).toFixed(2) + 'M';
  if (num < 1000000000000) return (Math.floor(num / 10000000) / 100).toFixed(2) + 'B';
  return (Math.floor(num / 10000000000) / 100).toFixed(2) + 'T';
}

// Calculate exponential cost for units
export function calculateCost(baseCost: number, owned: number): number {
  return Math.floor(baseCost * Math.pow(1.15, owned));
}

// Calculate Golden Splinters earned from prestige
export function calculateSplinters(totalPapersLifetime: number): number {
  return Math.floor(10 * Math.sqrt(totalPapersLifetime / 2500));
}

// Calculate splinter multiplier (5% per splinter)
export function getSplinterMultiplier(splinters: number): number {
  return 1 + (splinters * 0.05);
}

// Unit definitions with 15% buff to Daydreamer and Overachiever
export interface UnitType {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseYield: number;
  icon: string;
  image: string;
}

export const UNITS: UnitType[] = [
  {
    id: 'daydreamer',
    name: 'Daydreamer',
    description: 'Gazes out the window, occasionally scribbles notes',
    baseCost: 15,
    baseYield: 0.0575, // 0.05 * 1.15 = 0.0575 (15% buff)
    icon: 'Cloud',
    image: './assets/units/daydreamer.webp',
  },
  {
    id: 'overachiever',
    name: 'Overachiever',
    description: 'Hand always raised, extra credit obsessed',
    baseCost: 100,
    baseYield: 0.345, // 0.30 * 1.15 = 0.345 (15% buff)
    icon: 'Star',
    image: './assets/units/overachiever.webp',
  },
  {
    id: 'varsity-bobkat',
    name: 'Varsity Bobkat',
    description: 'Sports star with surprising paper skills',
    baseCost: 500,
    baseYield: 1.80,
    icon: 'Trophy',
    image: './assets/units/varsity-bobkat.webp',
  },
  {
    id: 'ai-whiz',
    name: 'AI-Whiz',
    description: 'Codes during lunch, automates everything',
    baseCost: 2500,
    baseYield: 10.00,
    icon: 'Cpu',
    image: './assets/units/ai-whiz.webp',
  },
  {
    id: 'rogue-graduate',
    name: 'Rogue Graduate',
    description: 'Returned from college to lead the resistance',
    baseCost: 10000,
    baseYield: 60.00,
    icon: 'GraduationCap',
    image: './assets/units/rogue-graduate.webp',
  },
];

// Blueprint pieces for the Trophy Shop
export interface BlueprintPiece {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string;
  icon: string;
  image: string;
}

export const BLUEPRINTS: BlueprintPiece[] = [
  {
    id: 'steps',
    name: 'The Steps',
    description: 'Foundation of the Wooden Park',
    cost: 100,
    effect: '+20% Click Power',
    icon: 'Footprints',
    image: './assets/blueprints/steps.webp',
  },
  {
    id: 'slide',
    name: 'The Cedar Slide',
    description: 'Legendary for its speed and soul',
    cost: 250,
    effect: '1.5x Passive Yield',
    icon: 'TrendingDown',
    image: './assets/blueprints/slide.webp',
  },
  {
    id: 'swing',
    name: 'The Swings',
    description: 'Where dreams took flight',
    cost: 500,
    effect: '-50% Antagonist Frequency',
    icon: 'Wind',
    image: './assets/blueprints/swings.webp',
  },
  {
    id: 'walls',
    name: 'The Walls',
    description: 'Protected secrets were shared here',
    cost: 1000,
    effect: '3x Paper Value',
    icon: 'Boxes',
    image: './assets/blueprints/wall.webp',
  },
  {
    id: 'statue',
    name: 'The Founder Statue',
    description: 'Symbol of the Wooden Park legacy',
    cost: 2500,
    effect: 'Victory Achieved!',
    icon: 'Crown',
    image: './assets/blueprints/founder.webp',
  },
];

// News ticker messages
export const NEWS_MESSAGES = [
  "RUMOR: The old Cedar Slide didn't just have speed; it had soul.",
  "Principal announces 'No Running' on the new playground. Students respond by walking very fast.",
  "Chef Soggy spotted buying 'Mystery Cans' with no labels again.",
  "LOCAL NEWS: Gaga Ball declared a 'High-Intensity Sport' by the 7th grade council.",
  "A mechanical pencil was found with 4B lead. The owner is being hailed as a hero.",
  "The Modern Playground has been seen 'watching' the students during recess...",
  "Warning: The Mystery Meatloaf has achieved sentience. Do not make eye contact.",
  "The Wooden Park pieces are scattered... find them all.",
];

// Antagonist dialogue - short and punchy
export const ANTAGONIST_DIALOGUE = {
  soggy: {
    title: 'CHEF SOGGY!',
    line: "Mystery meatloaf incoming! Study or starve!",
  },
  sentinel: {
    title: 'SAFETY SENTINEL!',
    line: "Papers detected! Hide the evidence!",
  },
};
