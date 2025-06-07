import { useState, useEffect } from 'react';
import { CollisionDetectionConfig, StructureData, Position, Hitbox } from '../types';

export const useCollisionDetection = (config: CollisionDetectionConfig) => {
  const [nearbyStructure, setNearbyStructure] = useState<StructureData | null>(null);

  // Calculate distance between two points
  const calculateDistance = (pos1: Position, pos2: Position): number => {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Check if a point is inside a hitbox
  const isPointInHitbox = (point: Position, hitbox: Hitbox, structurePosition: Position): boolean => {
    const absoluteHitbox = {
      x: structurePosition.x + hitbox.x,
      y: structurePosition.y + hitbox.y,
      width: hitbox.width,
      height: hitbox.height
    };

    return point.x >= absoluteHitbox.x &&
           point.x <= absoluteHitbox.x + absoluteHitbox.width &&
           point.y >= absoluteHitbox.y &&
           point.y <= absoluteHitbox.y + absoluteHitbox.height;
  };

  // Check collision using hitbox or fallback to radius
  const checkCollisionWithStructure = (playerPos: Position, structure: StructureData): boolean => {
    const distance = calculateDistance(playerPos, structure.position);
    const effectiveRadius = structure.interactionRadius || config.interactionRadius;
    return distance <= effectiveRadius;
  };

  // Check for nearby structures
  useEffect(() => {
    let closestStructure: StructureData | null = null;
    let closestDistance = Infinity;

    config.structures.forEach(structure => {
      if (checkCollisionWithStructure(config.playerPosition, structure)) {
        
        // If using hitbox, we consider it as distance 0 for priority
        // If using radius, calculate actual distance
        let distance = 0;
        
        if (!structure.data.collisionHitbox) {
          distance = calculateDistance(config.playerPosition, structure.position);
        }
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestStructure = structure;
        }
      }
    });

    setNearbyStructure(closestStructure);
  }, [config.playerPosition, config.structures, config.interactionRadius]);

  // Get all structures within interaction range
  const getNearbyStructures = (): StructureData[] => {
    return config.structures.filter(structure => 
      checkCollisionWithStructure(config.playerPosition, structure)
    );
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