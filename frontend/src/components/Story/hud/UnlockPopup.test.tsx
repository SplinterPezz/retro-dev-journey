import { fireEvent, render, screen } from '@testing-library/react';
import UnlockPopup from './UnlockPopup';

const props = {
  kicker: 'New technology unlocked!',
  image: '/sprites/statues/java.png',
  title: 'Java',
  subtitle: 'Programming Language',
  text: 'Classes, objects and semicolons.',
  note: 'Its statue now stands on the map.',
};

describe('UnlockPopup', () => {
  it('shows the sprite, the title and the text, then confirms', () => {
    const onConfirm = vi.fn();
    const { container } = render(<UnlockPopup {...props} remaining={2} onConfirm={onConfirm} />);
    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('Classes, objects and semicolons.')).toBeInTheDocument();
    expect(screen.getByText('Its statue now stands on the map.')).toBeInTheDocument();
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/sprites/statues/java.png');
    expect(screen.getByText('+2 more')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('closes with "Got it" on the last one', () => {
    render(<UnlockPopup {...props} remaining={0} onConfirm={() => undefined} />);
    expect(screen.getByText('Got it')).toBeInTheDocument();
  });
});
