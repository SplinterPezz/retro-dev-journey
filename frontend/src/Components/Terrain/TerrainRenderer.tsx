import React, { useMemo } from 'react';
import { WorldConfig } from '../../types/game';
import { mainTerrainImage } from '../../config/world';
import './TerrainRenderer.css';

interface TerrainRendererProps {
  worldConfig: WorldConfig;
  autoRotate?: boolean;
  terrainImage?: string;
}

interface TerrainTile {
  id: string;
  x: number;
  y: number;
  rotation: number;
}

const ROTATIONS = [0, 90, 180, 270];

// Ground of a scene. With random rotation every tile is its own div (rotated
// tiles break up the grass pattern); without it the floor is one div with a
// repeating background, which is a single layer instead of hundreds.
const TerrainRenderer: React.FC<TerrainRendererProps> = ({ worldConfig, autoRotate = true, terrainImage = mainTerrainImage }) => {
  const { width, height, tileSize } = worldConfig;

  const terrainTiles: TerrainTile[] = useMemo(() => {
    if (!autoRotate) return [];
    const tiles: TerrainTile[] = [];
    const tilesX = Math.ceil(width / tileSize);
    const tilesY = Math.ceil(height / tileSize);
    for (let x = 0; x < tilesX; x++) {
      for (let y = 0; y < tilesY; y++) {
        tiles.push({
          id: `terrain-${x}-${y}`,
          x: x * tileSize,
          y: y * tileSize,
          rotation: ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)],
        });
      }
    }
    return tiles;
  }, [width, height, tileSize, autoRotate]);

  if (!autoRotate) {
    return (
      <div
        className="terrain-renderer terrain-floor"
        style={{
          backgroundImage: `url(${terrainImage})`,
          backgroundSize: `${tileSize}px ${tileSize}px`,
        }}
      />
    );
  }

  return (
    <div className="terrain-renderer">
      {terrainTiles.map((tile) => (
        <div
          key={tile.id}
          className="terrain-tile"
          style={{
            left: tile.x,
            top: tile.y,
            width: tileSize + 1,
            height: tileSize + 1,
            backgroundImage: `url(${terrainImage})`,
            backgroundSize: `${tileSize + 1}px ${tileSize + 1}px`,
            transform: `rotate(${tile.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(TerrainRenderer);
