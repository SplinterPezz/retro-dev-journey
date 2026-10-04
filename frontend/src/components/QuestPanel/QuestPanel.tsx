import React, { useState } from 'react';
import './QuestPanel.css';

interface QuestPanelProps {
  title: React.ReactNode;
  headerExtra?: React.ReactNode;
  percentage?: number;
  collapsible?: boolean;
  toggleLabel: { show: string; hide: string };
  bodyMaxHeight: string;
  className?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const QuestPanel: React.FC<QuestPanelProps> = ({
  title,
  headerExtra,
  percentage,
  collapsible = true,
  toggleLabel,
  bodyMaxHeight,
  className = '',
  children,
  footer,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const open = collapsible && !isCollapsed;

  return (
    <div className={`daily-quest-container ${className}`}>
      <div className={`rpgui-container framed-grey ${open ? 'quest-collapsed-mobile' : ''}`}>
        <div className="quest-header">
          <div className="quest-header-content">
            <h4 className="quest-title">{title}</h4>
            {headerExtra}
            {collapsible && (
              <button
                type="button"
                className={`quest-toggle${open ? ' open' : ''}`}
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? toggleLabel.show : toggleLabel.hide}
                aria-expanded={open}
              >
                ▼
              </button>
            )}
          </div>

          {percentage !== undefined && (
            <div className="quest-progress-container">
              <div className="quest-progress-bar">
                <div className="quest-progress-fill" style={{ width: `${percentage}%` }} />
              </div>
              <span className="quest-progress-text">{Math.round(percentage)}%</span>
            </div>
          )}
        </div>

        {collapsible && (
          <div
            className={`quest-panel-body${open ? ' open' : ''}`}
            style={{ maxHeight: open ? bodyMaxHeight : 0, opacity: open ? 1 : 0 }}
          >
            {children}
          </div>
        )}
        {footer}
      </div>
    </div>
  );
};

export default QuestPanel;
