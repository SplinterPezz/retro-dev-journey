import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { resetStory } from '../../store/storySlice';
import { usePlayerMovement } from '../Sandbox/hooks/usePlayerMovement';
import { useCollisionDetection } from '../Sandbox/hooks/useCollisionDetection';
import TerrainRenderer from '../../Components/Terrain/TerrainRenderer';
import PathRenderer from '../../Components/Path/PathRender';
import Structure from '../../Components/Structures/Structure';
import Player from '../../Components/Player/Player';
import HomeButton from '../../Components/Common/HomeButton';
import '../../Components/Common/scene-layout.css';
import { cameraStyle } from '../../Components/Common/cameraStyle';
import { useLogicalViewport } from '../../Components/Common/screenOrientation';
import { useZoomScale } from '../../Components/Common/zoomStore';
import ZoomSlider from '../../Components/Common/ZoomSlider';
import MobileJoystick from '../../Components/Common/MobileJoystick';
import { useIsMobile } from '../../Components/Common/useIsMobile';
import { createPathGenerator } from '../../Components/Path/pathGeneration';
import { worldConfig, companies, mainPathConfig, playerHitbox, playerSpawnPosition, terrainAutoRotate } from '../../config/sandbox';
import { PathSegment } from '../../types/sandbox';
import { storyChapterOrder } from '../../config/story/chapters';
import './StoryMapPage.css';

const StoryMapPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const unlockedChapterIndex = useSelector((state: RootState) => state.story.unlockedChapterIndex);
  const [exiting, setExiting] = useState(false);
  const isMobile = useIsMobile();
  const viewport = useLogicalViewport();
  const zoomScale = useZoomScale();

  const handleDebugReset = () => {
    dispatch(resetStory());
    window.location.href = '/story';
  };

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

  const pathSegments: PathSegment[] = useMemo(() => {
    const pathGenerator = createPathGenerator({
      startPosition: { x: mainPathConfig.startX, y: mainPathConfig.startY },
      endPosition: { x: mainPathConfig.startX, y: mainPathConfig.endY },
      structures: companies,
      tileSize: worldConfig.tileSize,
    });
    return pathGenerator.generatePath();
  }, []);

  const { playerPosition, isMoving, direction, handleJoystickMove, handleJoystickStop } = usePlayerMovement({
    initialPosition: playerSpawnPosition,
    speed: 270,
    worldBounds: {
      minX: 50,
      minY: 50,
      maxX: worldConfig.width - 50,
      maxY: worldConfig.height - 50,
    },
    structures: companies,
    playerHitbox,
    canMove: !exiting,
  });

  const doorCollidable = useMemo(
    () => (activeCompany ? [activeCompany] : []),
    [activeCompany]
  );

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
        {process.env.REACT_APP_ENV === 'development' && (
          <button type="button" className="story-debug-reset" onClick={handleDebugReset}>
            Reset story
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rpgui-content">
      <div className={`story-map-container${exiting ? ' exiting' : ''}`}>
        <div className="story-map-viewport">
          <div
            className="story-map-world"
            style={{
              width: worldConfig.width,
              height: worldConfig.height,
              ...cameraStyle(playerPosition, viewport, zoomScale),
            }}
          >
            <TerrainRenderer worldConfig={worldConfig} autoRotate={terrainAutoRotate} />
            <PathRenderer pathSegments={pathSegments} tileSize={worldConfig.tileSize} />

            <div className="structure-container">
              {companies.map((company) => (
                <Structure
                  key={company.id}
                  data={company}
                  type="building"
                  isNearby={nearbyDoor?.id === company.id}
                  playerPosition={playerPosition}
                />
              ))}
            </div>

            <Player position={playerPosition} isMoving={isMoving} direction={direction} />
          </div>
        </div>

        <div className="story-map-ui">
          <div className="back-button ms-3">
            <HomeButton />
          </div>
          <div className="story-map-hint rpgui-container framed-grey">
            <p className="mb-0">Walk to {activeCompany?.name || 'the next building'} to continue the story</p>
          </div>
        </div>

        <ZoomSlider />
        {isMobile && <MobileJoystick onMove={handleJoystickMove} onStop={handleJoystickStop} />}

        {process.env.REACT_APP_ENV === 'development' && (
          <button type="button" className="story-debug-reset" onClick={handleDebugReset}>
            Reset story
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryMapPage;
