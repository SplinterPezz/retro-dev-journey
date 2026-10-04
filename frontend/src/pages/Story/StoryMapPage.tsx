import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { markDiscoverySeen } from '../../store/storySlice';
import { usePlayerMovement } from '../../game/hooks/usePlayerMovement';
import { useCollisionDetection } from '../../game/hooks/useCollisionDetection';
import { useDebugReset } from '../../game/useDebugReset';
import { createPathGenerator } from '../../game/path/pathGeneration';
import GameScene from '../../game/GameScene';
import TerrainRenderer from '../../components/Terrain/TerrainRenderer';
import PathRenderer from '../../components/Path/PathRenderer';
import Structure from '../../components/Structures/Structure';
import Environment from '../../components/Structures/Environment';
import Player from '../../components/Player/Player';
import HomeButton from '../../components/Common/HomeButton';
import StoryProgress, { StoryObjective } from '../../components/Story/hud/StoryProgress';
import UnlockPopup from '../../components/Story/hud/UnlockPopup';
import { worldConfig, mainPathConfig, playerHitbox, playerSpawnPosition, terrainAutoRotate } from '../../config/world';
import { companies, technologies } from '../../config/career';
import { treesEnvironments, detailsEnvironments } from '../../config/environments';
import { isChapterFinished, storyChapterOrder, storyMapAudioTrack } from '../../config/story/chapters';
import { collectibleCount } from '../../config/story/collectibles';
import { ChapterProgress } from '../../types/story';
import { StructureData, TechnologyData } from '../../types/sandbox';
import { isDev } from '../../config/env';
import '../../game/DebugOverlay.css';
import './StoryMapPage.css';

// A company with no story yet ("???") is a teaser, not a chapter.
const HIDDEN_COMPANY_ID = '???';

const chapterName = (companyName: string) => companyName.replace(/ \(IT\)$/, '');

// Every chapter of the story, in order: the playable ones, then the companies
// still to be written. Done before the current one, locked after it. A chapter
// with collectibles shows how many were found ("★ 3/5").
const chapterQuests = (unlockedIndex: number, progress: Record<string, ChapterProgress>): StoryObjective[] => {
  const written = storyChapterOrder.map((c) => {
    const company = companies.find((co) => co.id === c.companyId);
    const name = company ? chapterName(company.name) : 'Prologue';
    const total = collectibleCount(c.id);
    const found = progress[c.id]?.collectibles?.length ?? 0;
    return { id: company?.id ?? c.id, name: total > 0 ? `${name} ★ ${found}/${total}` : name };
  });
  const toWrite = companies
    .filter((co) => co.id !== HIDDEN_COMPANY_ID && !storyChapterOrder.some((c) => c.companyId === co.id))
    .map((co) => ({ id: co.id, name: chapterName(co.name) }));
  return [...written, ...toWrite].map((c, i) => {
    const current = i === unlockedIndex && i < written.length;
    return { id: c.id, label: current ? `Walk to ${c.name}` : c.name, done: i < unlockedIndex, locked: !current && i >= unlockedIndex };
  });
};

// The Sandbox decoration, all of it; the technologies come with the chapters.
const environments = [...treesEnvironments, ...detailsEnvironments];

// Statues whose chapter is finished, in the order of the Sandbox config.
const unlockedTechnologies = (progress: Record<string, ChapterProgress>): StructureData[] =>
  technologies.filter((t) => {
    const chapterId = (t.data as TechnologyData).storyChapter;
    if (!chapterId) return false;
    return isChapterFinished(storyChapterOrder.find((c) => c.id === chapterId) ?? { id: chapterId }, progress);
  });

const worldBounds = {
  minX: 50,
  minY: 50,
  maxX: worldConfig.width - 50,
  maxY: worldConfig.height - 50,
};

interface MapWorldProps {
  nearbyId: string | null;
  lockedIds: string[]; // buildings whose chapter is not open yet
  statues: StructureData[]; // the technologies unlocked so far
  pathTargets: StructureData[]; // what the paths lead to: the buildings and those statues
}

