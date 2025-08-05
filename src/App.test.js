import { render, screen, fireEvent } from '@testing-library/react';
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

test('selecting 1st PUC opens first chapter by default', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Physics'));
  fireEvent.click(screen.getByText('1st PUC'));
  const topics = screen.getByText('Motion and Laws').nextElementSibling;
  expect(topics.classList.contains('show')).toBe(true);
});
