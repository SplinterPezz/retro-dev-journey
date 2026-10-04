import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { downloadButton, hideDownloadButtonInSandbox } from '../../config/sandbox';
import { companies, technologies } from '../../config/career';
import { defaultBuilding, defaultStatue } from '../../config/world';
import { DailyQuest as DailyQuestItem } from '../../types/sandbox';
import QuestPanel from '../QuestPanel/QuestPanel';

interface DailyQuestProps {
  questSuffix: string;
  className?: string;
  showProgress?: boolean;
  maxVisible?: number;
}

const toggleLabel = { show: 'Show quest list', hide: 'Hide quest list' };

const questTypeIcon: Record<DailyQuestItem['type'], string> = {
  building: '🏢',
  statue: '⚡',
  extra: '📥',
};

const DailyQuest: React.FC<DailyQuestProps> = ({ 
  questSuffix, 
  className = '',
  showProgress = true,
  maxVisible 
}) => {
  const { interactions } = useSelector((state: RootState) => state.tracking);
  const { consentGiven, isLoading } = useSelector((state: RootState) => state.consent);
  const isConsentAccepted = consentGiven === true;
  
  const dailyQuests: DailyQuestItem[] = useMemo(() => {
    const companyQuests: DailyQuestItem[] = companies.map((company) => ({
      id: company.id + questSuffix,
      done: interactions.some(interaction => interaction.includes(company.id + questSuffix)),
      name: `${company.name}`,
      shortName: company.data.shortName !== undefined ? company.data.shortName : company.name,
      icon: company.data.image || defaultBuilding,
      type: 'building',
    }));
    
    const technologyQuests: DailyQuestItem[] = technologies.map((tech) => ({
      id: tech.id + questSuffix,
      done: interactions.some(interaction => interaction.includes(tech.id + questSuffix)),
      name: `${tech.name}`,
      shortName: tech.data.shortName !== undefined ? tech.data.shortName : tech.name,
      icon: tech.data.image || defaultStatue,
      type: 'statue',
    }));

    if (hideDownloadButtonInSandbox) {
      return [...companyQuests, ...technologyQuests];
    }

    const downloadQuest: DailyQuestItem = {
      id: downloadButton.data.id + questSuffix,
      done: interactions.some(interaction => interaction.includes(downloadButton.data.id + questSuffix)),
      name: `Download CV`,
      shortName: `DownloadCV`,
      icon: downloadButton.data.image || defaultStatue,
      type: 'extra',
    };

    return [...companyQuests, ...technologyQuests, downloadQuest];
  }, [questSuffix, interactions]);

  const completedQuests = dailyQuests.filter(quest => quest.done);
  const completionPercentage = (completedQuests.length / dailyQuests.length) * 100;
  
  const displayedQuests = maxVisible ? dailyQuests.slice(0, maxVisible) : dailyQuests;

  return (
    <QuestPanel
      className={className}
      title={isConsentAccepted ? 'Daily Quests' : 'Cookies for Quests!'}
      headerExtra={
        isConsentAccepted && (
          <h4 className="quest-title d-none d-sm-block">
            ({completedQuests.length}/{dailyQuests.length})
          </h4>
        )
      }
      percentage={isConsentAccepted && showProgress ? completionPercentage : undefined}
      collapsible={isConsentAccepted}
      toggleLabel={toggleLabel}
      bodyMaxHeight="400px"
      footer={
        !isConsentAccepted && (
          <div className="quest-consent">
            {isLoading
              ? 'Loading consent status...'
              : 'Please accept cookies to enable quest tracking and see your progress!'}
          </div>
        )
      }
    >
      <div className="quest-list">
        {displayedQuests.map((quest) => (
          <div key={quest.id} className={`quest-item${quest.done ? ' done' : ''}`}>
            <div className="quest-icon-container">
              <img src={quest.icon} alt={quest.name} className="quest-icon" />
              <span className="quest-type-badge">{questTypeIcon[quest.type]}</span>
            </div>

            <div className="quest-info">
              <span className="quest-name d-none d-sm-block">{quest.name}</span>
              <span className="quest-name d-block d-sm-none">{quest.shortName}</span>
            </div>

            <div className={`quest-status ${quest.done ? 'done' : 'todo'}`}>{quest.done ? '✓' : '○'}</div>
          </div>
        ))}
      </div>

      {completedQuests.length === dailyQuests.length && (
        <div className="quest-complete d-none d-sm-block">All quests completed! Well done, adventurer!</div>
      )}
    </QuestPanel>
  );
};

export default DailyQuest;
