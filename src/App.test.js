import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

test('AI Generate button appears after all subjects reach 10 questions', () => {
  render(<App />);
  const subjects = ['Physics', 'Chemistry', 'Mathematics'];
  subjects.forEach((subj, idx) => {
    fireEvent.click(screen.getByText(subj));
    fireEvent.click(screen.getByText('1st PUC'));
    const input = screen.getAllByRole('spinbutton')[0];
    fireEvent.change(input, { target: { value: '10' } });
    if (idx < subjects.length - 1) {
      expect(screen.queryByText(/AI Generate/i)).toBeNull();
    }
  });
  expect(screen.getByText(/AI Generate/i)).toBeInTheDocument();
});

test('allows selecting both PUC options', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Physics'));
  const first = screen.getByText('1st PUC');
  const second = screen.getByText('2nd PUC');
  fireEvent.click(first);
  fireEvent.click(second);
  expect(first.classList.contains('active')).toBe(true);
  expect(second.classList.contains('active')).toBe(true);
});

test('AI Generate triggers blur and sparkle overlay', () => {
  jest.useFakeTimers();
  render(<App />);
  const subjects = ['Physics', 'Chemistry', 'Mathematics'];
  subjects.forEach((subj) => {
    fireEvent.click(screen.getByText(subj));
    fireEvent.click(screen.getByText('1st PUC'));
    const input = screen.getAllByRole('spinbutton')[0];
    fireEvent.change(input, { target: { value: '10' } });
  });
  const btn = screen.getByText(/AI Generate/i);
  fireEvent.click(btn);
  const card = screen.getByTestId('card-content');
  expect(card.classList.contains('blur')).toBe(true);
  expect(screen.getByTestId('sparkle-overlay')).toBeInTheDocument();
  act(() => {
    jest.advanceTimersByTime(2000);
  });
  expect(card.classList.contains('blur')).toBe(false);
  expect(screen.queryByTestId('sparkle-overlay')).toBeNull();
  jest.useRealTimers();
});
