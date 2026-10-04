import React from 'react';
import { isDev } from '../config/env';
import './DebugOverlay.css';

export interface DebugAction {
  label: string;
  onClick: () => void;
  tone?: 'danger' | 'warning' | 'success';
}

interface DebugToolbarProps {
  actions: DebugAction[];
}

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
