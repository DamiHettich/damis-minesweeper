import React from 'react';
import { CellType } from '../utils/boardUtils.ts';


interface CellProps {
  cell: CellType;
  onClick: () => void;
  onRightClick: () => void;
  isCascading?: boolean;
}

const Cell: React.FC<CellProps> = ({ cell, onClick, onRightClick, isCascading }) => {
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick();
  };

  return (
    <button 
      onClick={onClick}
      onContextMenu={handleRightClick}
      className={`
        w-9 h-9
        flex items-center justify-center
        text-base font-bold
        rounded-md
        transition-all duration-200
        transform hover:scale-105
        ${cell.isRevealed 
          ? cell.adjacentMines === 0
            ? 'bg-red-900/80 shadow-inner'
            : 'bg-gray-800/90 shadow-inner'
          : 'bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 shadow-lg'}
        ${!cell.isRevealed ? 'border border-black border-b-2 border-r-2 border-black' : ''}
        ${cell.isRevealed && cell.isMine ? 'animate-explode bg-red-900/90' : ''}
        ${cell.isRevealed && !cell.isMine && !isCascading ? 'animate-reveal' : ''}
        ${cell.isRevealed && !cell.isMine && isCascading ? 'animate-cascade' : ''}
      `}
    >
      {cell.isRevealed && cell.isMine && '💣'}
      {cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 && (
        <span className={`${getNumberColor(cell.adjacentMines)} font-bold`}>
          {cell.adjacentMines}
        </span>
      )}
      {!cell.isRevealed && cell.isFlagged && '🚩'}
    </button>
  );
};

const getNumberColor = (num: number): string => {
  const colors = [
    '',
    'text-blue-300',    // 1
    'text-green-300',   // 2
    'text-pink-300',    // 3
    'text-yellow-300',  // 4
    'text-red-300',     // 5
    'text-cyan-300',    // 6
    'text-purple-300',  // 7
    'text-gray-300'     // 8
  ];
  return colors[num] || '';
};

export default Cell; 