import React from 'react';
import { StoryPropData } from '../../../types/story';
import { quizSparkleImage } from '../../../config/story/assets';
import './BobbingProp.css';

interface BobbingPropProps {
  prop: StoryPropData;
}

const BobbingProp: React.FC<BobbingPropProps> = ({ prop }) => (
  <div
    className="bobbing-prop"
    style={{
      left: prop.position.x,
      top: prop.position.y,
      width: prop.imageSize?.width,
      height: prop.imageSize?.height,
      ['--sparkle-image' as string]: `url('${quizSparkleImage}')`,
    }}
  >
    <img src={prop.image} alt="" className="bobbing-prop-sprite" />
  </div>
);

export default React.memo(BobbingProp);
