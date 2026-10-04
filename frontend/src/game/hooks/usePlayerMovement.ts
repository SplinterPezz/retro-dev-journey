import { useState, useEffect, useCallback, useRef } from 'react';
import { Position, Direction, CollidableEntity, EnvironmentData, Hitbox, WorldBounds } from '../../types/game';
import { playerHitbox as defaultPlayerHitbox } from '../../config/world';
import { Blocker, hitsAny, toBlockers } from '../collision';
import { getDirectionFromJoystick, getDirectionFromKeys, getJoystickIntensity, stepPosition } from '../movement';
import type { JoystickMoveEvent } from '../../components/Common/MobileJoystick';

const validKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift', ' '];

export interface PlayerMovementConfig {
  initialPosition: Position;
  speed: number;
  worldBounds: WorldBounds;
  structures?: readonly CollidableEntity[];
  environments?: readonly EnvironmentData[];
  playerHitbox?: Hitbox;
  canMove?: boolean;
  // Optional walkable areas: the player's position must stay inside one of
  // them (e.g. the room plus a secret path outside its walls). worldBounds
  // still clamps, so it should cover them all.
  areas?: readonly WorldBounds[];
}

interface JoystickState {
  isActive: boolean;
  direction: Direction;
  intensity: number;
}

const IDLE_JOYSTICK: JoystickState = { isActive: false, direction: 'idle', intensity: 0 };

// Typing into a field or the code editor is not movement.
const isTextTarget = (target: EventTarget | null): boolean => {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || !!el.closest?.('input, textarea, .cm-editor'));
};

const insideAny = (p: Position, areas: readonly WorldBounds[]): boolean =>
  areas.some((a) => p.x >= a.minX && p.x <= a.maxX && p.y >= a.minY && p.y <= a.maxY);

