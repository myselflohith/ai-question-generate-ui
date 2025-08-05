import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AI Generate button', () => {
  render(<App />);
  const button = screen.getByText(/AI Generate/i);
  expect(button).toBeInTheDocument();
});
