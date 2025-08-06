import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('AI Generate button appears after all subjects reach 10 questions', () => {
  render(<App />);
  const subjects = ['Physics', 'Chemistry', 'Mathematics'];
  subjects.forEach((subj, idx) => {
    fireEvent.click(screen.getByText(subj));
    fireEvent.click(screen.getByText('1st PUC'));
    fireEvent.click(screen.getByText('Motion and Laws'));
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Motion and Laws'));
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

test('topics are hidden until chapter header is clicked', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Physics'));
  fireEvent.click(screen.getByText('1st PUC'));
  fireEvent.click(screen.getByText('Motion and Laws'));
  fireEvent.click(screen.getByText('Continue'));
  const header = screen.getByText('Motion and Laws').parentElement;
  const topics = header.nextElementSibling;
  expect(topics.classList.contains('show')).toBe(false);
  fireEvent.click(header);
  expect(topics.classList.contains('show')).toBe(true);
});
