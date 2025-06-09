import React from 'react';
import { Position, StructureData } from '../../types/sandbox';
import { technologyCentering } from '../../Pages/Sandbox/config';

interface DownloadCVProps {
    isNearby: boolean;
    structure: StructureData;
    playerPosition: Position;
}

const DownloadCV: React.FC<DownloadCVProps> = ({ isNearby, structure }) => {
    return (
        <>
            <div
                className='structure-container'
                style={{
                    left: structure.position.x,
                    top: structure.position.y,
                }}
            >
                <div className="structure-sprite">
                    <img
                        style={{
                            marginLeft: structure.data.centering !== undefined ? structure.data.centering.x : 0,
                            marginTop: structure.data.centering !== undefined ? structure.data.centering.y : 0
                        }}
                        src={isNearby ? structure.data.animatedImage : structure.data.image}
                        className="structure-technology-image" />
                </div>
                {process.env.REACT_APP_ENV === 'development' && (
                    <div 
                    className="interaction-radius"
                    style={{
                        width: structure.interactionRadius * 2,
                        height: structure.interactionRadius * 2,
                        left: -(structure.interactionRadius),
                        top: -(structure.interactionRadius),
                    }}
                    />
                )}
            </div>
        </>
    )
}

export default DownloadCV;