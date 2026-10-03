import { WorldConfig, Position, Hitbox } from '../types/game';

// The overworld shared by the Sandbox and the Story Mode map.

export const tileSize: number = 128;

// Feature flags
export const terrainAutoRotate: boolean = true; // set to false to disable random rotation of terrain tiles
export const pathGenerationEnabled: boolean = true; // set to false to disable path generation and rendering

export const defaultStatue: string = '/sprites/statues/default.png';
export const defaultBuilding: string = '/sprites/buildings/default.png';
export const mainTerrainImage: string = '/sprites/terrain/main.png';

export const playerHitbox: Hitbox = {
  x: -16,
  y: -16,
  width: 32,
  height: 32
};

export const structureCentering: Position = {
  x: -256,
  y: -490
}

export const technologyCentering: Position = {
  x: -90,
  y: -200,
}

// World configuration
export const worldConfig: WorldConfig = {
  width: 2000,
  height: 3024,
  tileSize: tileSize
};

// Main path configuration
export const mainPathConfig = {
  startX: worldConfig.width / 2,
  startY: 100,
  endY: worldConfig.height,
  width: tileSize
};

// Player spawn position (where the character appears when entering the sandbox)
export const playerSpawnPosition: Position = {
  x: mainPathConfig.startX,
  y: mainPathConfig.startY + 50
};

