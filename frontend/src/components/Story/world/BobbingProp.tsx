import React from 'react';
import { StoryPropData } from '../../../types/story';
import './BobbingProp.css';

interface BobbingPropProps {
  prop: StoryPropData;
}

// A prop that floats up and down with a flicker, like the quiz question mark.
// It only draws: it has no collision and no interaction.
const BobbingProp: React.FC<BobbingPropProps> = ({ prop }) => (
  <div
    className="bobbing-prop"
    style={{
      left: prop.position.x,
      top: prop.position.y,
      width: prop.imageSize?.width,
      height: prop.imageSize?.height,
    }}
  >
    <img src={prop.image} alt="" className="bobbing-prop-sprite" />
    <span className="bobbing-prop-glint" aria-hidden="true" />
  </div>
);

export default React.memo(BobbingProp);
