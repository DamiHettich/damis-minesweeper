import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board.tsx';
import { generateBoard, revealCell, checkWin, CellType } from '../utils/boardUtils.ts';
import { playSound } from '../utils/sounds.ts';
import { Difficulty, DIFFICULTY_CONFIG, calculateScore } from '../utils/gameConfig.ts';
import Leaderboard from './Leaderboard.tsx';
import { ScoreEntry } from '../types/game';

const Game: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [board, setBoard] = useState<CellType[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [time, setTime] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [flagsCount, setFlagsCount] = useState(0);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState<string>(() => 
    localStorage.getItem('minesweeper-player-name') || ''
  );
  const [scores, setScores] = useState<ScoreEntry[]>(() => {
    const saved = localStorage.getItem('minesweeper-scores');
    return saved ? JSON.parse(saved) : [];
  });

  const config = DIFFICULTY_CONFIG[difficulty];

  const initGame = useCallback(() => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const newBoard = generateBoard(config.size, config.mines);
    setBoard(newBoard);
    setGameOver(false);
    setWin(false);
    setTime(0);
    setIsFirstClick(true);
    setFlagsCount(0);
    setScore(0);
  }, [difficulty]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!gameOver && !win && !isFirstClick) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameOver, win, isFirstClick]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameOver || win) return;

    if (isFirstClick) {
      setIsFirstClick(false);
      playSound('click');
    }

    const cell = board[row][col];
    if (cell.isFlagged) return;

    if (cell.isMine) {
      playSound('explosion');
      setGameOver(true);
      const newBoard = board.map(row => 
        row.map(cell => 
          cell.isMine ? { ...cell, isRevealed: true } : cell
        )
      );
      setBoard(newBoard);
      return;
    }

    playSound('reveal');
    const newBoard = revealCell(board, row, col);
    setBoard(newBoard);

    // Calcular celdas reveladas para la puntuación
    const revealedCells = newBoard.flat().filter(cell => cell.isRevealed && !cell.isMine).length;
    const currentScore = calculateScore(time, difficulty, revealedCells);
    setScore(currentScore);

    if (checkWin(newBoard)) {
      playSound('win');
      setWin(true);
      const newScore: ScoreEntry = {
        name: playerName,
        score: currentScore,
        difficulty,
        date: new Date().toISOString()
      };
      const newScores = [...scores, newScore].sort((a, b) => b.score - a.score);
      setScores(newScores);
      localStorage.setItem('minesweeper-scores', JSON.stringify(newScores));
    }
  }, [board, gameOver, win, isFirstClick, difficulty, time, playerName, scores]);

  const handleCellRightClick = useCallback((row: number, col: number) => {
    if (gameOver || win || board[row][col].isRevealed) return;

    playSound('flag');
    const newBoard = board.map((r, i) =>
      r.map((cell, j) => {
        if (i === row && j === col) {
          const newCell = { ...cell, isFlagged: !cell.isFlagged };
          setFlagsCount(prev => prev + (newCell.isFlagged ? 1 : -1));
          return newCell;
        }
        return cell;
      })
    );
    setBoard(newBoard);
  }, [board, gameOver, win]);

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    localStorage.setItem('minesweeper-player-name', name);
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Fondo animado */}
      <div className="fixed inset-0">
        <div className="matrix-bg opacity-30"></div>
      </div>
      
      {/* Contenido del juego */}
      <div className="relative flex lg:flex-row items-start justify-center gap-6 p-4">
        <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-green-900/30">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-6 text-center">
            Minesweeper
          </h1>
          
          {/* Panel de control */}
          <div className="mb-4 flex flex-wrap gap-3 justify-between items-center bg-black/30 p-3 rounded-xl">
            <select 
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="px-3 py-1.5 rounded-lg bg-gray-800 text-green-400 border border-green-900 hover:border-green-500 focus:outline-none focus:border-green-400 transition-colors text-sm"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
            <div className="text-sm text-green-400 font-mono">High Score: {
              scores.filter(s => s.difficulty === difficulty).reduce((max, s) => Math.max(max, s.score), 0)
            }</div>
          </div>

          {/* Panel de estado */}
          <div className="mb-4 bg-black/30 p-3 rounded-xl flex justify-between items-center gap-3">
            <div className="text-lg bg-gray-800 px-4 py-2 rounded-lg text-yellow-400 font-mono border border-yellow-900/50">
              🚩 {config.mines - flagsCount}
            </div>
            <button 
              onClick={initGame}
              className="text-2xl bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg transition-all transform hover:scale-110 border border-green-900/50"
            >
              {gameOver ? '😵' : win ? '😎' : '🙂'}
            </button>
            <div className="text-lg bg-gray-800 px-4 py-2 rounded-lg text-blue-400 font-mono border border-blue-900/50">
              ⏱️ {time.toString().padStart(3, '0')}
            </div>
          </div>

          <div className="mb-4 text-sm text-center text-green-400 font-mono">
            Score: {score}
          </div>

          {/* Tablero */}
          <div className="bg-black/40 p-4 rounded-xl">
            <Board 
              board={board} 
              onCellClick={handleCellClick}
              onCellRightClick={handleCellRightClick}
            />
          </div>
        </div>

        {/* Leaderboard */}
        <Leaderboard
          scores={scores}
          currentDifficulty={difficulty}
          onNameSubmit={handleNameSubmit}
          playerName={playerName}
        />
      </div>

      {/* Mensaje de Game Over/Victoria */}
      {(gameOver || win) && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`text-2xl font-bold ${gameOver ? 'text-red-500' : 'text-green-500'} animate-bounce backdrop-blur-sm px-6 py-3 rounded-xl bg-black/50`}>
            {gameOver ? '¡Game Over!' : '¡Victoria!'}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game; 