import { useState, useEffect, useCallback, useRef } from 'react';
import { Position, Direction, PlayerMovementConfig, StructureData, Hitbox } from '../../../types/sandbox';
import { playerHitbox } from '../config';

interface PlayerMovementConfigExtended extends PlayerMovementConfig {
  structures?: StructureData[];
  playerHitbox?: Hitbox;
}

// Pure functions outside the hook
const getDirectionFromKeys = (keys: Set<string>): Direction => {
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
};

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
const checkStructureCollision = (
  newPos: Position, 
  playerHitbox: Hitbox, 
  structures?: StructureData[]
): boolean => {
  if (!structures) return false;

  return structures.some(structure => {
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
const calculateNewPosition = (
  currentPos: Position, 
  dir: Direction, 
  speed: number,
  worldBounds: any,
  playerHitbox: Hitbox,
  structures?: StructureData[]
): Position => {
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
  newPos.x = Math.max(worldBounds.minX, Math.min(worldBounds.maxX, newPos.x));
  newPos.y = Math.max(worldBounds.minY, Math.min(worldBounds.maxY, newPos.y));

  // Check structure collisions
  if (checkStructureCollision(newPos, playerHitbox, structures)) {
    // Try moving only on X axis
    const xOnlyPos = { x: newPos.x, y: currentPos.y };
    if (!checkStructureCollision(xOnlyPos, playerHitbox, structures)) {
      return xOnlyPos;
    }
    
    // Try moving only on Y axis
    const yOnlyPos = { x: currentPos.x, y: newPos.y };
    if (!checkStructureCollision(yOnlyPos, playerHitbox, structures)) {
      return yOnlyPos;
    }
    
    // No movement possible, stay at current position
    return currentPos;
  }

  return newPos;
};

export const usePlayerMovement = (config: PlayerMovementConfigExtended) => {
  const [position, setPosition] = useState<Position>(config.initialPosition);
  const [direction, setDirection] = useState<Direction>('idle');
  const [isMoving, setIsMoving] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  
  // Refs to track focus and prevent stale closures
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const isWindowFocusedRef = useRef(true);
  
  // Valid movement keys only
  const validKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift', ' '];

  // Clear all keys - used when focus is lost or on certain events
  const clearAllKeys = useCallback(() => {
    setPressedKeys(new Set());
  }, []);

  // Handle key press with better validation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    
    // Only handle our valid movement keys
    if (!validKeys.includes(key)) return;
    
    // Prevent default behavior for movement keys
    event.preventDefault();

    if (!isWindowFocusedRef.current) return;
    
    // Check for problematic key combinations that might cause issues
    if (event.ctrlKey || event.altKey || event.metaKey) {
      clearAllKeys();
      return;
    }
    
    setPressedKeys(prev => new Set([...prev, key]));
  }, [clearAllKeys]);

  // Handle key release with better validation
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    
    // Only handle our valid movement keys
    if (!validKeys.includes(key)) return;
    
    setPressedKeys(prev => {
      const newKeys = new Set(prev);
      newKeys.delete(key);
      return newKeys;
    });
  }, []);

  // Handle window focus/blur events
  const handleWindowFocus = useCallback(() => {
    isWindowFocusedRef.current = true;
  }, []);

   // Clear all keys when window loses focus
  const handleWindowBlur = useCallback(() => {
    isWindowFocusedRef.current = false;
    clearAllKeys();
  }, [clearAllKeys]);

  // Handle visibility change (tab switching)
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      isWindowFocusedRef.current = false;
      clearAllKeys();
    } else {
      isWindowFocusedRef.current = true;
    }
  }, [clearAllKeys]);

  // Movement loop
  useEffect(() => {
    const gameLoop = () => {
      // Don't process movement if window is not focused
      if (!isWindowFocusedRef.current) {
        clearAllKeys();
        return;
      }

      const currentDirection = getDirectionFromKeys(pressedKeys);
      const moving = currentDirection !== 'idle';
      const isRunning = pressedKeys.has('shift') || pressedKeys.has(' ');
      
      setDirection(currentDirection);
      setIsMoving(moving);

      if (moving) {
        const currentSpeed = isRunning ? config.speed * 1.5 : config.speed;
        setPosition(currentPos => 
          calculateNewPosition(
            currentPos, 
            currentDirection, 
            currentSpeed, 
            config.worldBounds, 
            playerHitbox, 
            config.structures
          )
        );
      }
    };

    // Start the game loop
    gameLoopRef.current = setInterval(gameLoop, 16); // ~60 FPS

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [pressedKeys, config.speed, config.worldBounds, config.structures, clearAllKeys]);

  // Event listeners with comprehensive cleanup
  useEffect(() => {
    // Keyboard events
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);    
    
    // Window focus events
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    
    // Visibility change (tab switching)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Mouse events (clicking outside might cause focus issues)
    const handleMouseLeave = () => {
      // Small delay to avoid clearing keys during normal gameplay
      setTimeout(() => {
        if (!document.hasFocus()) {
          clearAllKeys();
        }
      }, 100);
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      // Cleanup all event listeners
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      // Clear the game loop
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp, handleWindowFocus, handleWindowBlur, handleVisibilityChange, clearAllKeys]);

  // Prevent context menu on long press (mobile)
  useEffect(() => {
    const preventContextMenu = (e: Event) => e.preventDefault();
    window.addEventListener('contextmenu', preventContextMenu);
    return () => window.removeEventListener('contextmenu', preventContextMenu);
  }, []);

  // Debug function for development
  const debugInfo = process.env.REACT_APP_ENV === 'development' ? {
    pressedKeys: Array.from(pressedKeys),
    isWindowFocused: isWindowFocusedRef.current,
    position,
    direction,
    isMoving
  } : undefined;

  return {
    playerPosition: position,
    direction,
    isMoving,
    setPlayerPosition: setPosition,
    playerHitbox,
    clearMovement: clearAllKeys,
    ...(debugInfo && { debug: debugInfo })
  };
};