// Moves the player with the keyboard or the touch joystick.
//
// The animation loop is started once and reads everything it needs from refs
// (config, pressed keys, joystick), so a render never restarts it. Position is
// pushed to React state only when it actually changes, and direction/moving
// only on a change, so standing still costs no renders at all.
export const usePlayerMovement = (config: PlayerMovementConfig) => {
  const [position, setPosition] = useState(config.initialPosition);
  const [direction, setDirection] = useState<Direction>('idle');
  const [isMoving, setIsMoving] = useState(false);

  const configRef = useRef(config);
  configRef.current = config;

  // Blockers are rebuilt only when the caller passes new arrays.
  const blockersRef = useRef<{ structures?: readonly CollidableEntity[]; environments?: readonly EnvironmentData[]; list: Blocker[] }>({
    list: [],
  });
  if (blockersRef.current.structures !== config.structures || blockersRef.current.environments !== config.environments) {
    blockersRef.current = {
      structures: config.structures,
      environments: config.environments,
      list: toBlockers(config.structures, config.environments),
    };
  }

  const positionRef = useRef(config.initialPosition);
  const directionRef = useRef<Direction>('idle');
  const isMovingRef = useRef(false);
  const keysRef = useRef<Set<string>>(new Set());
  const joystickRef = useRef<JoystickState>(IDLE_JOYSTICK);
  const isWindowFocusedRef = useRef(true);

  const handleJoystickMove = useCallback((e: JoystickMoveEvent) => {
    if (configRef.current.canMove === false) return;
    const x = e.x ?? null;
    const y = e.y ?? null;
    const d = getDirectionFromJoystick(x, y);
    const i = getJoystickIntensity(x, y);
    const prev = joystickRef.current;
    if (prev.direction !== d || Math.abs(prev.intensity - i) > 0.05) {
      joystickRef.current = { isActive: true, direction: d, intensity: i };
    }
  }, []);

  // Puts the player somewhere else at once (a cutscene seat), standing still.
  const teleport = useCallback((to: Position) => {
    keysRef.current.clear();
    joystickRef.current = IDLE_JOYSTICK;
    positionRef.current = to;
    setPosition(to);
    directionRef.current = 'idle';
    setDirection('idle');
    isMovingRef.current = false;
    setIsMoving(false);
  }, []);

  const handleJoystickStop = useCallback(() => {
    joystickRef.current = IDLE_JOYSTICK;
  }, []);

  useEffect(() => {
    const clearKeys = () => keysRef.current.clear();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTextTarget(e.target)) return;
      const k = e.key.toLowerCase();
      if (!validKeys.includes(k)) return;
      e.preventDefault();
      if (configRef.current.canMove === false) return;
      if (!isWindowFocusedRef.current || e.ctrlKey || e.altKey || e.metaKey) {
        clearKeys();
        return;
      }
      keysRef.current.add(k);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    const handleBlur = () => {
      isWindowFocusedRef.current = false;
      clearKeys();
    };

    const handleFocus = () => {
      isWindowFocusedRef.current = true;
    };

    const handleVisibility = () => (document.hidden ? handleBlur() : handleFocus());

    let mouseLeaveTimer: ReturnType<typeof setTimeout> | undefined;
    const handleMouseLeave = () => {
      clearTimeout(mouseLeaveTimer);
      mouseLeaveTimer = setTimeout(() => {
        if (!document.hasFocus()) clearKeys();
      }, 100);
    };

    // A long press on a phone would open the context menu over the game;
    // fields and the code editor keep theirs.
    const handleContextMenu = (e: Event) => {
      if (!isTextTarget(e.target)) e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(mouseLeaveTimer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastTime = 0;

    const setMoving = (moving: boolean) => {
      if (isMovingRef.current === moving) return;
      isMovingRef.current = moving;
      setIsMoving(moving);
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const cfg = configRef.current;
      const keys = keysRef.current;

      // Unfocused window: drop held keys (keyup never arrives) but keep the
      // joystick, which is touch-driven.
      if (!isWindowFocusedRef.current && !joystickRef.current.isActive) {
        keys.clear();
      }

      // canMove only gates new keydowns; a key already held when it flips to
      // false (a quiz opening mid-step) must stop the player right away.
      if (cfg.canMove === false) {
        keys.clear();
        joystickRef.current = IDLE_JOYSTICK;
        setMoving(false);
        lastTime = now;
        return;
      }

      // First frame assumes 60fps; a long gap is capped at 30fps worth of travel.
      const deltaTime = lastTime === 0 ? 1 / 60 : Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;

      const js = joystickRef.current;
      const useJoystick = js.isActive && js.direction !== 'idle';
      const dir = useJoystick ? js.direction : getDirectionFromKeys(keys);
      const moving = dir !== 'idle';

      // Keep facing the last real direction at rest instead of snapping back
      // to a frontal pose.
      if (moving && directionRef.current !== dir) {
        directionRef.current = dir;
        setDirection(dir);
      }
      setMoving(moving);
      if (!moving) return;

      const run = useJoystick ? js.intensity > 0.7 : keys.has('shift') || keys.has(' ');
      let speed = run ? cfg.speed * 1.5 : cfg.speed;
      if (useJoystick) speed /= 1.5;
      const intensity = useJoystick ? js.intensity : 1;

      const hitbox = cfg.playerHitbox || defaultPlayerHitbox;
      const blockers = blockersRef.current.list;
      const next = stepPosition(
        positionRef.current,
        dir,
        speed * intensity * deltaTime,
        cfg.worldBounds,
        (p) => hitsAny(p, hitbox, blockers) || (!!cfg.areas && !insideAny(p, cfg.areas))
      );
      if (next !== positionRef.current) {
        positionRef.current = next;
        setPosition(next);
      }
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  return {
    playerPosition: position,
    direction,
    isMoving,
    playerHitbox: config.playerHitbox || defaultPlayerHitbox,
    handleJoystickMove,
    handleJoystickStop,
    teleport,
  };
};
