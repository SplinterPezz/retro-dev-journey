import { useState, useEffect, useCallback } from 'react';
import { Position, Direction, PlayerMovementConfig, StructureData, Hitbox } from '../types';

interface PlayerMovementConfigExtended extends PlayerMovementConfig {
  structures?: StructureData[];
  playerHitbox?: Hitbox; // Optional hitbox for the player
}

export const usePlayerMovement = (config: PlayerMovementConfigExtended) => {
  const [position, setPosition] = useState<Position>(config.initialPosition);
  const [direction, setDirection] = useState<Direction>('idle');
  const [isMoving, setIsMoving] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // Default player hitbox if not provided
  const defaultPlayerHitbox: Hitbox = {
    x: -32, // Center the hitbox around player position
    y: -32,
    width: 64,
    height: 64
  };

  const playerHitbox = config.playerHitbox || defaultPlayerHitbox;

  // Handle key press
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift', ' '].includes(key)) {
      event.preventDefault();
      setPressedKeys(prev => new Set([...prev, key]));
    }
  }, []);

  // Handle key release
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    setPressedKeys(prev => {
      const newKeys = new Set(prev);
      newKeys.delete(key);
      return newKeys;
    });
  }, []);

  // Calculate movement direction from pressed keys
  const getDirectionFromKeys = useCallback((keys: Set<string>): Direction => {
    const up = keys.has('w') || keys.has('arrowup');
    const down = keys.has('s') || keys.has('arrowdown');
    const left = keys.has('a') || keys.has('arrowleft');
    const right = keys.has('d') || keys.has('arrowright');

    if (up && left) return 'up-left';
    if (up && right) return 'up-right';
    if (down && left) return 'down-left';
    if (down && right) return 'down-right';
    if (up) return 'up';
    if (down) return 'down';
    if (left) return 'left';
    if (right) return 'right';
    
    return 'idle';
  }, []);

  // Check if two hitboxes overlap
  const checkHitboxCollision = (pos1: Position, hitbox1: Hitbox, pos2: Position, hitbox2: Hitbox): boolean => {
    const box1 = {
      x: pos1.x + hitbox1.x,
      y: pos1.y + hitbox1.y,
      width: hitbox1.width,
      height: hitbox1.height
    };

    const box2 = {
      x: pos2.x + hitbox2.x,
      y: pos2.y + hitbox2.y,
      width: hitbox2.width,
      height: hitbox2.height
    };

    return box1.x < box2.x + box2.width &&
           box1.x + box1.width > box2.x &&
           box1.y < box2.y + box2.height &&
           box1.y + box1.height > box2.y;
  };

  // Check collision with structures
  const checkStructureCollision = (newPos: Position): boolean => {
    if (!config.structures) return false;

    return config.structures.some(structure => {
      if (!structure.data.collisionHitbox) return false;
      
      return checkHitboxCollision(
        newPos, 
        playerHitbox, 
        structure.position, 
        structure.data.collisionHitbox
      );
    });
  };

  // Calculate new position based on direction
  const calculateNewPosition = useCallback((currentPos: Position, dir: Direction, speed: number): Position => {
    let newX = currentPos.x;
    let newY = currentPos.y;
    
    // Diagonal movement is slower to maintain consistent speed
    const diagonalSpeed = speed * 0.707; // √2/2 ≈ 0.707

    switch (dir) {
      case 'up':
        newY -= speed;
        break;
      case 'down':
        newY += speed;
        break;
      case 'left':
        newX -= speed;
        break;
      case 'right':
        newX += speed;
        break;
      case 'up-left':
        newX -= diagonalSpeed;
        newY -= diagonalSpeed;
        break;
      case 'up-right':
        newX += diagonalSpeed;
        newY -= diagonalSpeed;
        break;
      case 'down-left':
        newX -= diagonalSpeed;
        newY += diagonalSpeed;
        break;
      case 'down-right':
        newX += diagonalSpeed;
        newY += diagonalSpeed;
        break;
    }

    const newPos = { x: newX, y: newY };

    // Check world bounds
    newPos.x = Math.max(config.worldBounds.minX, Math.min(config.worldBounds.maxX, newPos.x));
    newPos.y = Math.max(config.worldBounds.minY, Math.min(config.worldBounds.maxY, newPos.y));

    // Check structure collisions
    if (checkStructureCollision(newPos)) {
      // Try moving only on X axis
      const xOnlyPos = { x: newPos.x, y: currentPos.y };
      if (!checkStructureCollision(xOnlyPos)) {
        return xOnlyPos;
      }
      
      // Try moving only on Y axis
      const yOnlyPos = { x: currentPos.x, y: newPos.y };
      if (!checkStructureCollision(yOnlyPos)) {
        return yOnlyPos;
      }
      
      // No movement possible, stay at current position
      return currentPos;
    }

    return newPos;
  }, [config.worldBounds, config.structures, playerHitbox]);

  // Movement loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      const currentDirection = getDirectionFromKeys(pressedKeys);
      const moving = currentDirection !== 'idle';
      const isRunning = pressedKeys.has('shift') || pressedKeys.has(' ');
      
      setDirection(currentDirection);
      setIsMoving(moving);

      if (moving) {
        const currentSpeed = isRunning ? config.speed * 1.5 : config.speed;
        setPosition(currentPos => calculateNewPosition(currentPos, currentDirection, currentSpeed));
      }
    }, 16); // ~60 FPS

    return () => clearInterval(gameLoop);
  }, [pressedKeys, getDirectionFromKeys, calculateNewPosition, config.speed]);

  // Event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Prevent context menu on long press (mobile)
  useEffect(() => {
    const preventContextMenu = (e: Event) => e.preventDefault();
    window.addEventListener('contextmenu', preventContextMenu);
    return () => window.removeEventListener('contextmenu', preventContextMenu);
  }, []);

  return {
    playerPosition: position,
    direction,
    isMoving,
    setPlayerPosition: setPosition,
    playerHitbox
  };
};