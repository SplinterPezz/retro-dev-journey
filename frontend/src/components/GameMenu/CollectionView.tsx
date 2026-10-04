import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { collectionTexts } from '../../config/menu';
import { CollectionEntry } from './useCollections';
import '../Common/rarity.css';
import './CollectionView.css';

interface CollectionViewProps {
  title: string;
  theme: 'items' | 'skills';
  entries: CollectionEntry[];
  onBack: () => void;
  onInspect: (entry: CollectionEntry) => void;
}

const CollectionCell: React.FC<{ entry: CollectionEntry; onInspect: (entry: CollectionEntry) => void }> = ({ entry, onInspect }) => {
  if (!entry.found) {
    return (
      <li className="collection-cell collection-cell--missing">
        <div className="collection-cell-art">
          <div className="collection-silhouette" style={{ ['--silhouette' as string]: `url('${entry.image}')` }} />
        </div>
        <div className="collection-cell-name">{collectionTexts.missingName}</div>
      </li>
    );
  }
  return (
    <li>
      <button type="button" className={`collection-cell rarity--${entry.rarity}`} onClick={() => onInspect(entry)}>
        <div className="collection-cell-art">
          <img src={entry.image} alt="" />
        </div>
        <div className="collection-cell-name">{entry.name}</div>
      </button>
    </li>
  );
};

const CollectionView: React.FC<CollectionViewProps> = ({ title, theme, entries, onBack, onInspect }) => {
  const foundCount = entries.filter((e) => e.found).length;

  return (
    <div className={`collection collection--${theme}`}>
      <div className="collection-header">
        <button type="button" className="rpgui-button collection-back" onClick={onBack} aria-label={collectionTexts.back}>
          <ArrowLeft size={20} color="white" strokeWidth={3} className="volume-filter" />
        </button>
        <h3 className="collection-title">{title}</h3>
        <div className="collection-count">
          {foundCount} / {entries.length}
        </div>
      </div>

      <div className="collection-scroll">
        <ul className="collection-grid">
          {entries.map((entry) => (
            <CollectionCell key={entry.id} entry={entry} onInspect={onInspect} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CollectionView;
