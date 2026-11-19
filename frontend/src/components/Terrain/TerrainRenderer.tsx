import React, { useState } from 'react';
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

const randomTiles = (width: number, height: number, tileSize: number): TerrainTile[] => {
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
};

// Rotated tiles each need their own div; unrotated, the floor is one repeating background.
const TerrainRenderer: React.FC<TerrainRendererProps> = ({ worldConfig, autoRotate = true, terrainImage = mainTerrainImage }) => {
  const { width, height, tileSize } = worldConfig;

  // rolled once per mount: a scene keeps its world size for its whole life
  const [terrainTiles] = useState(() => (autoRotate ? randomTiles(width, height, tileSize) : []));

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

export default TerrainRenderer;
