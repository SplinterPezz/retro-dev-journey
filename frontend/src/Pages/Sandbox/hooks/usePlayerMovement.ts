import { useState, useEffect, useCallback, useRef } from 'react';
import { Position, Direction, PlayerMovementConfig, StructureData, Hitbox } from '../../../types/sandbox';
import { playerHitbox } from '../config';

interface PlayerMovementConfigExtended extends PlayerMovementConfig {
  structures?: StructureData[];
  playerHitbox?: Hitbox;
}

// Detect if device has touch capabilities
const isTouchDevice = (): boolean => {
  return (('ontouchstart' in window) ||
          (navigator.maxTouchPoints > 0) ||
          // @ts-ignore
          (navigator.msMaxTouchPoints > 0));
};

const getDirectionFromKeys = (keys: Set<string>): Direction => {
  const up = keys.has('w') || keys.has('arrowup') || keys.has('mobile-up');
  const down = keys.has('s') || keys.has('arrowdown') || keys.has('mobile-down');
  const left = keys.has('a') || keys.has('arrowleft') || keys.has('mobile-left');
  const right = keys.has('d') || keys.has('arrowright') || keys.has('mobile-right');

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
  const [mobileControlsReady, setMobileControlsReady] = useState(false);
  
  // Refs to track focus and prevent stale closures
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const isWindowFocusedRef = useRef(true);
  
  const mobileObserverRef = useRef<MutationObserver | null>(null);
  const isTouch = useRef(isTouchDevice());
  
  // Valid movement keys (including mobile keys)
  const validKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift', ' '];
  const mobileKeys = ['mobile-up', 'mobile-down', 'mobile-left', 'mobile-right', 'mobile-run'];

  // Clear all keys - used when focus is lost or on certain events
  const clearAllKeys = useCallback(() => {
    setPressedKeys(new Set());
  }, []);

  // Mobile key management
  const handleMobileKeyPress = useCallback((mobileKey: string) => {
    setPressedKeys(prev => new Set([...prev, mobileKey]));
  }, []);

  const handleMobileKeyRelease = useCallback((mobileKey: string) => {
    setPressedKeys(prev => {
      const newKeys = new Set(prev);
      newKeys.delete(mobileKey);
      return newKeys;
    });
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

  // Check if all required mobile elements are present
  const checkMobileElementsReady = useCallback((): boolean => {
    const requiredClasses = [
      'mobile-key-up',
      'mobile-key-down', 
      'mobile-key-left',
      'mobile-key-right',
      'mobile-run-button'
    ];

    return requiredClasses.every(className => {
      const element = document.querySelector(`.${className}`) as HTMLElement;
      return element && element.offsetParent !== null; // Element exists and is visible
    });
  }, []);

  // Setup mobile touch controls with intelligent waiting
  useEffect(() => {
    // If not a touch device, skip mobile setup and mark as ready
    if (!isTouch.current) {
      setMobileControlsReady(true);
      return;
    }

    const setupMobileControl = (className: string, mobileKey: string): (() => void) | null => {
      const element = document.querySelector(`.${className}`) as HTMLElement;
      if (!element) return null;

      // Touch events for mobile
      const handleTouchStart = (e: Event) => {
        e.preventDefault();
        handleMobileKeyPress(mobileKey);
      };

      const handleTouchEnd = (e: Event) => {
        e.preventDefault();
        handleMobileKeyRelease(mobileKey);
      };

      // Mouse events for desktop testing
      const handleMouseDown = (e: Event) => {
        e.preventDefault();
        handleMobileKeyPress(mobileKey);
      };

      const handleMouseUp = (e: Event) => {
        e.preventDefault();
        handleMobileKeyRelease(mobileKey);
      };

      const handleContextMenu = (e: Event) => {
        e.preventDefault();
      };

      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchend', handleTouchEnd, { passive: false });
      element.addEventListener('touchcancel', handleTouchEnd, { passive: false });
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mouseup', handleMouseUp);
      element.addEventListener('mouseleave', handleMouseUp);
      element.addEventListener('contextmenu', handleContextMenu);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('touchcancel', handleTouchEnd);
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('mouseup', handleMouseUp);
        element.removeEventListener('mouseleave', handleMouseUp);
        element.removeEventListener('contextmenu', handleContextMenu);
      };
    };

    const initializeMobileControls = (): (() => void)[] => {
      const cleanupFunctions = [
        setupMobileControl('mobile-key-up', 'mobile-up'),
        setupMobileControl('mobile-key-down', 'mobile-down'),
        setupMobileControl('mobile-key-left', 'mobile-left'),
        setupMobileControl('mobile-key-right', 'mobile-right'),
        setupMobileControl('mobile-run-button', 'mobile-run'),
      ].filter((cleanup): cleanup is (() => void) => cleanup !== null);

      if (cleanupFunctions.length === 5) {
        setMobileControlsReady(true);
        if (process.env.REACT_APP_ENV === 'development') {
          console.log('🎮 Mobile controls initialized successfully');
        }
      }

      return cleanupFunctions;
    };

    // Try immediate initialization
    if (checkMobileElementsReady()) {
      const cleanupFunctions = initializeMobileControls();
      return () => {
        cleanupFunctions.forEach(cleanup => cleanup());
      };
    }

    // If elements not ready, set up a MutationObserver to wait for them
    let cleanupFunctions: (() => void)[] = [];
    let retryCount = 0;
    const maxRetries = 50; // 5 seconds max wait

    const retryInitialization = () => {
      retryCount++;
      
      if (checkMobileElementsReady()) {
        cleanupFunctions = initializeMobileControls();
        if (mobileObserverRef.current) {
          mobileObserverRef.current.disconnect();
          mobileObserverRef.current = null;
        }
      } else if (retryCount < maxRetries) {
        // Continue waiting
        setTimeout(retryInitialization, 100);
      } else {
        // Timeout - proceed without mobile controls
        if (process.env.REACT_APP_ENV === 'development') {
          console.warn('⚠️ Mobile controls initialization timeout');
        }
        setMobileControlsReady(true);
      }
    };

    // Set up MutationObserver to watch for DOM changes
    mobileObserverRef.current = new MutationObserver(() => {
      if (checkMobileElementsReady()) {
        cleanupFunctions = initializeMobileControls();
        if (mobileObserverRef.current) {
          mobileObserverRef.current.disconnect();
          mobileObserverRef.current = null;
        }
      }
    });

    // Start observing
    mobileObserverRef.current.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also start the retry timer
    setTimeout(retryInitialization, 100);

    return () => {
      if (mobileObserverRef.current) {
        mobileObserverRef.current.disconnect();
        mobileObserverRef.current = null;
      }
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [handleMobileKeyPress, handleMobileKeyRelease, checkMobileElementsReady]);

  // Movement loop
  useEffect(() => {
    // Don't start game loop until mobile controls are ready (if on touch device)
    if (isTouch.current && !mobileControlsReady) {
      return;
    }

    const gameLoop = () => {
      // Don't process movement if window is not focused (except for mobile controls)
      if (!isWindowFocusedRef.current) {
        setPressedKeys(prev => {
          const newKeys = new Set(prev);
          validKeys.forEach(key => newKeys.delete(key)); // Keep mobile keys
          return newKeys;
        });
        
        // If no mobile keys are pressed, don't process movement
        const hasMobileKeys = Array.from(pressedKeys).some(key => mobileKeys.includes(key));
        if (!hasMobileKeys) return;
      }

      const currentDirection = getDirectionFromKeys(pressedKeys);
      const moving = currentDirection !== 'idle';
      const isRunning = pressedKeys.has('shift') || pressedKeys.has(' ') || pressedKeys.has('mobile-run');
      
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
  }, [pressedKeys, config.speed, config.worldBounds, config.structures, clearAllKeys, mobileControlsReady]);

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
    
    const handleMouseLeave = () => {
      // Small delay to avoid clearing keys during normal gameplay
      setTimeout(() => {
        if (!document.hasFocus()) {
          // Only clear keyboard keys, not mobile keys
          setPressedKeys(prev => {
            const newKeys = new Set(prev);
            validKeys.forEach(key => newKeys.delete(key));
            return newKeys;
          });
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
    isMoving,
    mobileKeysActive: Array.from(pressedKeys).filter(key => mobileKeys.includes(key)),
    isRunning: pressedKeys.has('shift') || pressedKeys.has(' ') || pressedKeys.has('mobile-run'),
    isTouchDevice: isTouch.current,
    mobileControlsReady
  } : undefined;

  return {
    playerPosition: position,
    direction,
    isMoving,
    setPlayerPosition: setPosition,
    playerHitbox,
    clearMovement: clearAllKeys,
    // Status info
    mobileControlsReady,
    isTouchDevice: isTouch.current,
    ...(debugInfo && { debug: debugInfo })
  };
};