import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { collectionTexts } from '../../config/menu';
import RarityBadge from '../Common/RarityBadge';
import { CollectionEntry } from './useCollections';
import './ItemInspector.css';

// The thickness is the same picture stacked in layers, the inner ones darker, like a cardboard cut-out.
const LAYER_COUNT = 12;
const LAYER_GAP_PX = 1.5;
const EDGE_BRIGHTNESS = 0.55;
const MAX_TILT_DEG = 60;
const DRAG_DEG_PER_PX = 0.6;
const IDLE_SPIN_DEG_PER_S = 30;
const FRICTION_PER_FRAME = 0.93;
const MIN_SPIN_DEG = 0.02;
const FRAME_MS = 1000 / 60;

interface ItemInspectorProps {
  entry: CollectionEntry;
  onClose: () => void;
}

const clampTilt = (deg: number) => Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, deg));

const isFace = (index: number) => index === 0 || index === LAYER_COUNT - 1;

const layerStyle = (index: number): React.CSSProperties => ({
  transform: `translateZ(${(index - (LAYER_COUNT - 1) / 2) * LAYER_GAP_PX}px)`,
  filter: isFace(index) ? undefined : `brightness(${EDGE_BRIGHTNESS})`,
});

const ItemInspector: React.FC<ItemInspectorProps> = ({ entry, onClose }) => {
  const objectRef = useRef<HTMLDivElement | null>(null);
  const motion = useRef({ x: 0, y: 0, vx: 0, vy: 0, dragging: false, idle: true, lastX: 0, lastY: 0 });

  useEffect(() => {
    const idleSpin = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const m = motion.current;
      const frames = (now - last) / FRAME_MS;
      last = now;
      if (!m.dragging) {
        if (m.idle) {
          if (idleSpin) m.y += (IDLE_SPIN_DEG_PER_S * frames) / 60;
        } else if (Math.abs(m.vx) > MIN_SPIN_DEG || Math.abs(m.vy) > MIN_SPIN_DEG) {
          m.x = clampTilt(m.x + m.vx * frames);
          m.y += m.vy * frames;
          const decay = FRICTION_PER_FRAME ** frames;
          m.vx *= decay;
          m.vy *= decay;
        }
      }
      if (objectRef.current) objectRef.current.style.transform = `rotateX(${m.x}deg) rotateY(${m.y}deg)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    Object.assign(motion.current, { dragging: true, idle: false, vx: 0, vy: 0, lastX: e.clientX, lastY: e.clientY });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    if (!m.dragging) return;
    const vy = (e.clientX - m.lastX) * DRAG_DEG_PER_PX;
    const vx = -(e.clientY - m.lastY) * DRAG_DEG_PER_PX;
    Object.assign(m, { x: clampTilt(m.x + vx), y: m.y + vy, vx, vy, lastX: e.clientX, lastY: e.clientY });
  };

  const onPointerUp = () => {
    motion.current.dragging = false;
  };

  return createPortal(
    <div
      className={`rpgui-content item-inspector rarity--${entry.rarity}`}
      role="dialog"
      aria-label={entry.name}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button type="button" className="rpgui-button item-inspector-close" onClick={onClose} aria-label={collectionTexts.close}>
        <X size={20} color="white" strokeWidth={3} className="volume-filter" />
      </button>

      <RarityBadge rarity={entry.rarity} />

      <div
        className="item-inspector-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="item-inspector-object" ref={objectRef}>
          {Array.from({ length: LAYER_COUNT }, (_, i) => (
            <img
              key={i}
              src={entry.image}
              alt=""
              draggable={false}
              className={`item-inspector-layer${isFace(i) ? ' item-inspector-layer--face' : ''}`}
              style={layerStyle(i)}
            />
          ))}
        </div>
      </div>

      <div className="item-inspector-info">
        <h3 className="item-inspector-name">{entry.name}</h3>
        <div className="item-inspector-description">{entry.description}</div>
        <div className="item-inspector-hint">{collectionTexts.dragHint}</div>
      </div>
    </div>,
    document.body
  );
};

export default ItemInspector;
