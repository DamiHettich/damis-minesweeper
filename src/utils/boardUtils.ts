export interface CellType {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  isCascading?: boolean;
}

/**
 * Generates a new game board with the specified dimensions and number of mines
 * @param size - The size of the board (width and height)
 * @param numMines - The number of mines to place on the board
 * @returns A 2D array representing the game board
 */
export const generateBoard = (size: number, numMines: number): CellType[][] => {
  // Initialize empty board
  const board: CellType[][] = Array(size).fill(null).map(() =>
    Array(size).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0
    }))
  );

  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < numMines) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    
    if (!board[x][y].isMine) {
      board[x][y].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate adjacent mines
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!board[i][j].isMine) {
        let count = 0;
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            const ni = i + di;
            const nj = j + dj;
            if (ni >= 0 && ni < size && nj >= 0 && nj < size && board[ni][nj].isMine) {
              count++;
            }
          }
        }
        board[i][j].adjacentMines = count;
      }
    }
  }

  return board;
};

export const revealCell = (board: CellType[][], row: number, col: number, isCascading: boolean = false): CellType[][] => {
  if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
    return board;
  }

  const cell = board[row][col];
  if (cell.isRevealed || cell.isFlagged) {
    return board;
  }

  const newBoard = board.map(row => [...row]);
  newBoard[row][col] = { 
    ...cell, 
    isRevealed: true,
    isCascading: isCascading 
  };

  if (cell.adjacentMines === 0 && !cell.isMine) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      
      if (
        newRow >= 0 && newRow < board.length &&
        newCol >= 0 && newCol < board[0].length &&
        !newBoard[newRow][newCol].isRevealed &&
        !newBoard[newRow][newCol].isFlagged
      ) {
        const expandedBoard = revealCell(newBoard, newRow, newCol, true);
        expandedBoard.forEach((row, i) => {
          row.forEach((cell, j) => {
            newBoard[i][j] = cell;
          });
        });
      }
    });
  }

  return newBoard;
};

export const checkWin = (board: CellType[][]): boolean => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const cell = board[i][j];
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
}; 