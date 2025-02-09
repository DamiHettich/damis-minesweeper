import React from 'react';
import Cell from './Cell.tsx';
import { CellType } from '../utils/boardUtils';

interface BoardProps {
  board: CellType[][];
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, onCellRightClick }) => {
  return (
    <div className="bg-gray-900/50 p-2 rounded-xl shadow-inner">
      <div className="grid gap-1">
        {board.map((row, i) => (
          <div key={`row-${i}`} className="flex gap-1">
            {row.map((cell, j) => (
              <Cell 
                key={`${i}-${j}`} 
                cell={cell}
                onClick={() => onCellClick(i, j)}
                onRightClick={() => onCellRightClick(i, j)}
                isCascading={cell.isCascading}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board; 