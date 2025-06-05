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
    if (type === 'building') {
      // Map different companies to different building sprites
      switch (data.name) {
        case 'StartupHub':
          return '/sprites/buildings/startup.png';
        case 'InnovateSoft':
          return '/sprites/buildings/corporate.png';
        case 'TechCorp Italia':
          return '/sprites/buildings/tech_company.png';
        case '???':
          return '/sprites/buildings/future.png';
        default:
          return '/sprites/buildings/default.png';
      }
    } else {
      return data.sprite;
    }
  };

  // Get structure color based on type and special cases
  const getStructureColor = (): string => {
    
    if (data.name === '???') {
      return '#ffd700';
    }
    
    return type === 'building' ? '#8b4513' : '#708090';
  };

  // Get special classes for the structure
  const getStructureClasses = (): string => {
    let classes = `structure-container ${type}`;
    
    if (isNearby) {
      classes += ' nearby';
    }
    
    // Special class for future opportunity
    if (data.name === '???') {
      classes += ' future-opportunity';
    }
    
    return classes;
  };

  return (
    <div
      className={getStructureClasses()}
      style={{
        position: 'absolute',
        left: data.position.x - 256,
        top: data.position.y - 490,
        zIndex: 50
      }}
    >
      {/* Structure sprite/icon */}
      <div className="structure-sprite">
        {/* Check if it's a building with image path or emoji */}
        {type === 'building' && getStructureIcon().startsWith('/sprites/') ? (
          <img 
            src={getStructureIcon()}
            alt={data.name}
            className="structure-building-image"
            style={{
              width: '512px',
              height: '512px',
              objectFit: 'contain',
              imageRendering: 'pixelated'
            }}
          />
        ) : (
          <span className="structure-icon">
            {getStructureIcon()}
          </span>
        )}
        
        {/* Interaction radius indicator (debug) */}
        {process.env.NODE_ENV === 'development' && (
          <div 
            
            className="interaction-radius d-none"
            style={{
              width: data.interactionRadius * 2,
              height: data.interactionRadius * 2,
              left: 256 - data.interactionRadius,
              top: 512 - data.interactionRadius
            }}
          />
        )}
      </div>

      {/* Structure label */}
      <div className={`structure-label ${showInteractionHint ? 'visible' : ''}`}>
        <span>{data.name}</span>
        {showInteractionHint && (
          <div className="interaction-hint">
            {data.name === '???' ? 'Your next opportunity awaits!' : 'Walk closer to explore'}
          </div>
        )}
      </div>

      {/* Connection indicator to main path */}
      <div className="structure-connection-line" />
    </div>
  );
};

export default Structure;