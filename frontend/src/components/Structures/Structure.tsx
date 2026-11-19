import React from 'react';
import { StructureData } from '../../types/sandbox';
import './Structure.css';
import { isDev } from '../../config/env';
import { structureCentering, technologyCentering } from '../../config/world';
import { lockSprite } from '../../config/assets';
import { COMPANY_IDS } from '../../config/ids';

interface StructureProps {
  data: StructureData;
  isNearby: boolean;
  locked?: boolean;
}

const Structure: React.FC<StructureProps> = ({ data, isNearby, locked = false }) => {
  const isBuilding = data.type === 'building';

  const getSignpostIcon = (): string | undefined => (data.type === 'building' ? data.data.signpost : undefined);

  const getStructureClasses = (): string => {
    let classes = `structure-container ${isBuilding ? 'building' : 'technology'}`;
    
    if (isNearby) {
      classes += ' nearby';
    }
    return classes;
  };

  return (
    <div
      className={getStructureClasses()}
      style={{
        left: data.position.x + (isBuilding? structureCentering.x : technologyCentering.x),
        top: data.position.y + (isBuilding? structureCentering.y : technologyCentering.y),
      }}
    >
      <div className="structure-sprite">
        {isBuilding ? (
          <>
            <img
              src={data.data.image}
              alt={data.name}
              className="structure-building-image"
              style={{
                  marginLeft: data.data.centering !== undefined ? data.data.centering.x : 0,
                  marginTop: data.data.centering !== undefined ? data.data.centering.y : 0,
                  ...(data.data.imageSize !== undefined ? { width: data.data.imageSize.width, height: data.data.imageSize.height } : {})
                }}
            />

            {getSignpostIcon() !== undefined && (
              <>
                <img
                  src={getSignpostIcon()}
                  alt={data.name}
                  className="structure-signpost-image"
                />
                <div className="signpost-shadow"></div>
              </>
            )}

            {locked && <img src={lockSprite} alt="Locked" className="structure-lock-image" />}
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
                src={data.data.image}
                alt={data.name}
                style={{
                  marginLeft: data.data.centering !== undefined ? data.data.centering.x : 0,
                  marginTop: data.data.centering !== undefined ? data.data.centering.y : 0,
                  ...(data.data.imageSize !== undefined ? { width: data.data.imageSize.width, height: data.data.imageSize.height } : {})
                }}
                className="structure-technology-image"
              />
          </>
          
        )}
        
        {isDev && (
          <div 
            className="interaction-radius"
            style={{
              width: data.interactionRadius * 2,
              height: data.interactionRadius * 2,
              left: -(data.interactionRadius) - (isBuilding ? structureCentering.x : technologyCentering.x),
              top: -(data.interactionRadius) - (isBuilding ? structureCentering.y : technologyCentering.y),
            }}
          />
        )}
      </div>

      <div className={`d-none structure-label ${isNearby ? 'visible' : ''}`}>
        <span>{data.name}</span>
        {(isNearby && data.id === COMPANY_IDS.futureOpportunity) && (
          <div className="interaction-hint">
            {'Your next opportunity awaits!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Structure;