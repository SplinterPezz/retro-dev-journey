import { fireEvent, render, screen } from '@testing-library/react';
import DiscoveryPopup from './DiscoveryPopup';
import { TechnologyData } from '../../../types/sandbox';

const java = {
  id: 'java',
  name: 'Java',
  category: 'Programming Language',
  description: 'Sandbox text',
  learnedText: 'Classes, objects and semicolons.',
  image: '/sprites/statues/java.png',
  position: { x: 0, y: 0 },
} as TechnologyData;

describe('DiscoveryPopup', () => {
  it('shows the statue, the name and how it was learned, then confirms', () => {
    const onConfirm = vi.fn();
    const { container } = render(<DiscoveryPopup technology={java} remaining={2} onConfirm={onConfirm} />);
    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('Classes, objects and semicolons.')).toBeInTheDocument();
    expect(screen.queryByText('Sandbox text')).not.toBeInTheDocument();
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/sprites/statues/java.png');
    expect(screen.getByText('+2 more')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('closes with "Got it" on the last one', () => {
    render(<DiscoveryPopup technology={java} remaining={0} onConfirm={() => undefined} />);
    expect(screen.getByText('Got it')).toBeInTheDocument();
  });
});
