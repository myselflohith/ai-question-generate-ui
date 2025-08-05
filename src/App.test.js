import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('AI Generate button appears after assigning 10 questions', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Physics'));
  fireEvent.click(screen.getByText('1st PUC'));
  expect(screen.queryByText(/AI Generate/i)).toBeNull();
  const input = screen.getAllByRole('spinbutton')[0];
  fireEvent.change(input, { target: { value: '10' } });
  expect(screen.getByText(/AI Generate/i)).toBeInTheDocument();
});
