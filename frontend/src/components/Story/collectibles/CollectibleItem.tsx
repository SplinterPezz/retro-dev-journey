import React from 'react';
import { CollectibleData } from '../../../types/story';
import { sparkleStyle } from '../../../config/story/assets';
import './Collectibles.css';

interface CollectibleItemProps {
  item: CollectibleData;
  near: boolean;
}

const CollectibleItem: React.FC<CollectibleItemProps> = ({ item, near }) => {
  if (!item.position) return null;
  return (
    <div
      className={`collectible-item${near ? ' near' : ''}`}
      style={{
        left: item.position.x,
        top: item.position.y,
        ...sparkleStyle,
      }}
      aria-hidden="true"
    >
      <img src={item.image} alt="" className="collectible-item-sprite" />
    </div>
  );
};

export default React.memo(CollectibleItem);
