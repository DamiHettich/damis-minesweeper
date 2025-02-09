export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export interface GameConfig {
  size: number;
  mines: number;
  timeBonus: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, GameConfig> = {
  beginner: {
    size: 10,
    mines: 10,
    timeBonus: 100
  },
  intermediate: {
    size: 16,
    mines: 40,
    timeBonus: 200
  },
  expert: {
    size: 16,
    mines: 99,
    timeBonus: 300
  }
};

export const calculateScore = (timeElapsed: number, difficulty: Difficulty, cellsRevealed: number): number => {
  const { timeBonus } = DIFFICULTY_CONFIG[difficulty];
  const baseScore = cellsRevealed * 10;
  const timeScore = Math.max(0, timeBonus - timeElapsed);
  return baseScore + timeScore;
}; 