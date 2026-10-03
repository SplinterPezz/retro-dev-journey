import React, { useState } from 'react';
import { ToggleButton } from '../DailyQuest/DailyQuestComponent';
import './StoryProgress.css';

export interface StoryObjective {
  id: string;
  label: string;
  done: boolean;
}

interface StoryProgressProps {
  objectives: StoryObjective[];
}

// Same visual language and collapsible behaviour as DailyQuestComponent (Sandbox) -
// shares its header, toggle and animated container - but scoped to a single
// chapter's hand-picked objectives instead of every company/technology.
const StoryProgress: React.FC<StoryProgressProps> = ({ objectives }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const doneCount = objectives.filter((o) => o.done).length;
  const percentage = objectives.length ? (doneCount / objectives.length) * 100 : 0;

  return (
    <div className="daily-quest-container">
      <div className={`rpgui-container framed-grey ${!isCollapsed ? 'quest-collapsed-mobile' : ''}`}>
        <div className="quest-header">
          <div className="quest-header-content">
            <h4 className="quest-title">Objectives ({doneCount}/{objectives.length})</h4>
            <ToggleButton
              isCollapsed={isCollapsed}
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Show objectives' : 'Hide objectives'}
            >
              ▼
            </ToggleButton>
          </div>

          <div className="quest-progress-container">
            <div className="quest-progress-bar">
              <div className="quest-progress-fill" style={{ width: `${percentage}%` }} />
            </div>
            <span className="quest-progress-text">{Math.round(percentage)}%</span>
          </div>
        </div>

        {/* A CSS transition, not the keyframe animation the Sandbox uses: a keyframe
            left at its end state after another popup could keep the list hidden. */}
        <div
          className="story-progress-collapsible"
          style={{ maxHeight: isCollapsed ? 0 : '60vh', opacity: isCollapsed ? 0 : 1 }}
        >
          <div className="story-progress-list">
            {objectives.map((o) => (
              <div key={o.id} className={`story-progress-item${o.done ? ' done' : ''}`}>
                <span className={`quest-status ${o.done ? 'done' : 'todo'}`}>{o.done ? '✓' : '○'}</span>
                <span className="quest-name">{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryProgress;
