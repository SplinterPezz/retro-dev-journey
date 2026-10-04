import { fireEvent, render, screen } from '@testing-library/react';
import { collectionTexts } from '../../config/menu';
import CollectionView from './CollectionView';
import { CollectionEntry } from './useCollections';

const entries: CollectionEntry[] = [
  { id: 'floppy', name: 'Floppy disk', image: '/floppy.png', description: 'Old.', rarity: 'legendary', found: true },
  { id: 'phone', name: 'A phone', image: '/phone.png', description: 'Flappy.', rarity: 'rare', found: false },
];

const renderView = () => {
  const onBack = vi.fn();
  const onInspect = vi.fn();
  render(<CollectionView title="Items" theme="items" entries={entries} onBack={onBack} onInspect={onInspect} />);
  return { onBack, onInspect };
};

describe('CollectionView', () => {
  it('shows found items by name and missing ones as ???, with the count', () => {
    renderView();
    expect(screen.getByText('Floppy disk')).toBeInTheDocument();
    expect(screen.queryByText('A phone')).not.toBeInTheDocument();
    expect(screen.getByText(collectionTexts.missingName)).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('opens a found item, while a missing one is not a button', () => {
    const { onInspect } = renderView();
    fireEvent.click(screen.getByText('Floppy disk'));
    expect(onInspect).toHaveBeenCalledWith(entries[0]);
    expect(screen.getByText(collectionTexts.missingName).closest('button')).toBeNull();
  });

  it('goes back to the menu', () => {
    const { onBack } = renderView();
    fireEvent.click(screen.getByRole('button', { name: collectionTexts.back }));
    expect(onBack).toHaveBeenCalled();
  });
});
