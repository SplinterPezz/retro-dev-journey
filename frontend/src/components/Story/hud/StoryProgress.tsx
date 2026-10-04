import React, { useMemo } from 'react';
import QuestPanel from '../../QuestPanel/QuestPanel';
import './StoryProgress.css';

export interface StoryObjective {
  id: string;
  label: string;
  done: boolean;
  locked?: boolean; // not available yet (a later chapter)
}

interface StoryProgressProps {
  objectives: StoryObjective[];
  name?: string; // what the list is: the panel title and its toggle say it
}

// A list of objectives (a chapter's, or the chapters of the story), in the
// same panel as the Sandbox daily quests.
const StoryProgress: React.FC<StoryProgressProps> = ({ objectives, name = 'Objectives' }) => {
  const doneCount = objectives.filter((o) => o.done).length;
  const percentage = objectives.length ? (doneCount / objectives.length) * 100 : 0;
  const toggleLabel = useMemo(() => ({ show: `Show ${name.toLowerCase()}`, hide: `Hide ${name.toLowerCase()}` }), [name]);

  return (
    <QuestPanel
      title={`${name} (${doneCount}/${objectives.length})`}
      percentage={percentage}
      toggleLabel={toggleLabel}
      bodyMaxHeight="60vh"
    >
      <div className="story-progress-list">
        {objectives.map((o) => (
          <div key={o.id} className={`story-progress-item${o.done ? ' done' : ''}${o.locked ? ' locked' : ''}`}>
            <span className={`quest-status ${o.done ? 'done' : 'todo'}`}>{o.done ? '✓' : o.locked ? '🔒' : '○'}</span>
            <span className="quest-name">{o.label}</span>
          </div>
        ))}
      </div>
    </QuestPanel>
  );
};

export default React.memo(StoryProgress);
