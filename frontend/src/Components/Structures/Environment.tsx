import React from 'react';
import { EnvironmentData } from '../../types/sandbox';


interface EnvironmentDataProps {
    environment: EnvironmentData;
    size: 128 | 256;
}

const halfSizeEnv = ['flower', 'rock', 'bucket', 'lamp']

const Environment: React.FC<EnvironmentDataProps> = ({ size, environment }) => {
    const defaultSize = halfSizeEnv.some(el => environment.image.includes(el)) ? size / 2 : size;
    const width = environment.imageSize !== undefined ? environment.imageSize.width : defaultSize;
    const height = environment.imageSize !== undefined ? environment.imageSize.height : defaultSize;

    return (
        <>
            <div
                className='structure-container'
                style={{
                    left: environment.position.x,
                    top: environment.position.y,
                }}
            >

                <div className="structure-sprite">
                    <img
                        src={environment.image}
                        style={{
                            width,
                            height,
                        }}
                        className="structure-technology-image" />
                </div>
            </div>
        </>
    )
}
export default Environment;