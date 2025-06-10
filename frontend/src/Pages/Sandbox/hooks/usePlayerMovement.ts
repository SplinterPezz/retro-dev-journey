import { useState, useEffect, useCallback, useRef } from 'react';
import { Position, Direction, PlayerMovementConfig, StructureData, Hitbox } from '../../../types/sandbox';
import { playerHitbox } from '../config';

interface PlayerMovementConfigExtended extends PlayerMovementConfig {
  structures?: StructureData[];
  playerHitbox?: Hitbox;
}

interface JoystickState {
  isActive: boolean;
  direction: Direction;
  intensity: number;
}

// Convert joystick coordinates to direction
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

const getDirectionFromJoystick = (x: number | null, y: number | null): Direction => {
  if (x === null || y === null) return 'idle';
  const deadZone = 0.2;
  if (Math.abs(x) < deadZone && Math.abs(y) < deadZone) return 'idle';
  const absX = Math.abs(x), absY = Math.abs(y);
  if (absX > deadZone && absY > deadZone) {
    if (x > 0 && y > 0) return 'up-right';
    if (x > 0 && y < 0) return 'down-right';
    if (x < 0 && y > 0) return 'up-left';
    if (x < 0 && y < 0) return 'down-left';
  }
  if (absX > absY) return x > 0 ? 'right' : 'left';
  return y > 0 ? 'up' : 'down';
};

const getJoystickIntensity = (x: number | null, y: number | null): number => {
  if (x === null || y === null) return 0;
  const dist = Math.sqrt(x * x + y * y);
  return Math.min(dist, 1);
};

const checkHitboxCollision = (
  pos1: Position, hitbox1: Hitbox,
  pos2: Position, hitbox2: Hitbox
): boolean => {
  const b1 = { x: pos1.x + hitbox1.x, y: pos1.y + hitbox1.y, width: hitbox1.width, height: hitbox1.height };
  const b2 = { x: pos2.x + hitbox2.x, y: pos2.y + hitbox2.y, width: hitbox2.width, height: hitbox2.height };
  return b1.x < b2.x + b2.width &&
         b1.x + b1.width > b2.x &&
         b1.y < b2.y + b2.height &&
         b1.y + b1.height > b2.y;
};

const checkStructureCollision = (
  newPos: Position,
  hitbox: Hitbox,
  structures?: StructureData[]
): boolean => {
  if (!structures) return false;
  return structures.some(s => {
    if (!s.data.collisionHitbox) return false;
    return checkHitboxCollision(newPos, hitbox, s.position, s.data.collisionHitbox);
  });
};

const calculateNewPosition = (
  currentPos: Position,
  dir: Direction,
  speed: number,
  intensity: number,
  worldBounds: any,
  hitbox: Hitbox,
  structures?: StructureData[]
): Position => {
  let nx = currentPos.x, ny = currentPos.y;
  const effSpeed = speed * intensity;
  const diag = effSpeed * Math.SQRT1_2;

  switch (dir) {
    case 'up': ny -= effSpeed; break;
    case 'down': ny += effSpeed; break;
    case 'left': nx -= effSpeed; break;
    case 'right': nx += effSpeed; break;
    case 'up-left': nx -= diag; ny -= diag; break;
    case 'up-right': nx += diag; ny -= diag; break;
    case 'down-left': nx -= diag; ny += diag; break;
    case 'down-right': nx += diag; ny += diag; break;
  }

  nx = Math.max(worldBounds.minX, Math.min(worldBounds.maxX, nx));
  ny = Math.max(worldBounds.minY, Math.min(worldBounds.maxY, ny));
  const newPos = { x: nx, y: ny };

  if (checkStructureCollision(newPos, hitbox, structures)) {
    const xPos = { x: nx, y: currentPos.y };
    if (!checkStructureCollision(xPos, hitbox, structures)) return xPos;
    const yPos = { x: currentPos.x, y: ny };
    if (!checkStructureCollision(yPos, hitbox, structures)) return yPos;
    return currentPos;
  }

  return (nx === currentPos.x && ny === currentPos.y) ? currentPos : newPos;
};

