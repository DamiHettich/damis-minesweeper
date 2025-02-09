import { render, screen, fireEvent } from '@testing-library/react';
import Game from '../components/Game';

describe('Game Component', () => {
  test('renders game title', () => {
    render(<Game />);
    expect(screen.getByText('Minesweeper')).toBeInTheDocument();
  });

  test('starts new game when difficulty changes', () => {
    render(<Game />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'intermediate' } });
    expect(screen.getByText('🙂')).toBeInTheDocument();
  });

  test('shows game over when clicking a mine', () => {
    render(<Game />);
    // Aquí necesitaremos mockear la generación del tablero para asegurar una mina
    // ... implementar lógica de test
  });
}); 