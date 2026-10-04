import React, { useMemo } from 'react';
import TerrainRenderer from '../../components/Terrain/TerrainRenderer';
import Environment from '../../components/Structures/Environment';
import BobbingProp from '../../components/Story/world/BobbingProp';
import QuizMarker from '../../components/Story/quiz/QuizMarker';
import { StoryChapterConfig, StoryFlags } from '../../types/story';
import { doorImage } from '../../config/story/assets';
import { isPropVisible, isUnlocked } from './sceneRules';

interface RoomProps {
  chapter: StoryChapterConfig;
  flags: StoryFlags;
}

// re-renders only when the flags change, never on a player step
const Room: React.FC<RoomProps> = ({ chapter, flags }) => {
  const door = useMemo(() => ({ image: doorImage, position: chapter.doorPosition }), [chapter.doorPosition]);
  const props = chapter.props.filter((prop) => isPropVisible(prop, flags));
  const quizzes = chapter.quizzes.filter((quiz) => isUnlocked(flags, quiz.requiredFlag));

  return (
    <>
      <TerrainRenderer worldConfig={chapter.worldConfig} autoRotate={false} terrainImage={chapter.floorImage} />
      <div className="structure-container">
        <Environment environment={door} size={128} />
      </div>
      <div className="structure-container">
        {props.map((prop) =>
          prop.visibleWhenFlag ? <BobbingProp key={prop.id} prop={prop} /> : <Environment key={prop.id} environment={prop} size={128} />
        )}
      </div>
      {quizzes.map((quiz) => (
        <QuizMarker key={quiz.id} position={quiz.position} />
      ))}
    </>
  );
};

export default React.memo(Room);
