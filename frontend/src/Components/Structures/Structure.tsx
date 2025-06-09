import React from 'react';
import { Position, StructureData, CompanyData, TechnologyData } from '../../types/sandbox';
import './Structure.css';
import { structureCentering, technologyCentering } from '../../Pages/Sandbox/config';

interface StructureProps {
  data: StructureData;
  type: 'building' | 'technology';
  isNearby: boolean;
  playerPosition: Position;
}

const Structure: React.FC<StructureProps> = ({ data, type, isNearby }) => {

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
        const defaultSignpost = '/sprites/signpost/default.png'
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
              style={{
                  marginLeft: data.data.centering !== undefined ? data.data.centering.x : 0,
                  marginTop: data.data.centering !== undefined ? data.data.centering.y : 0
                }}
            />
            
            <img 
              src={getSignpostIcon()}
              alt={data.name}
              className="structure-signpost-image"
            />
            <div className="signpost-shadow"></div>
          </>
          
        ) : (
          <>
          {data.data.shadow  !== undefined ? 
            <div className="technology-shadow" 
            style={{
              left: data.data.shadow.position.x,
              top: data.data.shadow.position.y,
              width: data.data.shadow.width,
              height: data.data.shadow.height,
            }}/> : <></>
          }
            <img 
                src={getStructureIcon()}
                alt={data.name}
                style={{
                  marginLeft: data.data.centering !== undefined ? data.data.centering.x : 0,
                  marginTop: data.data.centering !== undefined ? data.data.centering.y : 0
                }}
                className="structure-technology-image"
              />
          </>
          
        )}
        
        {/* Interaction radius indicator (debug) */}
        {process.env.REACT_APP_ENV === 'development' && (
          <div 
            className="interaction-radius"
            style={{
              width: data.interactionRadius * 2,
              height: data.interactionRadius * 2,
              left: -(data.interactionRadius) - (type === 'building' ? structureCentering.x : technologyCentering.x),
              top: -(data.interactionRadius) - (type === 'building' ? structureCentering.y : technologyCentering.y),
            }}
          />
        )}
      </div>

      {/* Structure label */}
      <div className={`structure-label ${isNearby ? 'visible' : ''}`}>
        <span>{data.name}</span>
        {(isNearby && data.name === '???') && (
          <div className="interaction-hint">
            {'Your next opportunity awaits!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Structure;