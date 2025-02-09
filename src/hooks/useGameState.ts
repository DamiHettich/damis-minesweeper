import { useState, useCallback } from 'react';
import { CellType } from '../utils/boardUtils';
import { Difficulty } from '../utils/gameConfig';

export const useGameState = () => {
  const [board, setBoard] = useState<CellType[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const resetGame = useCallback((difficulty: Difficulty) => {
    // Lógica de reset
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    // Lógica de click
  }, [board, gameOver, win]);

  return {
    board,
    gameOver,
    win,
    resetGame,
    handleCellClick,
  };
}; 