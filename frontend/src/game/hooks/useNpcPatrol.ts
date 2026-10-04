import { useEffect, useRef, useState } from 'react';
import { Position, Hitbox } from '../../types/game';
import { NpcDirection, StoryNpcData, StoryPropData } from '../../types/story';
import { hitsAny } from '../collision';

const NPC_HITBOX: Hitbox = { x: -16, y: 36, width: 32, height: 16 };

export interface NpcPatrolState {
  position: Position;
  moving: boolean;
  direction: NpcDirection;
}

const hitsProp = (pos: Position, props: StoryPropData[]) => hitsAny(pos, NPC_HITBOX, props);

const directionOf = (dx: number, dy: number, previous: NpcDirection): NpcDirection => {
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return previous;
  if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? 'W' : 'E';
  return dy < 0 ? 'N' : 'S';
};

interface Walker {
  position: Position;
  target: number;
  direction: 1 | -1;
  pausedUntil: number;
  facing: NpcDirection;
}

type Patrol = NonNullable<StoryNpcData['patrol']>;

const turnAround = (walker: Walker) => {
  walker.direction = (walker.direction * -1) as 1 | -1;
};

const isLastWaypoint = (walker: Walker, waypoints: Position[]) => {
  const next = walker.target + walker.direction;
  return next < 0 || next >= waypoints.length;
};

const stepWalker = (walker: Walker, patrol: Patrol, step: number, now: number, props: StoryPropData[]): boolean => {
  const goal = patrol.waypoints[walker.target];
  const dx = goal.x - walker.position.x;
  const dy = goal.y - walker.position.y;
  const dist = Math.hypot(dx, dy);

  if (dist <= step) {
    walker.position = { ...goal };
    walker.pausedUntil = now + patrol.pauseMs;
    if (isLastWaypoint(walker, patrol.waypoints)) turnAround(walker);
    walker.target += walker.direction;
    return false;
  }

  const candidate = { x: walker.position.x + (dx / dist) * step, y: walker.position.y + (dy / dist) * step };
  if (hitsProp(candidate, props)) {
    turnAround(walker);
    walker.target = Math.min(Math.max(walker.target + walker.direction, 0), patrol.waypoints.length - 1);
    walker.pausedUntil = now + patrol.pauseMs;
    return false;
  }

  walker.facing = directionOf(dx, dy, walker.facing);
  walker.position = candidate;
  return true;
};

const startWalker = (patrol: Patrol): Walker => ({
  position: { ...patrol.waypoints[0] },
  target: 1,
  direction: 1,
  pausedUntil: 0,
  facing: 'S',
});

// Walkers live in refs (they change every frame); React state only gets the NPCs that changed.
export const useNpcPatrol = (
  npcs: StoryNpcData[],
  props: StoryPropData[],
  pausedNpcId: string | null
): Record<string, NpcPatrolState> => {
  const walkersRef = useRef<Record<string, Walker>>({});
  const [states, setStates] = useState<Record<string, NpcPatrolState>>(() =>
    Object.fromEntries(npcs.map((n) => [n.id, { position: n.position, moving: false, direction: 'S' as NpcDirection }]))
  );
  // the loop starts once per scene and reads the latest arguments through refs
  const pausedRef = useRef(pausedNpcId);
  pausedRef.current = pausedNpcId;
  const propsRef = useRef(props);
  propsRef.current = props;
  const lastSnapshotRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const walkers: Record<string, Walker> = {};
    npcs.forEach((n) => {
      if (n.patrol && n.patrol.waypoints.length >= 2) walkers[n.id] = startWalker(n.patrol);
    });
    walkersRef.current = walkers;
    if (Object.keys(walkers).length === 0) return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      const changedStates: Record<string, NpcPatrolState> = {};

      npcs.forEach((n) => {
        const walker = walkersRef.current[n.id];
        if (!n.patrol || !walker) return;
        const isPaused = pausedRef.current === n.id || now < walker.pausedUntil;
        const moving = !isPaused && stepWalker(walker, n.patrol, n.patrol.speed * dt, now, propsRef.current);

        const snapshot = `${walker.position.x.toFixed(1)},${walker.position.y.toFixed(1)},${moving},${walker.facing}`;
        if (lastSnapshotRef.current[n.id] !== snapshot) {
          lastSnapshotRef.current[n.id] = snapshot;
          changedStates[n.id] = { position: { ...walker.position }, moving, direction: walker.facing };
        }
      });

      if (Object.keys(changedStates).length > 0) setStates((old) => ({ ...old, ...changedStates }));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [npcs]);

  return states;
};