// Terrain, paths, buildings, statues and decoration: re-rendered only when the
// nearby door or the unlocked statues change.
const MapWorld: React.FC<MapWorldProps> = React.memo(({ nearbyId, lockedIds, statues, pathTargets }) => {
  const pathSegments = useMemo(
    () =>
      createPathGenerator({
        startPosition: { x: mainPathConfig.startX, y: mainPathConfig.startY },
        endPosition: { x: mainPathConfig.startX, y: mainPathConfig.endY },
        structures: pathTargets,
        tileSize: worldConfig.tileSize,
      }).generatePath(),
    [pathTargets]
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
      <div className="structure-container">
        {statues.map((tech) => (
          <Structure key={tech.id} data={tech} type="technology" isNearby={false} />
        ))}
      </div>
      <div className="structure-container">
        {treesEnvironments.map((environment, index) => (
          <Environment key={index} environment={environment} size={256} />
        ))}
      </div>
      <div className="structure-container">
        {detailsEnvironments.map((environment, index) => (
          <Environment key={index} environment={environment} size={128} />
        ))}
      </div>
    </>
  );
});

const StoryMapPage: React.FC = () => {
  const navigate = useNavigate();
  const unlockedChapterIndex = useSelector((state: RootState) => state.story.unlockedChapterIndex);
  const chapters = useSelector((state: RootState) => state.story.chapters);
  const discoveriesSeen = useSelector((state: RootState) => state.story.discoveriesSeen);
  const dispatch = useDispatch<AppDispatch>();
  const [exiting, setExiting] = useState(false);
  const { resetAll } = useDebugReset();

  const activeChapter = storyChapterOrder[unlockedChapterIndex];
  const quests = useMemo(() => chapterQuests(unlockedChapterIndex, chapters), [unlockedChapterIndex, chapters]);
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

  // Technologies of the finished chapters: on the map, and announced one by one
  // until each "unlocked" window has been confirmed.
  const statues = useMemo(() => unlockedTechnologies(chapters), [chapters]);
  const solidStructures = useMemo(() => [...companies, ...statues], [statues]);
  const discovery = statues.find((t) => !(discoveriesSeen ?? []).includes(t.id));
  const discoveriesLeft = statues.filter((t) => !(discoveriesSeen ?? []).includes(t.id)).length - 1;
  const discoveryTech = discovery?.data as TechnologyData | undefined;
  const discoveryPopup = discovery && discoveryTech && (
    <UnlockPopup
      kicker="New technology unlocked!"
      image={discoveryTech.image}
      title={discoveryTech.name}
      subtitle={discoveryTech.category}
      text={discoveryTech.learnedText ?? discoveryTech.description ?? ''}
      note="Its statue now stands on the map."
      remaining={discoveriesLeft}
      onConfirm={() => dispatch(markDiscoverySeen(discovery.id))}
    />
  );

  const { playerPosition, isMoving, direction, handleJoystickMove, handleJoystickStop } = usePlayerMovement({
    initialPosition: playerSpawnPosition,
    speed: 270,
    worldBounds,
    structures: solidStructures,
    environments,
    playerHitbox,
    canMove: !exiting && !discovery,
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
        {discoveryPopup}
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
          joystick={{ onMove: handleJoystickMove, onStop: handleJoystickStop, enabled: !discovery }}
          audio={{ src: storyMapAudioTrack, volume: 30 }}
          overlay={
            <div className="home-fixed-top-left">
              <HomeButton />
            </div>
          }
        >
          <MapWorld nearbyId={nearbyDoor?.id ?? null} lockedIds={lockedIds} statues={statues} pathTargets={solidStructures} />
          <Player position={playerPosition} isMoving={isMoving} direction={direction} />
        </GameScene>
        {discoveryPopup}
        {debugResetButton}
      </div>
    </div>
  );
};

export default StoryMapPage;
