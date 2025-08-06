import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('AI Generate button appears after all subjects reach 10 questions', async () => {
  render(<App />);
  const subjects = ['PHYSICS', 'CHEMISTRY', 'MATHEMATICS'];
  for (let idx = 0; idx < subjects.length; idx++) {
    const subj = subjects[idx];
    fireEvent.click(await screen.findByText(subj));
    fireEvent.click(await screen.findByText('I PUC'));
    fireEvent.click(await screen.findByText('Units and Measurements'));
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Units and Measurements'));
    const input = screen.getAllByRole('spinbutton')[0];
    fireEvent.change(input, { target: { value: '10' } });
    if (idx < subjects.length - 1) {
      expect(screen.queryByText(/AI Generate/i)).toBeNull();
    }
  }
  expect(screen.getByText(/AI Generate/i)).toBeInTheDocument();
});

test('allows selecting both PUC options', async () => {
  render(<App />);
  fireEvent.click(await screen.findByText('PHYSICS'));
  const first = await screen.findByText('I PUC');
  const second = await screen.findByText('II PUC');
  fireEvent.click(first);
  fireEvent.click(second);
  expect(first.classList.contains('active')).toBe(true);
  expect(second.classList.contains('active')).toBe(true);
});

test('topics are hidden until chapter header is clicked', async () => {
  render(<App />);
  fireEvent.click(await screen.findByText('PHYSICS'));
  fireEvent.click(await screen.findByText('I PUC'));
  fireEvent.click(await screen.findByText('Units and Measurements'));
  fireEvent.click(screen.getByText('Continue'));
  const header = screen.getByText('Units and Measurements').parentElement;
  const topics = header.nextElementSibling;
  expect(topics.classList.contains('show')).toBe(false);
  fireEvent.click(header);
  expect(topics.classList.contains('show')).toBe(true);
});
