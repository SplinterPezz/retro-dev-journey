import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { companies, technologies, downloadButton, defaultBuilding, defaultStatue } from '../../Pages/Sandbox/config';
import './DailyQuest.css';
import { DailyQuest } from '../../types/sandbox';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useIubenda } from '../../hooks/useIubenda';

interface DailyQuestProps {
  questPrefix: string;
  className?: string;
  showProgress?: boolean;
  maxVisible?: number;
}

const slideDown = keyframes`
  from {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    max-height: 80vh;
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    max-height: 80vh;
    opacity: 1;
    transform: translateY(0);
  }
  to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
  }
`;

const AnimatedQuestContent = styled.div<{ isVisible: boolean }>`
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  animation: ${props => props.isVisible ? slideDown : slideUp} 0.3s ease-in-out forwards;
  max-height: ${props => props.isVisible ? '400px' : '0'};
  opacity: ${props => props.isVisible ? 1 : 0};
`;

const QuestListContainer = styled.div<{ isVisible: boolean }>`
  display: list;
  flex-direction: column;
  gap: 6px;
  max-height: 40vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  transform: translateY(${props => props.isVisible ? '0' : '-10px'});
  transition: transform 0.3s ease-in-out;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 215, 0, 0.5);
  }

  @media (max-width: 768px) {
    max-height: 350px;
  }

  @media (max-width: 480px) {
    max-height: 275px;
  }
`;

const QuestItem = styled.div<{ isCompleted: boolean; index: number; isVisible: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  
  padding: 6px;
  border-radius: 3px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  width: 100%;
  box-sizing: border-box;
  background: ${props => props.isCompleted 
    ? 'rgb(39 132 43 / 62%)' 
    : 'rgb(22 13 13 / 45%)'};
  border-color: ${props => props.isCompleted 
    ? 'rgba(76, 175, 80, 0.3)' 
    : 'rgba(255, 255, 255, 0.1)'};
  
  transform: translateX(${props => props.isVisible ? '0' : '-20px'});
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;

  &:hover:not(.more-quests) {
    background: #ffd703;
    transform: translateY(-1px) translateX(0);
  }

  @media (max-width: 480px) {
    padding: 5px;
    gap: 6px;
  }
`;

const ToggleButton = styled.button<{ isCollapsed: boolean }>`
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.5);
  border-radius: 3px;
  color: #ffd700;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  transform: rotate(${props => props.isCollapsed ? '0deg' : '180deg'});

  &:hover {
    background: rgba(255, 215, 0, 0.4);
    border-color: rgba(255, 215, 0, 0.8);
    transform: translateY(-1px) rotate(${props => props.isCollapsed ? '0deg' : '180deg'});
  }

  &:active {
    transform: translateY(0) rotate(${props => props.isCollapsed ? '0deg' : '180deg'});
    background: rgba(255, 215, 0, 0.6);
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 3px 6px;
    min-width: 20px;
    height: 20px;
  }

  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 2px 5px;
    min-width: 18px;
    height: 18px;
  }
`;

const CompleteMessage = styled.div<{ isVisible: boolean }>`
  margin-top: 10px;
  padding: 8px;
  background: rgba(255, 215, 0, 0.4);
  border-color: rgba(255, 215, 0, 0.8);
  border-radius: 3px;
  color: #c8e6c9;
  text-align: center;
  font-size: 0.75rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  animation: celebrationPulse 2s infinite;
  transform: translateY(${props => props.isVisible ? '0' : '10px'});
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
  transition-delay: 0.2s;

  @keyframes celebrationPulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.02) translateY(0);
    }
  }
`;

const ConsentMessage = styled.div`
  margin-top: 10px;
  padding: 8px;
  background: rgba(255, 165, 0, 0.3);
  border: 1px solid rgba(255, 165, 0, 0.5);
  border-radius: 3px;
  color: #ffffff;
  text-align: center;
  font-size: 0.7rem;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  animation: consentPulse 3s infinite;

  @keyframes consentPulse {
    0%, 100% {
      opacity: 0.8;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.01);
    }
  }

  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 6px;
  }
