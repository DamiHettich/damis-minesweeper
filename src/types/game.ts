export interface GameState {
  board: CellType[][];
  gameOver: boolean;
  win: boolean;
  score: number;
  time: number;
}

export interface GameActions {
  onCellClick: (row: number, col: number) => void;
  onReset: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export interface ScoreEntry {
  name: string;
  score: number;
  difficulty: Difficulty;
  date: string;
} 