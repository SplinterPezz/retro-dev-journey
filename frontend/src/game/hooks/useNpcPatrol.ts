import { useEffect, useRef, useState } from 'react';
import { Position, Hitbox } from '../../types/game';
import { NpcDirection, StoryNpcData, StoryPropData } from '../../types/story';
import { hitsAny } from '../collision';

// Feet box of an NPC, relative to its position (the sprite is 128px centred
// on `position`, so the feet sit in the lower middle).
const NPC_HITBOX: Hitbox = { x: -16, y: 36, width: 32, height: 16 };

export interface NpcPatrolState {
  position: Position;
  moving: boolean;
  direction: NpcDirection;
}

const hitsProp = (pos: Position, props: StoryPropData[]) => hitsAny(pos, NPC_HITBOX, props);

// Dominant axis of a step decides which walk sprite to show.
const directionOf = (dx: number, dy: number, previous: NpcDirection): NpcDirection => {
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return previous;
  if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? 'W' : 'E';
  return dy < 0 ? 'N' : 'S';
};

interface Walker {
  position: Position;
  target: number; // index into waypoints
  direction: 1 | -1; // ping-pong direction through the waypoint list
  pausedUntil: number; // performance.now() timestamp, 0 = moving
  facing: NpcDirection;
}

// Moves every patrolling NPC along its waypoints. Each walker is advanced in
// the same animation frame, skips frames while paused (dialogue open with it,
// or a pause at a waypoint), and refuses any step that would overlap a prop's
// collision box - in that case it stops and turns around rather than walking
// over a table.
export const useNpcPatrol = (
  npcs: StoryNpcData[],
  props: StoryPropData[],
  pausedNpcId: string | null
): Record<string, NpcPatrolState> => {
  const walkersRef = useRef<Record<string, Walker>>({});
  const [states, setStates] = useState<Record<string, NpcPatrolState>>(() =>
    Object.fromEntries(npcs.map((n) => [n.id, { position: n.position, moving: false, direction: 'S' as NpcDirection }]))
  );
  const pausedRef = useRef(pausedNpcId);
  pausedRef.current = pausedNpcId;
  const propsRef = useRef(props);
  propsRef.current = props;
  const lastSnapshotRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const walkers: Record<string, Walker> = {};
    npcs.forEach((n) => {
      if (!n.patrol || n.patrol.waypoints.length < 2) return;
      walkers[n.id] = {
        position: { ...n.patrol.waypoints[0] },
        target: 1,
        direction: 1,
        pausedUntil: 0,
        facing: 'S',
      };
    });
    walkersRef.current = walkers;
    // Nobody patrols in this scene: no animation loop at all.
    if (Object.keys(walkers).length === 0) return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      const next: Record<string, NpcPatrolState> = {};
      let changed = false;

      npcs.forEach((n) => {
        const walker = walkersRef.current[n.id];
        if (!n.patrol || !walker) return;
        const { waypoints, speed, pauseMs } = n.patrol;
        const isPaused = pausedRef.current === n.id || now < walker.pausedUntil;
        let moving = false;

        if (!isPaused) {
          const goal = waypoints[walker.target];
          const dx = goal.x - walker.position.x;
          const dy = goal.y - walker.position.y;
          const dist = Math.hypot(dx, dy);
          const step = speed * dt;

          if (dist <= step) {
            walker.position = { ...goal };
            walker.pausedUntil = now + pauseMs;
            const atEnd = walker.target + walker.direction < 0 || walker.target + walker.direction >= waypoints.length;
            if (atEnd) walker.direction = (walker.direction * -1) as 1 | -1;
            walker.target += walker.direction;
          } else {
            const candidate = {
              x: walker.position.x + (dx / dist) * step,
              y: walker.position.y + (dy / dist) * step,
            };
            if (hitsProp(candidate, propsRef.current)) {
              // Blocked: turn around and wait, never walk through furniture.
              walker.direction = (walker.direction * -1) as 1 | -1;
              walker.target = Math.min(Math.max(walker.target + walker.direction, 0), waypoints.length - 1);
              walker.pausedUntil = now + pauseMs;
            } else {
              walker.facing = directionOf(dx, dy, walker.facing);
              walker.position = candidate;
              moving = true;
            }
          }
        }

        // Only NPCs that changed get a new state object, so the others keep
        // their identity and their components skip the render.
        const snapshot = `${walker.position.x.toFixed(1)},${walker.position.y.toFixed(1)},${moving},${walker.facing}`;
        if (lastSnapshotRef.current[n.id] !== snapshot) {
          lastSnapshotRef.current[n.id] = snapshot;
          changed = true;
          next[n.id] = { position: { ...walker.position }, moving, direction: walker.facing };
        }
      });

      if (changed) setStates((old) => ({ ...old, ...next }));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [npcs]);

  return states;
};
