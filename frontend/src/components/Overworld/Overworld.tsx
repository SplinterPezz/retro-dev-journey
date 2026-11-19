import React from 'react';
import { createPathGenerator } from '../../game/path/pathGeneration';
import TerrainRenderer from '../Terrain/TerrainRenderer';
import PathRenderer from '../Path/PathRenderer';
import Structure from '../Structures/Structure';
import Environment from '../Structures/Environment';
import { companies } from '../../config/career';
import { detailsEnvironments, treesEnvironments } from '../../config/environments';
import { mainPathConfig, pathGenerationEnabled, terrainAutoRotate, worldConfig } from '../../config/world';
import { StructureData } from '../../types/sandbox';

const TREE_SIZE = 256;
const DETAIL_SIZE = 128;

interface OverworldProps {
  technologies: StructureData[];
  nearbyId: string | null;
  lockedIds?: string[];
  children?: React.ReactNode;
}

// The career world shared by the Sandbox and the Story map: terrain, the path to every
// building and statue, the buildings, the given statues and the decoration.
const Overworld: React.FC<OverworldProps> = ({ technologies, nearbyId, lockedIds = [], children }) => {
  const pathSegments = pathGenerationEnabled
    ? createPathGenerator({
        startPosition: { x: mainPathConfig.startX, y: mainPathConfig.startY },
        endPosition: { x: mainPathConfig.startX, y: mainPathConfig.endY },
        structures: [...companies, ...technologies],
        tileSize: worldConfig.tileSize,
      }).generatePath()
    : [];

  return (
    <>
      <TerrainRenderer worldConfig={worldConfig} autoRotate={terrainAutoRotate} />
      <PathRenderer pathSegments={pathSegments} tileSize={worldConfig.tileSize} />

      <div className="structure-container">
        {technologies.map((tech) => (
          <Structure key={tech.id} data={tech} type="technology" isNearby={nearbyId === tech.id} />
        ))}
      </div>

      <div className="structure-container">
        {companies.map((company) => (
          <Structure
            key={company.id}
            data={company}
            type="building"
            isNearby={nearbyId === company.id}
            locked={lockedIds.includes(company.id)}
          />
        ))}
      </div>

      <div className="structure-container">
        {treesEnvironments.map((environment, index) => (
          <Environment key={index} environment={environment} size={TREE_SIZE} />
        ))}
      </div>

      <div className="structure-container">
        {detailsEnvironments.map((environment, index) => (
          <Environment key={index} environment={environment} size={DETAIL_SIZE} />
        ))}
      </div>

      {children}
    </>
  );
};

export default Overworld;
