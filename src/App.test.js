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
