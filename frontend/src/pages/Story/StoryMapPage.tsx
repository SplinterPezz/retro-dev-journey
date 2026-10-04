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
import StoryProgress, { StoryObjective } from '../../components/Story/hud/StoryProgress';
import { worldConfig, mainPathConfig, playerHitbox, playerSpawnPosition, terrainAutoRotate } from '../../config/world';
import { companies } from '../../config/career';
import { storyChapterOrder } from '../../config/story/chapters';
import { isDev } from '../../config/env';
import '../../game/DebugOverlay.css';
import './StoryMapPage.css';

// A company with no story yet ("???") is a teaser, not a chapter.
const HIDDEN_COMPANY_ID = '???';

const chapterName = (companyName: string) => companyName.replace(/ \(IT\)$/, '');

// Every chapter of the story, in order: the playable ones, then the companies
// still to be written. Done before the current one, locked after it.
const chapterQuests = (unlockedIndex: number): StoryObjective[] => {
  const written = storyChapterOrder.map((c) => {
    const company = companies.find((co) => co.id === c.companyId);
    return { id: company?.id ?? c.id, name: company ? chapterName(company.name) : 'Prologue' };
  });
  const toWrite = companies
    .filter((co) => co.id !== HIDDEN_COMPANY_ID && !storyChapterOrder.some((c) => c.companyId === co.id))
    .map((co) => ({ id: co.id, name: chapterName(co.name) }));
  return [...written, ...toWrite].map((c, i) => {
    const current = i === unlockedIndex && i < written.length;
    return { id: c.id, label: current ? `Walk to ${c.name}` : c.name, done: i < unlockedIndex, locked: !current && i >= unlockedIndex };
  });
};

const worldBounds = {
  minX: 50,
  minY: 50,
  maxX: worldConfig.width - 50,
  maxY: worldConfig.height - 50,
};

interface MapWorldProps {
  nearbyId: string | null;
  lockedIds: string[]; // buildings whose chapter is not open yet
}

// Terrain, path and buildings: re-rendered only when the nearby door changes.
const MapWorld: React.FC<MapWorldProps> = React.memo(({ nearbyId, lockedIds }) => {
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
          <Structure
            key={company.id}
            data={company}
            type="building"
            isNearby={nearbyId === company.id}
            locked={lockedIds.includes(company.id)}
          />
        ))}
      </div>
    </>
  );
});

const StoryMapPage: React.FC = () => {
  const navigate = useNavigate();
  const unlockedChapterIndex = useSelector((state: RootState) => state.story.unlockedChapterIndex);
  const chapters = useSelector((state: RootState) => state.story.chapters);
  const [exiting, setExiting] = useState(false);
  const { resetAll } = useDebugReset();

  const activeChapter = storyChapterOrder[unlockedChapterIndex];
  const quests = useMemo(() => chapterQuests(unlockedChapterIndex), [unlockedChapterIndex]);
  // every building that is neither done nor the current chapter (the "???" teaser too)
  const lockedIds = useMemo(() => {
    const open = new Set(quests.filter((q) => !q.locked).map((q) => q.id));
    return companies.filter((c) => !open.has(c.id)).map((c) => c.id);
  }, [quests]);

  // A chapter without a building on the overworld (the Prologue) is played on
  // its own map: go straight there while it is the current one, or while its
  // last scene has not been seen yet.
  const unfinishedStandalone = storyChapterOrder.find(
    (c, i) => !c.companyId && (i === unlockedChapterIndex || (c.endFlag && !chapters[c.id]?.flags[c.endFlag]))
  );
  useEffect(() => {
    if (unfinishedStandalone) {
      void navigate(`/story/${unfinishedStandalone.id}`, { replace: true });
    }
  }, [unfinishedStandalone, navigate]);

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

  if (unfinishedStandalone) {
    return null; // redirecting to that chapter
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
        <StoryProgress objectives={quests} name="Chapters" />
        <GameScene
          name="story-map"
          world={worldConfig}
          playerPosition={playerPosition}
          joystick={{ onMove: handleJoystickMove, onStop: handleJoystickStop }}
          overlay={
            <div className="home-fixed-top-left">
              <HomeButton />
            </div>
          }
        >
          <MapWorld nearbyId={nearbyDoor?.id ?? null} lockedIds={lockedIds} />
          <Player position={playerPosition} isMoving={isMoving} direction={direction} />
        </GameScene>
        {debugResetButton}
      </div>
    </div>
  );
};

export default StoryMapPage;
