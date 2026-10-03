import React from 'react';
import QuestPanel from '../../QuestPanel/QuestPanel';
import './StoryProgress.css';

export interface StoryObjective {
  id: string;
  label: string;
  done: boolean;
}

interface StoryProgressProps {
  objectives: StoryObjective[];
}

const toggleLabel = { show: 'Show objectives', hide: 'Hide objectives' };

// The chapter's hand-picked objectives, in the same panel as the Sandbox
// daily quests.
const StoryProgress: React.FC<StoryProgressProps> = ({ objectives }) => {
  const doneCount = objectives.filter((o) => o.done).length;
  const percentage = objectives.length ? (doneCount / objectives.length) * 100 : 0;

  return (
    <QuestPanel
      title={`Objectives (${doneCount}/${objectives.length})`}
      percentage={percentage}
      toggleLabel={toggleLabel}
      bodyMaxHeight="60vh"
    >
      <div className="story-progress-list">
        {objectives.map((o) => (
          <div key={o.id} className={`story-progress-item${o.done ? ' done' : ''}`}>
            <span className={`quest-status ${o.done ? 'done' : 'todo'}`}>{o.done ? '✓' : '○'}</span>
            <span className="quest-name">{o.label}</span>
          </div>
        ))}
      </div>
    </QuestPanel>
  );
};

export default React.memo(StoryProgress);
