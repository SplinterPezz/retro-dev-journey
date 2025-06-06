import React, { useMemo } from 'react';
import { WorldConfig } from '../../Pages/Sandbox/types';
import './TerrainRenderer.css';

interface TerrainRendererProps {
  worldConfig: WorldConfig;
}

interface TerrainTile {
  id: string;
  x: number;
  y: number;
  rotation: number;
}

const TerrainRenderer: React.FC<TerrainRendererProps> = ({ worldConfig }) => {
  // Generate terrain tiles based on world size and tile size
  const terrainTiles: TerrainTile[] = useMemo(() => {
    const tiles: TerrainTile[] = [];
    const { width, height, tileSize } = worldConfig;
    const possibleRotations = [0, 90, 180, 270];
    // Calculate how many tiles we need in each direction
    const tilesX = Math.ceil(width / tileSize);
    const tilesY = Math.ceil(height / tileSize);
    
    for (let x = 0; x < tilesX; x++) {
      for (let y = 0; y < tilesY; y++) {
        const randomRotation =
          possibleRotations[Math.floor(Math.random() * possibleRotations.length)];
        tiles.push({
          id: `terrain-${x}-${y}`,
          x: x * tileSize,
          y: y * tileSize,
          rotation: randomRotation
        });
      }
    }
    
    return tiles;
  }, [worldConfig]);

  return (
    <div className="terrain-renderer">
      {terrainTiles.map((tile) => (
        <div
          key={tile.id}
          className="terrain-tile"
          style={{
            position: 'absolute',
            left: tile.x,
            top: tile.y,
            width: worldConfig.tileSize +1,
            height: worldConfig.tileSize +1,
            backgroundImage: 'url(/sprites/terrain/main.png)',
            backgroundSize: `${worldConfig.tileSize + 1}px ${worldConfig.tileSize + 1}px`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            transform: `rotate(${tile.rotation}deg)`,
            zIndex: 0,
          }}
        />
      ))}
    </div>
  );
};

export default TerrainRenderer;