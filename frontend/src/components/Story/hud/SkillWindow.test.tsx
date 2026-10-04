import { fireEvent, render, screen } from '@testing-library/react';
import { collectionTexts } from '../../../config/menu';
import { rarityLabels } from '../../../config/rarity';
import { CollectionEntry } from '../../GameMenu/useCollections';
import SkillWindow from './SkillWindow';

const java: CollectionEntry = {
  id: 'java',
  name: 'Java',
  image: '/java.png',
  description: 'Semicolons.',
  rarity: 'rare',
  found: true,
};

describe('SkillWindow', () => {
  it('shows the name, the chapter it was unlocked in and the rarity', () => {
    render(<SkillWindow entry={java} chapterName="Prologue" onInspect={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Java' })).toBeInTheDocument();
    expect(screen.getByText(`${collectionTexts.unlockedIn} Prologue`)).toBeInTheDocument();
    expect(screen.getByText(rarityLabels.rare)).toBeInTheDocument();
  });

  it('asks for the 3D view from Inspect, and has no close button', () => {
    const onInspect = vi.fn();
    render(<SkillWindow entry={java} chapterName="Prologue" onInspect={onInspect} />);
    fireEvent.click(screen.getByText(collectionTexts.inspect));
    expect(onInspect).toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: collectionTexts.close })).not.toBeInTheDocument();
  });
});
