import { useState, useEffect } from 'react';
import { CollisionDetectionConfig, StructureData, Position } from '../types';

export const useCollisionDetection = (config: CollisionDetectionConfig) => {
  const [nearbyStructure, setNearbyStructure] = useState<StructureData | null>(null);

  // Calculate distance between two points
  const calculateDistance = (pos1: Position, pos2: Position): number => {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Check for nearby structures
  useEffect(() => {
    let closestStructure: StructureData | null = null;
    let closestDistance = Infinity;

    config.structures.forEach(structure => {
      const distance = calculateDistance(config.playerPosition, structure.position);
      const effectiveRadius = structure.interactionRadius || config.interactionRadius;
      
      if (distance <= effectiveRadius && distance < closestDistance) {
        closestDistance = distance;
        closestStructure = structure;
      }
    });

    setNearbyStructure(closestStructure);
  }, [config.playerPosition, config.structures, config.interactionRadius]);

  // Get all structures within interaction range
  const getNearbyStructures = (): StructureData[] => {
    return config.structures.filter(structure => {
      const distance = calculateDistance(config.playerPosition, structure.position);
      const effectiveRadius = structure.interactionRadius || config.interactionRadius;
      return distance <= effectiveRadius;
    });
  };

  // Check if player is near a specific structure
  const isNearStructure = (structureId: string): boolean => {
    return nearbyStructure?.id === structureId;
  };

  // Get distance to specific structure
  const getDistanceToStructure = (structureId: string): number | null => {
    const structure = config.structures.find(s => s.id === structureId);
    if (!structure) return null;
    return calculateDistance(config.playerPosition, structure.position);
  };

  return {
    nearbyStructure,
    getNearbyStructures,
    isNearStructure,
    getDistanceToStructure
  };
};