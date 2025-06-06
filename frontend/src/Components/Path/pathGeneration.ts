import { Position, PathGenerationConfig, PathSegment, IntersectionInfo } from '../../Pages/Sandbox/types';

export class PathGenerator {
  private config: PathGenerationConfig;
  private pathSegments: PathSegment[] = [];
  private mainPathX: number;
  private intersectionInfo: Map<string, IntersectionInfo> = new Map();

  constructor(config: PathGenerationConfig) {
    this.config = config;
    this.mainPathX = config.startPosition.x;
  }

  generatePath(): PathSegment[] {
    this.pathSegments = [];
    this.intersectionInfo.clear();

    // 1. Generate main vertical path
    this.generateMainPath();

    // 2. Generate horizontal branches to structures
    this.generateStructureBranches();

    // 3. Update main path intersections
    this.updateMainPathIntersections();

    return this.pathSegments;
  }

  private generateMainPath(): void {
    const { startPosition, endPosition, tileSize } = this.config;

    // Find the ??? company to extend path to it
    const futureCompany = this.config.structures.find(s => s.name === '???');
    const actualEndY = futureCompany ? futureCompany.position.y : endPosition.y;

    // Start segment
    this.addPathSegment({
      id: 'main-start',
      position: { x: startPosition.x, y: startPosition.y },
      type: 'start',
      rotation: 0,
      zIndex: 1
    });

    // Core segments (vertical path) - extend to the ??? company
    const segments = Math.floor((actualEndY - startPosition.y) / tileSize);

    for (let i = 1; i < segments; i++) {
      this.addPathSegment({
        id: `main-core-${i}`,
        position: {
          x: startPosition.x,
          y: startPosition.y + (i * tileSize)
        },
        type: 'core',
        rotation: 0,
        zIndex: 1
      });
    }

    // End segment
    this.addPathSegment({
      id: `main-core-${segments+1}`,
      position: { x: startPosition.x, y: actualEndY },
      type: 'core',
      rotation: 180,
      zIndex: 1
    });
  }

  private generateStructureBranches(): void {
    const { structures, tileSize } = this.config;

    structures.forEach((structure, index) => {
      const structurePos = structure.position;
      const branchY = this.findNearestMainPathY(structurePos.y);

      // Determine if structure is left or right of main path
      const isLeft = structurePos.x < this.mainPathX;
      const direction = isLeft ? 'left' : 'right';

      // Update intersection info for this Y position
      const intersectionKey = `${this.mainPathX},${branchY}`;
      const currentInfo = this.intersectionInfo.get(intersectionKey) || { count: 0, directions: [] };
      currentInfo.count += 1;
      if (!currentInfo.directions.includes(direction)) {
        currentInfo.directions.push(direction);
      }
      this.intersectionInfo.set(intersectionKey, currentInfo);

      // Generate horizontal branch
      this.generateHorizontalBranch(
        { x: this.mainPathX, y: branchY },
        structurePos,
        direction,
        `branch-${structure.id}`
      );
    });
  }

  private generateHorizontalBranch(
    start: Position,
    end: Position,
    direction: 'left' | 'right',
    branchId: string
  ): void {
    const { tileSize } = this.config;
    const isLeft = direction === 'left';
    const deltaX = Math.abs(end.x - start.x);
    const segments = Math.floor(deltaX / tileSize);
    
    
    // Generate horizontal segments
    for (let i = 1; i <= segments; i++) {
      const x = start.x + (isLeft ? -i * tileSize : i * tileSize);
      
      this.addPathSegment({
        id: `${branchId}-h-${i}`,
        position: { x, y: start.y },
        type: i === segments ? 'start' : 'core',
        rotation: (i === segments && isLeft) ? 270 : 90,
        zIndex: 1
      });
    }
  }

  private updateMainPathIntersections(): void {
   this.pathSegments
  .filter(segment => segment.id.startsWith('main-core-'))
  .forEach((segment, index, filteredArray) => {
        const intersectionKey = `${segment.position.x},${segment.position.y}`;
        const info = this.intersectionInfo.get(intersectionKey);
        const isLast = index === filteredArray.length - 1;
        
        if (info) {
          if (info.count === 1 && !isLast) {
            segment.type = 't_cross';
            const isRight = info.directions.includes('right');
            segment.rotation = isRight ? 180 : 0;
          } else if (info.count >= 2 && !isLast) {
            segment.type = 'cross';
            segment.rotation = 0;
          } else{
            segment.type = 'end';
            const isRight = info.directions.includes('right');
            segment.rotation = isRight ? 90 : 0;
          }
        }
        
      });
    
  }

  private findNearestMainPathY(targetY: number): number {
    const { startPosition, tileSize } = this.config;
    const relativeY = targetY - startPosition.y;
    const segmentIndex = Math.round(relativeY / tileSize);
    return startPosition.y + (segmentIndex * tileSize);
  }

  private addPathSegment(segment: PathSegment): void {
    this.pathSegments.push(segment);
  }
}

// Utility function to create path generator
export const createPathGenerator = (config: PathGenerationConfig): PathGenerator => {
  return new PathGenerator(config);
};