import React from 'react';
import { Position } from '../../../types/sandbox';
import { quizMarkerImage, quizSparkleImage } from '../../../config/story/assets';
import './QuizMarker.css';

interface QuizMarkerProps {
  position: Position;
  image?: string;
}

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
