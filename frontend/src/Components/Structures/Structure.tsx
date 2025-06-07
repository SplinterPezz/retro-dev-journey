import React from 'react';
import { Position, StructureData, CompanyData, TechnologyData } from '../../Pages/Sandbox/types';
import './Structure.css';
import { structureCentering, technologyCentering } from '../../Pages/Sandbox/config';

interface StructureProps {
  data: StructureData;
  type: 'building' | 'technology';
  isNearby: boolean;
  playerPosition: Position;
}

const Structure: React.FC<StructureProps> = ({ data, type, isNearby, playerPosition }) => {
  
  // Calculate if structure should show interaction hint
  const showInteractionHint = isNearby;

  const getStructureIcon = (): string => {
    if (type === 'building') {
        const defaultBuilding = '/sprites/buildings/default.png'
        const companyData = data.data as CompanyData;
        return companyData.image !== undefined ? companyData.image : defaultBuilding;
    }
    else {
      const defaultTech = '/sprites/statues/default.png'
      const techData = data.data as TechnologyData;
      return techData.image !== undefined ? techData.image : defaultTech;
    }
  };

  const getSignpostIcon = (): string => {
    if (type === 'building') {
        const defaultSignpost = '/signpost/default.png'
        const companyData = data.data as CompanyData;
        return companyData.signpost !== undefined ? companyData.signpost : defaultSignpost;
    }
    else {
      return data.id;
    }
  };

  // Get special classes for the structure
  const getStructureClasses = (): string => {
    let classes = `structure-container ${type}`;
    
    if (isNearby) {
      classes += ' nearby';
    }
    return classes;
  };

  return (
    <div
      className={getStructureClasses()}
      style={{
        position: 'absolute',
        left: data.position.x + (type === 'building'? structureCentering.x : technologyCentering.x),
        top: data.position.y + (type === 'building'? structureCentering.y : technologyCentering.y),
      }}
    >
      {/* Structure sprite/icon */}
      <div className="structure-sprite">
        {/* Check if it's a building with image path or emoji */}
        {type === 'building' ? (
          <>
            <img 
              src={getStructureIcon()}
              alt={data.name}
              className="structure-building-image"
            />
            <div className="signpost-shadow"></div>
            <img 
              src={getSignpostIcon()}
              alt={data.name}
              className="structure-signpost-image"
            />
          </>
          
        ) : (
          <img 
              src={getStructureIcon()}
              alt={data.name}
              className="structure-technology-image"
            />
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
        {(showInteractionHint && data.name === '???') && (
          <div className="interaction-hint">
            {'Your next opportunity awaits!'}
          </div>
        )}
      </div>

      {/* Connection indicator to main path */}
      <div className="structure-connection-line" />
    </div>
  );
};

export default Structure;