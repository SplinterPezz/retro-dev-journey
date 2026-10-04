import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { setZoom } from '../../store/zoomSlice';
import { useZoomLevel, ZOOM_LEVEL_COUNT } from '../../game/zoom';
import './pixel-button.css';
import './ZoomSlider.css';
import './pixel-button.css';

// px, kept in sync with ZoomSlider.css
const TICK_TOP = 8;
const TICK_GAP = 32;
const TRACK_HEIGHT = TICK_TOP * 2 + TICK_GAP * (ZOOM_LEVEL_COUNT - 1);

const ZoomSlider: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const level = useZoomLevel();
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const levelFromY = (clientY: number): number => {
    const rect = trackRef.current!.getBoundingClientRect();
    const index = Math.round((clientY - rect.top - TICK_TOP) / TICK_GAP);
    const clamped = Math.min(ZOOM_LEVEL_COUNT - 1, Math.max(0, index));
    return ZOOM_LEVEL_COUNT - clamped;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    dispatch(setZoom(levelFromY(event.clientY)));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) {
      dispatch(setZoom(levelFromY(event.clientY)));
    }
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const thumbY = TICK_TOP + (ZOOM_LEVEL_COUNT - level) * TICK_GAP;

  return (
    <div className="zoom-slider">
      <button
        type="button"
        className="zoom-slider-button pixel-button"
        disabled={level === ZOOM_LEVEL_COUNT}
        onClick={() => dispatch(setZoom(level + 1))}
        aria-label="Zoom in"
      >
        +
      </button>

      <div
        ref={trackRef}
        className="zoom-slider-track"
        style={{ height: TRACK_HEIGHT }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="zoom-slider-line" style={{ top: TICK_TOP, height: TICK_GAP * (ZOOM_LEVEL_COUNT - 1) }} />
        {Array.from({ length: ZOOM_LEVEL_COUNT }, (_, index) => (
          <div key={index} className="zoom-slider-tick" style={{ top: TICK_TOP + index * TICK_GAP - 1 }} />
        ))}
        <div className="zoom-slider-thumb" style={{ top: thumbY - 8 }} />
      </div>

      <button
        type="button"
        className="zoom-slider-button pixel-button"
        disabled={level === 1}
        onClick={() => dispatch(setZoom(level - 1))}
        aria-label="Zoom out"
      >
        -
      </button>
    </div>
  );
};

export default ZoomSlider;
