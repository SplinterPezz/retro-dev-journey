import React from 'react';
import { EnvironmentData } from '../../types/sandbox';

const Environment: React.FC<EnvironmentData> = ({ image, position, shadow }) => {

    return (
        <>
            <div
                className='structure-container'
                style={{
                    left: position.x,
                    top: position.y,
                }}
            >
                {/* Structure sprite/icon */}
                <div className="structure-sprite">
                    <img src={image} className="structure-technology-image"/>
                </div>
            </div>
        </>
    )
}
export default Environment;