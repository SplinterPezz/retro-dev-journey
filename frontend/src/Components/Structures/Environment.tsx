import React from 'react';
import { EnvironmentData } from '../../types/sandbox';


interface EnvironmentDataProps {
  environment: EnvironmentData;
  size : 128 | 256;
}

const halfSizeEnv = ['flower', 'rock', 'bucket', 'lamp']

const Environment: React.FC<EnvironmentDataProps> = ({ size, environment} ) => {
    
    return (
        <>
            <div
                className='structure-container'
                style={{
                    left: environment.position.x,
                    top: environment.position.y,
                }}
            >
                {/* Structure sprite/icon */}
                <div className="structure-sprite">
                    <img 
                        src={environment.image} 
                        style={{
                            width: halfSizeEnv.some(el=> environment.image.includes(el)) ? size/2 : size,
                            height: halfSizeEnv.some(el=> environment.image.includes(el)) ? size/2 : size,
                        }} 
                        className="structure-technology-image"/>
                </div>
            </div>
        </>
    )
}
export default Environment;