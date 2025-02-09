import { generateBoard, revealCell, checkWin } from '../utils/boardUtils';

describe('Board Utils', () => {
  test('generates board with correct dimensions', () => {
    const board = generateBoard(10, 10);
    expect(board.length).toBe(10);
    expect(board[0].length).toBe(10);
  });

  test('places correct number of mines', () => {
    const board = generateBoard(10, 5);
    const mineCount = board.flat().filter(cell => cell.isMine).length;
    expect(mineCount).toBe(5);
  });

  // Más tests...
}); 