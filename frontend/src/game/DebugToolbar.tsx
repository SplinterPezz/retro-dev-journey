import React from 'react';
import { isDev } from '../config/env';
import './DebugOverlay.css';

export interface DebugAction {
  label: string;
  onClick: () => void;
  tone?: 'danger' | 'warning' | 'success'; // red (default), orange, green
}

interface DebugToolbarProps {
  actions: DebugAction[];
}

// The development-only buttons in the bottom-left corner (reset the story,
// skip a chapter...). Each page lists the ones it needs; they stack by
// themselves, first one at the top. Renders nothing in production.
const DebugToolbar: React.FC<DebugToolbarProps> = ({ actions }) => {
  if (!isDev || actions.length === 0) return null;
  return (
    <div className="debug-toolbar">
      {actions.map((action) => (
        <button key={action.label} type="button" className={`debug-toolbar-button debug-toolbar-${action.tone ?? 'danger'}`} onClick={action.onClick}>
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default DebugToolbar;
