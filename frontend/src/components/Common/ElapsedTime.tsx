import React from 'react';
import { Clock } from 'lucide-react';
import { formatElapsed } from '../../game/elapsed';
import './ElapsedTime.css';

const ICON_SIZE = 14;

// How long after the start of the story something was unlocked; nothing when that is unknown.
const ElapsedTime: React.FC<{ ms?: number; className?: string }> = ({ ms, className }) => {
  if (ms === undefined) return null;
  return (
    <span className={`elapsed-time${className ? ` ${className}` : ''}`}>
      {formatElapsed(ms)}
      <Clock size={ICON_SIZE} aria-hidden="true" />
    </span>
  );
};

export default ElapsedTime;
