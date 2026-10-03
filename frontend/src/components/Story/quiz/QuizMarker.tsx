import React from 'react';
import { Position } from '../../../types/sandbox';
import { quizMarkerImage, quizSparkleImage } from '../../../config/story/assets';
import './QuizMarker.css';

interface QuizMarkerProps {
  position: Position;
  image?: string;
}

// Floating visual marker for a quiz station - previously a quiz had no sprite
// at all, just an invisible trigger radius. Same language as Sandbox's
// technology statues (java.png/python.png): one iconic object + a sparkle
// overlay, here with a gentle bob animation since it's meant to catch the eye.
const QuizMarker: React.FC<QuizMarkerProps> = ({
  position,
  image = quizMarkerImage,
}) => (
  <div
    className="quiz-marker"
    style={{
      left: position.x,
      top: position.y,
      ['--sparkle-image' as string]: `url('${quizSparkleImage}')`,
    }}
  >
    <img src={image} alt="" className="quiz-marker-sprite" />
  </div>
);

export default React.memo(QuizMarker);
