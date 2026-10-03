import React from 'react';
import { PathSegment } from '../../types/sandbox';
import { pathSprites } from '../../config/assets';
import './PathRenderer.css';

interface PathRendererProps {
  pathSegments: PathSegment[];
  tileSize: number;
}

const PathRenderer: React.FC<PathRendererProps> = ({ pathSegments, tileSize }) => (
  <div className="path-renderer">
    {pathSegments.map((segment) => (
      <div
        key={segment.id}
        className={`path-segment path-${segment.type}`}
        style={{
          left: segment.position.x - 64,
          top: segment.position.y - 64,
          width: tileSize + 1,
          height: tileSize + 1,
          zIndex: segment.zIndex,
          backgroundImage: `url(${pathSprites[segment.type] ?? pathSprites.core})`,
          transform: segment.rotation !== 0 ? `rotate(${segment.rotation}deg)` : undefined,
          transformOrigin: 'center center',
        }}
      />
    ))}
  </div>
);

export default React.memo(PathRenderer);
