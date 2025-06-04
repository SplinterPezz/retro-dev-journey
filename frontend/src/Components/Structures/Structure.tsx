import React from 'react';
import { Position, StructureData } from '../../Pages/Sandbox/types';
import './Structure.css';

interface StructureProps {
  data: StructureData;
  type: 'building' | 'statue';
  isNearby: boolean;
  playerPosition: Position;
}

const Structure: React.FC<StructureProps> = ({ data, type, isNearby, playerPosition }) => {
  // Calculate if structure should show interaction hint
  const showInteractionHint = isNearby;

  // Get structure icon/sprite
  const getStructureIcon = (): string => {
    if (data.sprite) {
      return data.sprite;
    }
    
    // Fallback icons based on type
    if (type === 'building') {
      return '🏢'; // Company building
    } else {
      return '🗿'; // Technology statue
    }
  };

  // Get structure color based on type
  const getStructureColor = (): string => {
    return type === 'building' ? '#8b4513' : '#708090';
  };

  return (
    <div
      className={`structure-container ${type} ${isNearby ? 'nearby' : ''}`}
      style={{
        position: 'absolute',
        left: data.position.x - 25, // Center the structure
        top: data.position.y - 25,
        zIndex: 50
      }}
    >
      {/* Structure sprite/icon */}
      <div 
        className="structure-sprite"
        style={{
          backgroundColor: getStructureColor(),
          border: `2px solid ${isNearby ? '#ffd700' : '#654321'}`,
          boxShadow: isNearby ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none'
        }}
      >
        <span className="structure-icon">
          {getStructureIcon()}
        </span>
        
        {/* Interaction radius indicator (debug) */}
        {process.env.NODE_ENV === 'development' && (
          <div 
            className="interaction-radius"
            style={{
              width: data.interactionRadius * 2,
              height: data.interactionRadius * 2,
              left: -(data.interactionRadius - 25),
              top: -(data.interactionRadius - 25)
            }}
          />
        )}
      </div>

      {/* Structure label */}
      <div className={`structure-label ${showInteractionHint ? 'visible' : ''}`}>
        <span>{data.name}</span>
        {showInteractionHint && (
          <div className="interaction-hint">
            Press SPACE to interact
          </div>
        )}
      </div>

      {/* Connection path to main road */}
      <div className="structure-path" />
    </div>
  );
};

export default Structure;