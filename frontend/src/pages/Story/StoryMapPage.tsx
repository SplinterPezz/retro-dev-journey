import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { usePlayerMovement } from '../../game/hooks/usePlayerMovement';
import { useCollisionDetection } from '../../game/hooks/useCollisionDetection';
import { useDebugReset } from '../../game/useDebugReset';
import { createPathGenerator } from '../../game/path/pathGeneration';
import GameScene from '../../game/GameScene';
import TerrainRenderer from '../../components/Terrain/TerrainRenderer';
import PathRenderer from '../../components/Path/PathRenderer';
import Structure from '../../components/Structures/Structure';
import Player from '../../components/Player/Player';
import HomeButton from '../../components/Common/HomeButton';
import { worldConfig, mainPathConfig, playerHitbox, playerSpawnPosition, terrainAutoRotate } from '../../config/world';
import { companies } from '../../config/career';
import { storyChapterOrder } from '../../config/story/chapters';
import { isDev } from '../../config/env';
import '../../game/DebugOverlay.css';
import './StoryMapPage.css';

const worldBounds = {
  minX: 50,
  minY: 50,
  maxX: worldConfig.width - 50,
  maxY: worldConfig.height - 50,
};

interface MapWorldProps {
  nearbyId: string | null;
}

// Terrain, path and buildings: re-rendered only when the nearby door changes.
const MapWorld: React.FC<MapWorldProps> = React.memo(({ nearbyId }) => {
  const pathSegments = useMemo(
    () =>
      createPathGenerator({
        startPosition: { x: mainPathConfig.startX, y: mainPathConfig.startY },
        endPosition: { x: mainPathConfig.startX, y: mainPathConfig.endY },
        structures: companies,
        tileSize: worldConfig.tileSize,
      }).generatePath(),
    []
  );

  return (
    <>
      <TerrainRenderer worldConfig={worldConfig} autoRotate={terrainAutoRotate} />
      <PathRenderer pathSegments={pathSegments} tileSize={worldConfig.tileSize} />
      <div className="structure-container">
        {companies.map((company) => (
          <Structure key={company.id} data={company} type="building" isNearby={nearbyId === company.id} />
        ))}
      </div>
    </>
  );
});

const StoryMapPage: React.FC = () => {
  const navigate = useNavigate();
  const unlockedChapterIndex = useSelector((state: RootState) => state.story.unlockedChapterIndex);
  const [exiting, setExiting] = useState(false);
  const { resetAll } = useDebugReset();

  const activeChapter = storyChapterOrder[unlockedChapterIndex];

  // Chapter 0 (Prologue) has no building on the overworld - go straight there.
  useEffect(() => {
    if (unlockedChapterIndex === 0) {
      navigate('/story/prologue', { replace: true });
    }
  }, [unlockedChapterIndex, navigate]);

  const activeCompany = useMemo(
    () => (activeChapter?.companyId ? companies.find((c) => c.id === activeChapter.companyId) : undefined),
    [activeChapter]
  );

  const { playerPosition, isMoving, direction, handleJoystickMove, handleJoystickStop } = usePlayerMovement({
    initialPosition: playerSpawnPosition,
    speed: 270,
    worldBounds,
    structures: companies,
    playerHitbox,
    canMove: !exiting,
  });

  const doorCollidable = useMemo(() => (activeCompany ? [activeCompany] : []), [activeCompany]);

  const { nearbyStructure: nearbyDoor } = useCollisionDetection({
    playerPosition,
    structures: doorCollidable,
    interactionRadius: 90,
  });

  useEffect(() => {
    if (nearbyDoor && activeChapter && !exiting) {
      setExiting(true);
      const timer = setTimeout(() => navigate(`/story/${activeChapter.id}`), 500);
      return () => clearTimeout(timer);
    }
  }, [nearbyDoor, activeChapter, exiting, navigate]);

  const debugResetButton = isDev && (
    <button type="button" className="story-debug-reset" onClick={resetAll}>
      Reset story
    </button>
  );

  if (unlockedChapterIndex === 0) {
    return null; // redirecting to /story/prologue
  }

  if (!activeChapter) {
    return (
      <div className="rpgui-content">
        <div className="story-map-stub">
          <div className="rpgui-container framed-golden story-map-stub-box">
            <h2>To be continued...</h2>
            <p>The next chapter of this journey is still being written.</p>
            <HomeButton />
          </div>
        </div>
        {debugResetButton}
      </div>
    );
  }

  return (
    <div className="rpgui-content">
      <div className={`story-map-container${exiting ? ' exiting' : ''}`}>
        <GameScene
          name="story-map"
          world={worldConfig}
          playerPosition={playerPosition}
          joystick={{ onMove: handleJoystickMove, onStop: handleJoystickStop }}
          overlay={
            <div className="story-map-ui">
              <div className="back-button ms-3">
                <HomeButton />
              </div>
              <div className="story-map-hint rpgui-container framed-grey">
                <p className="mb-0">Walk to {activeCompany?.name || 'the next building'} to continue the story</p>
              </div>
            </div>
          }
        >
          <MapWorld nearbyId={nearbyDoor?.id ?? null} />
          <Player position={playerPosition} isMoving={isMoving} direction={direction} />
        </GameScene>
        {debugResetButton}
      </div>
    </div>
  );
};

export default StoryMapPage;