`;

const DailyQuestComponent: React.FC<DailyQuestProps> = ({ 
  questPrefix, 
  className = '',
  showProgress = true,
  maxVisible 
}) => {
  const { interactions } = useSelector((state: RootState) => state.tracking);
  const { consentGiven, isLoading } = useIubenda();
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const isConsentAccepted = consentGiven === true;
  
  const dailyQuests: DailyQuest[] = useMemo(() => {
    const companyQuests: DailyQuest[] = companies.map((company) => ({
      id: company.id + questPrefix,
      done: interactions.some(interaction => interaction.includes(company.id + questPrefix)),
      name: `${company.name}`,
      shortName: company.data.shortName !== undefined ? company.data.shortName : company.name,
      icon: company.data.image || defaultBuilding,
      type: 'building',
    }));
    
    const technologyQuests: DailyQuest[] = technologies.map((tech) => ({
      id: tech.id + questPrefix,
      done: interactions.some(interaction => interaction.includes(tech.id + questPrefix)),
      name: `${tech.name}`,
      shortName: tech.data.shortName !== undefined ? tech.data.shortName : tech.name,
      icon: tech.data.image || defaultStatue,
      type: 'statue',
    }));

    const downloadQuest: DailyQuest = {
      id: downloadButton.data.id + questPrefix,
      done: interactions.some(interaction => interaction.includes(downloadButton.data.id + questPrefix)),
      name: `Download CV`,
      shortName: `DownloadCV`,
      icon: downloadButton.data.image || defaultStatue,
      type: 'extra',
    };

    return [...companyQuests, ...technologyQuests, downloadQuest];
  }, [questPrefix, interactions]);

  const completedQuests = dailyQuests.filter(quest => quest.done);
  const completionPercentage = (completedQuests.length / dailyQuests.length) * 100;
  
  const displayedQuests = maxVisible ? dailyQuests.slice(0, maxVisible) : dailyQuests;

  const getQuestTypeIcon = (type: DailyQuest['type']): string => {
    switch (type) {
      case 'building':
        return '🏢';
      case 'statue':
        return '⚡';
      case 'extra':
        return '📥';
      default:
        return '❓';
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`daily-quest-container ${className}`}>
      <div className={`rpgui-container framed-grey ${!isCollapsed ? 'quest-collapsed-mobile': ''}`}>
          {/* Header with Toggle Button */}
          <div className="quest-header">
            <div className="quest-header-content">
              <h4 className="quest-title">
                {isConsentAccepted ? 'Daily Quests' : 'Cookies for Quests!'}
              </h4>
              {isConsentAccepted && (
                <h4 className="quest-title d-none d-sm-block">
                  ({completedQuests.length}/{dailyQuests.length})
                </h4>
              )}
              
              {isConsentAccepted && (
                <ToggleButton 
                  isCollapsed={isCollapsed}
                  onClick={toggleCollapse}
                  title={isCollapsed ? "Show quest list" : "Hide quest list"}
                >
                  ▼
                </ToggleButton>
              )}
            </div>
            
            {isConsentAccepted && showProgress && (
              <div className="quest-progress-container">
                <div className="quest-progress-bar">
                  <div 
                    className="quest-progress-fill"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="quest-progress-text">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
            )}
          </div>

          {/* Content based on consent status */}
          {isConsentAccepted ? (
            <>
              {/* Animated Quest Content */}
              <AnimatedQuestContent isVisible={!isCollapsed}>
                <QuestListContainer isVisible={!isCollapsed}>
                  {displayedQuests.map((quest, index) => (
                    <QuestItem 
                      key={quest.id}
                      isCompleted={quest.done}
                      index={index}
                      isVisible={!isCollapsed}
                    >
                      <div className="quest-icon-container">
                        <img 
                          src={quest.icon}
                          alt={quest.name}
                          className="quest-icon"
                        />
                        <span className="quest-type-badge">
                          {getQuestTypeIcon(quest.type)}
                        </span>
                      </div>
                      
                      <div className="quest-info">
                        <span className="quest-name d-none d-sm-block">{quest.name}</span>
                        <span className="quest-name d-block d-sm-none">{quest.shortName}</span>
                      </div>
                      
                      <div className={`quest-status ${quest.done ? 'done' : 'todo'}`}>
                        {quest.done ? '✓' : '○'}
                      </div>
                    </QuestItem>
                  ))}
                </QuestListContainer>

                {/* Animated Complete Message */}
                {completedQuests.length === dailyQuests.length && (
                  <CompleteMessage isVisible={!isCollapsed} className="d-none d-sm-block">
                    All quests completed! Well done, adventurer!
                  </CompleteMessage>
                )}
              </AnimatedQuestContent>
            </>
          ) : (
            <>
              {/* Consent Required Message */}
              {!isLoading && (
                <ConsentMessage>
                  Please accept cookies to enable quest tracking and see your progress!
                </ConsentMessage>
              )}
              
              {/* Loading Message */}
              {isLoading && (
                <ConsentMessage>
                  Loading consent status...
                </ConsentMessage>
              )}
            </>
          )}
        </div>
    </div>
  );
};

export default DailyQuestComponent;