// Hook starts here
interface PlayerMovementConfigExtended extends PlayerMovementConfig {
  structures?: StructureData[];
  playerHitbox?: Hitbox;
}

interface JoystickState {
  isActive: boolean;
  direction: Direction;
  intensity: number;
}

export const usePlayerMovement = (config: PlayerMovementConfigExtended) => {
  const [position, setPosition] = useState(config.initialPosition);
  const [direction, setDirection] = useState<Direction>('idle');
  const [isMoving, setIsMoving] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [joystickState, setJoystickState] = useState<JoystickState>({
    isActive: false,
    direction: 'idle',
    intensity: 0,
  });

  const joystickRef = useRef<JoystickState>(joystickState);
  const isWindowFocusedRef = useRef(true);
  const rafRef = useRef<number | null>(null);

  const validKeys = ['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift',' '];
  
  const clearAllKeys = useCallback(() => setPressedKeys(new Set()), []);

  const handleJoystickMove = useCallback((e: any) => {
    const d = getDirectionFromJoystick(e.x, e.y);
    const i = getJoystickIntensity(e.x, e.y);
    const prev = joystickRef.current;

    if (prev.direction !== d || Math.abs(prev.intensity - i) > 0.05) {
      joystickRef.current = { isActive: true, direction: d, intensity: i };
      setJoystickState(joystickRef.current);
    }
  }, []);

  const handleJoystickStop = useCallback(() => {
    joystickRef.current = { isActive: false, direction: 'idle', intensity: 0 };
    setJoystickState(joystickRef.current);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (!validKeys.includes(k)) return;
    e.preventDefault();
    if (!isWindowFocusedRef.current || e.ctrlKey || e.altKey || e.metaKey) {
      clearAllKeys();
      return;
    }
    setPressedKeys(prev => {
      prev.add(k);
      return new Set(prev);
    });
  }, [clearAllKeys]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (!validKeys.includes(k)) return;
    setPressedKeys(prev => {
      prev.delete(k);
      return new Set(prev);
    });
  }, []);

  const handleBlur = useCallback(() => {
    isWindowFocusedRef.current = false;
    clearAllKeys();
  }, [clearAllKeys]);

  const handleFocus = useCallback(() => {
    isWindowFocusedRef.current = true;
  }, []);

  const handleVisibility = useCallback(() => {
    if (document.hidden) handleBlur();
    else handleFocus();
  }, [handleBlur, handleFocus]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!document.hasFocus()) clearAllKeys();
      }, 100);
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [handleKeyDown, handleKeyUp, handleBlur, handleFocus, handleVisibility, clearAllKeys]);

  useEffect(() => {
    const loop = () => {
      if (!isWindowFocusedRef.current && !joystickRef.current.isActive) {
        clearAllKeys();
        return;
      }

      const js = joystickRef.current;
      let dir: Direction, intensity: number, run: boolean;

      if (js.isActive && js.direction !== 'idle') {
        dir = js.direction;
        intensity = js.intensity;
        run = js.intensity > 0.7;
      } else {
        dir = getDirectionFromKeys(pressedKeys);
        intensity = dir !== 'idle' ? 1 : 0;
        run = pressedKeys.has('shift') || pressedKeys.has(' ');
      }

      const moving = dir !== 'idle';
      setDirection(dir);
      setIsMoving(moving);

      if (moving) {
        let speed = run ? config.speed * 1.5 : config.speed;
        setPosition(cur =>
          calculateNewPosition(
            cur, dir, speed, intensity,
            config.worldBounds,
            config.playerHitbox || playerHitbox,
            config.structures
          )
        );
      }

      

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pressedKeys, config, clearAllKeys]);

  useEffect(() => {
    const preventCtx = (e: Event) => e.preventDefault();
    window.addEventListener('contextmenu', preventCtx);
    return () => window.removeEventListener('contextmenu', preventCtx);
  }, []);

  return {
    playerPosition: position,
    direction,
    isMoving,
    setPlayerPosition: setPosition,
    playerHitbox: config.playerHitbox || playerHitbox,
    clearMovement: clearAllKeys,
    handleJoystickMove,
    handleJoystickStop
  };
};
