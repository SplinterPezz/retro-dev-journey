import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { markDiscoverySeen } from '../../store/storySlice';
import { usePlayerMovement } from '../../game/hooks/usePlayerMovement';
import { useCollisionDetection } from '../../game/hooks/useCollisionDetection';
import { useDebugReset } from '../../game/useDebugReset';
import { createPathGenerator } from '../../game/path/pathGeneration';
import GameScene from '../../game/GameScene';
import DebugToolbar, { DebugAction } from '../../game/DebugToolbar';
import TerrainRenderer from '../../components/Terrain/TerrainRenderer';
import PathRenderer from '../../components/Path/PathRenderer';
import Structure from '../../components/Structures/Structure';
import Environment from '../../components/Structures/Environment';
import Player from '../../components/Player/Player';
import Meep from '../../components/Companion/Meep';
import { useLaggedPosition } from '../../components/Companion/useLaggedPosition';
import MenuButton from '../../components/GameMenu/MenuButton';
import { useGameMenu } from '../../components/GameMenu/GameMenuContext';
import StoryProgress, { StoryObjective } from '../../components/Story/hud/StoryProgress';
import UnlockPopup from '../../components/Story/hud/UnlockPopup';
import InDevelopmentPopup from '../../components/Story/hud/InDevelopmentPopup';
import { worldConfig, mainPathConfig, playerHitbox, playerSpawnPosition, terrainAutoRotate } from '../../config/world';
import { companies, technologies } from '../../config/career';
import { treesEnvironments, detailsEnvironments } from '../../config/environments';
import { ChapterMeta, InDevelopmentRedirect, isChapterFinished, storyChapterOrder, storyMapAudioTrack } from '../../config/story/chapters';
import { MEEP_LAG_MS } from './sceneRules';
import { ChapterProgress } from '../../types/story';
import { StructureData, TechnologyData } from '../../types/sandbox';
import { chapterPath } from '../../config/routes';
import { COMPANY_IDS } from '../../config/ids';
import './StoryMapPage.css';

const MAP_PLAYER_SPEED = 270; // a little faster than in the chapters: the map is big
const BUILDING_REACH = 90; // walking this close to the current chapter's building enters it
const ENTER_DELAY_MS = 500; // a beat between reaching the building and the chapter loading

// "Eikony (IT)" -> "Eikony"
const chapterName = (companyName: string) => companyName.replace(/ \(IT\)$/, '');

const companyOf = (chapter: ChapterMeta) => companies.find((co) => co.id === chapter.companyId);

// A company building that has no chapter yet (the "???" teaser is never one).
const isChapterToWrite = (company: StructureData) =>
  company.id !== COMPANY_IDS.futureOpportunity && !storyChapterOrder.some((c) => c.companyId === company.id);

// Every chapter of the story, in order: the playable ones, then the companies
// still to be written. Done before the current one, locked after it.
const chapterQuests = (unlockedIndex: number): StoryObjective[] => {
  const written = storyChapterOrder.map((chapter) => {
    const company = companyOf(chapter);
    return { id: company?.id ?? chapter.id, name: company ? chapterName(company.name) : chapter.name ?? chapter.id };
  });
  const toWrite = companies.filter(isChapterToWrite).map((co) => ({ id: co.id, name: chapterName(co.name) }));

  return [...written, ...toWrite].map((quest, i) => {
    const isCurrent = i === unlockedIndex && i < written.length;
    return {
      id: quest.id,
      label: isCurrent ? `Walk to ${quest.name}` : quest.name,
      done: i < unlockedIndex,
      locked: !isCurrent && i >= unlockedIndex,
    };
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
  // "still in development": opened by walking into a chapter that isn't ready,
  // or when its URL sent the player back here
  const location = useLocation();
  const [inDevelopmentOpen, setInDevelopmentOpen] = useState(
    () => !!(location.state as InDevelopmentRedirect | null)?.inDevelopment
  );
  // read once: drop it from the history entry, so a reload doesn't open it again
  useEffect(() => {
    if (location.state) void navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);
  const { resetAll } = useDebugReset();
  const { isOpen: menuOpen } = useGameMenu();

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
  const unfinishedStandalone = storyChapterOrder.find((chapter, i) => {
    if (chapter.companyId) return false; // it has a building: entered from the map
    const isCurrent = i === unlockedChapterIndex;
    const lastSceneUnseen = !!chapter.endFlag && !chapters[chapter.id]?.flags[chapter.endFlag];
    return isCurrent || lastSceneUnseen;
  });
  useEffect(() => {
    if (unfinishedStandalone) {
      void navigate(chapterPath(unfinishedStandalone.id), { replace: true });
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
  const newDiscoveries = statues.filter((t) => !(discoveriesSeen ?? []).includes(t.id));
  const discovery = newDiscoveries[0];
  const discoveriesLeft = newDiscoveries.length - 1;
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
    speed: MAP_PLAYER_SPEED,
    worldBounds,
    structures: solidStructures,
    environments,
    playerHitbox,
    canMove: !exiting && !discovery && !inDevelopmentOpen && !menuOpen,
  });

  // Meep, the mascot, follows the player on the map too, as in the chapters.
  const meepPosition = useLaggedPosition(playerPosition, MEEP_LAG_MS);

  const doorCollidable = useMemo(() => (activeCompany ? [activeCompany] : []), [activeCompany]);

  const { nearbyStructure: nearbyDoor } = useCollisionDetection({
    playerPosition,
    structures: doorCollidable,
    interactionRadius: BUILDING_REACH,
  });

  // A chapter that isn't ready opens the window once per walk-up instead.
  const [shownAtDoor, setShownAtDoor] = useState(false);
  useEffect(() => {
    if (!nearbyDoor) {
      setShownAtDoor(false);
      return;
    }
    if (!activeChapter || exiting) return;
    if (activeChapter.inDevelopment) {
      if (!shownAtDoor) {
        setShownAtDoor(true);
        setInDevelopmentOpen(true);
      }
      return;
    }
    setExiting(true);
    const timer = setTimeout(() => navigate(chapterPath(activeChapter.id)), ENTER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [nearbyDoor, activeChapter, exiting, shownAtDoor, navigate]);

  const inDevelopmentPopup = inDevelopmentOpen && (
    <InDevelopmentPopup chapterName={activeCompany ? chapterName(activeCompany.name) : undefined} onClose={() => setInDevelopmentOpen(false)} />
  );

  const debugActions: DebugAction[] = [{ label: 'Reset story', tone: 'danger', onClick: resetAll }];

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
            <MenuButton withMusic={false} />
          </div>
        </div>
        {discoveryPopup}
        <DebugToolbar actions={debugActions} />
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
          joystick={{ onMove: handleJoystickMove, onStop: handleJoystickStop, enabled: !discovery && !menuOpen }}
          music={storyMapAudioTrack}
          playerHitbox={playerHitbox}
          debugActions={debugActions}
          overlay={
            <div className="menu-fixed-top-left">
              <MenuButton />
            </div>
          }
        >
          <MapWorld nearbyId={nearbyDoor?.id ?? null} lockedIds={lockedIds} statues={statues} pathTargets={solidStructures} />
          <Meep position={meepPosition} />
          <Player position={playerPosition} isMoving={isMoving} direction={direction} />
        </GameScene>
        {discoveryPopup}
        {!discovery && inDevelopmentPopup}
      </div>
    </div>
  );
};

export default StoryMapPage;
