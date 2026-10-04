import React from 'react';
import { CollectibleData } from '../../../types/story';
import { quizSparkleImage } from '../../../config/story/assets';
import './Collectibles.css';

interface CollectibleItemProps {
  item: CollectibleData;
  near: boolean; // hidden until the player is close
}

// A collectible lying in the room: invisible from afar, it fades in with the
// quiz marker's sparkle when the player gets close, and bobs.
const CollectibleItem: React.FC<CollectibleItemProps> = ({ item, near }) => {
  if (!item.position) return null;
  return (
    <div
      className={`collectible-item${near ? ' near' : ''}`}
      style={{
        left: item.position.x,
        top: item.position.y,
        ['--sparkle-image' as string]: `url('${quizSparkleImage}')`,
      }}
      aria-hidden="true"
    >
      <img src={item.image} alt="" className="collectible-item-sprite" />
    </div>
  );
};

export default React.memo(CollectibleItem);
