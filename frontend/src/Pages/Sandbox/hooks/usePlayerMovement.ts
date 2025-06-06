import { useState, useEffect, useCallback } from 'react';
import { Position, Direction, PlayerMovementConfig } from '../types';

export const usePlayerMovement = (config: PlayerMovementConfig) => {
  const [position, setPosition] = useState<Position>(config.initialPosition);
  const [direction, setDirection] = useState<Direction>('idle');
  const [isMoving, setIsMoving] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // Handle key press
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift'].includes(key)) {
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

    // Apply world bounds
    newX = Math.max(config.worldBounds.minX, Math.min(config.worldBounds.maxX, newX));
    newY = Math.max(config.worldBounds.minY, Math.min(config.worldBounds.maxY, newY));

    return { x: newX, y: newY };
  }, [config.worldBounds]);

  // Movement loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      const currentDirection = getDirectionFromKeys(pressedKeys);
      const moving = currentDirection !== 'idle';
      const isRunning = pressedKeys.has('shift');
      
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
    setPlayerPosition: setPosition
  };
};