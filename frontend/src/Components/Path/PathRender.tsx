import React from 'react';
import { PathSegment } from '../../Pages/Sandbox/types';
import './PathRender.css';

interface PathRendererProps {
  pathSegments: PathSegment[];
  tileSize?: number;
}

const PathRenderer: React.FC<PathRendererProps> = ({ pathSegments, tileSize }) => {
  const getPathImage = (type: PathSegment['type']): string => {
    switch (type) {
      case 'core':
        return '/sprites/terrain/path_core.png';
      case 'start':
        return '/sprites/terrain/path_start.png';
      case 'cross':
        return '/sprites/terrain/path_cross.png';
      case 't_cross':
        return '/sprites/terrain/path_t_cross.png';
      case 'end':
        return '/sprites/terrain/path_end.png';
      default:
        return '/sprites/terrain/path_core.png';
    }
  };

  const getTransformStyle = (rotation: number): React.CSSProperties => {
    return {
      transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
      transformOrigin: 'center center'
    };
  };

  return (
    <div className="path-renderer">
      {pathSegments.map((segment) => (
        <div
          key={segment.id}
          className={`path-segment path-${segment.type}`}
          style={{
            position: 'absolute',
            left: segment.position.x - 64,
            top: segment.position.y - 64,
            width: tileSize != undefined ? tileSize+1 : tileSize,
            height: tileSize != undefined ? tileSize+1 : tileSize,
            zIndex: segment.zIndex,
            backgroundImage: `url(${getPathImage(segment.type)})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
            ...getTransformStyle(segment.rotation)
          }}
        />
      ))}
    </div>
  );
};

export default PathRenderer;