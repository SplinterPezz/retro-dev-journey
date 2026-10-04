import React from 'react';
import { collectibleIcon } from '../../../config/story/collectibles';
import './Collectibles.css';

interface CollectibleCounterProps {
  found: number;
  total: number;
}

const CollectibleCounter: React.FC<CollectibleCounterProps> = ({ found, total }) => (
  <div className={`collectible-counter${found >= total ? ' complete' : ''}`} title="Collectibles" aria-label={`Collectibles ${found} of ${total}`}>
    <img src={collectibleIcon} alt="" className="collectible-counter-icon" />
    <span>
      {found}/{total}
    </span>
  </div>
);

export default React.memo(CollectibleCounter);
