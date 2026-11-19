import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { markDiscoverySeen } from '../../store/storySlice';
import { usePlayerMovement } from '../../game/hooks/usePlayerMovement';
import { useCollisionDetection } from '../../game/hooks/useCollisionDetection';
import { useLingering } from '../../game/hooks/useLingering';
import { useProximityTrigger } from './hooks/useProximityTrigger';
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
import SkillWindow from '../../components/Story/hud/SkillWindow';
import ItemInspector from '../../components/GameMenu/ItemInspector';
import { skillElapsed, skillEntry } from '../../components/GameMenu/useCollections';
import LoadingSplash from '../../components/Common/LoadingSplash';
import { useLoadingSplash } from '../../hooks/useLoadingSplash';
import { storyMapAssets } from '../../config/story/assets';
import { worldConfig, mainPathConfig, playerHitbox, playerSpawnPosition, terrainAutoRotate } from '../../config/world';
import { companies, technologies } from '../../config/career';
import { treesEnvironments, detailsEnvironments } from '../../config/environments';
import {
  chapterDisplayName,
  companyDisplayName,
  InDevelopmentRedirect,
  isTechnologyUnlocked,
  storyChapterOrder,
  storyMapAudioTrack,
} from '../../config/story/chapters';
import { MEEP_LAG_MS } from './sceneRules';
import { ChapterProgress } from '../../types/story';
import { StructureData, TechnologyData } from '../../types/sandbox';
import { chapterPath } from '../../config/routes';
import { COMPANY_IDS } from '../../config/ids';
import './StoryMapPage.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const MAP_PLAYER_SPEED = 270;
const BUILDING_REACH = 90;
const STATUE_REACH = 80;
const STATUE_HIDE_DELAY_MS = 50;
const ENTER_DELAY_MS = 500;

const isChapterToWrite = (company: StructureData) =>
  company.id !== COMPANY_IDS.futureOpportunity && !storyChapterOrder.some((c) => c.companyId === company.id);

const chapterQuests = (unlockedIndex: number): StoryObjective[] => {
  const written = storyChapterOrder.map((chapter) => ({
    id: chapter.companyId ?? chapter.id,
    name: chapterDisplayName(chapter.id),
  }));
  const toWrite = companies.filter(isChapterToWrite).map((co) => ({ id: co.id, name: companyDisplayName(co.name) }));

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

const environments = [...treesEnvironments, ...detailsEnvironments];

const unlockedTechnologies = (progress: Record<string, ChapterProgress>): StructureData[] =>
  technologies.filter((t) => isTechnologyUnlocked(t.data as TechnologyData, progress));

const worldBounds = {
  minX: 50,
  minY: 50,
  maxX: worldConfig.width - 50,
  maxY: worldConfig.height - 50,
};

interface MapWorldProps {
  nearbyId: string | null;
  lockedIds: string[];
  statues: StructureData[];
  pathTargets: StructureData[];
}

// re-renders only when the nearby door or the unlocked statues change
const MapWorld: React.FC<MapWorldProps> = ({ nearbyId, lockedIds, statues, pathTargets }) => {
  const pathSegments = createPathGenerator({
        startPosition: { x: mainPathConfig.startX, y: mainPathConfig.startY },
        endPosition: { x: mainPathConfig.startX, y: mainPathConfig.endY },
        structures: pathTargets,
        tileSize: worldConfig.tileSize,
      }).generatePath();

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
};

const StoryMapPage: React.FC = () => {
  const navigate = useNavigate();
  const unlockedChapterIndex = useAppSelector((state) => state.story.unlockedChapterIndex);
  const chapters = useAppSelector((state) => state.story.chapters);
  const discoveriesSeen = useAppSelector((state) => state.story.discoveriesSeen);
  const startedAt = useAppSelector((state) => state.story.startedAt);
  const timeline = useAppSelector((state) => state.story.timeline);
  const dispatch = useAppDispatch();
  const [exiting, setExiting] = useState(false);
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
  const quests = chapterQuests(unlockedChapterIndex);
  const lockedIds = useMemo(() => {
    const open = new Set(quests.filter((q) => !q.locked).map((q) => q.id));
    return companies.filter((c) => !open.has(c.id)).map((c) => c.id);
  }, [quests]);

  // a chapter without a building (the Prologue) plays on its own map: go there until its last scene is seen
  const unfinishedStandalone = storyChapterOrder.find((chapter, i) => {
    if (chapter.companyId) return false;
    const isCurrent = i === unlockedChapterIndex;
    const lastSceneUnseen = !!chapter.endFlag && !chapters[chapter.id]?.flags[chapter.endFlag];
    return isCurrent || lastSceneUnseen;
  });
  useEffect(() => {
    if (unfinishedStandalone) {
      void navigate(chapterPath(unfinishedStandalone.id), { replace: true });
    }
  }, [unfinishedStandalone, navigate]);

  const activeCompany = (activeChapter?.companyId ? companies.find((c) => c.id === activeChapter.companyId) : undefined);

  const statues = unlockedTechnologies(chapters);
  const mapAssets = storyMapAssets(statues);
  const splash = useLoadingSplash(mapAssets);
  const splashCovering = splash.visible && !splash.leaving;
  const solidStructures = [...companies, ...statues];
  const newDiscoveries = statues.filter((t) => !(discoveriesSeen ?? []).includes(t.id));
  const discovery = newDiscoveries[0];
  const discoveriesLeft = newDiscoveries.length - 1;
  const discoveryTech = discovery?.data as TechnologyData | undefined;
  const [inspecting, setInspecting] = useState(false);
  const discoveryPopup = discovery && discoveryTech && (
    <UnlockPopup
      kicker="New technology unlocked!"
      image={discoveryTech.image}
      title={discoveryTech.name}
      subtitle={discoveryTech.category}
      text={discoveryTech.learnedText ?? discoveryTech.description ?? ''}
      note="Its statue now stands on the map."
      rarity={discoveryTech.rarity}
      elapsedMs={skillElapsed(discoveryTech, { startedAt, timeline })}
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
    canMove: !exiting && !discovery && !inDevelopmentOpen && !menuOpen && !splashCovering && !inspecting,
  });

  const meepPosition = useLaggedPosition(playerPosition, MEEP_LAG_MS);

  const doorCollidable = (activeCompany ? [activeCompany] : []);

  const { nearbyStructure: nearbyDoor } = useCollisionDetection({
    playerPosition,
    structures: doorCollidable,
    interactionRadius: BUILDING_REACH,
  });

  // once per walk-up: the "in development" window, or the way into the chapter
  useProximityTrigger({
    nearbyId: nearbyDoor?.id ?? null,
    enabled: !!activeChapter && !exiting,
    canOpen: () => true,
    onOpen: () => (activeChapter?.inDevelopment ? setInDevelopmentOpen(true) : setExiting(true)),
  });

  useEffect(() => {
    if (!exiting || !activeChapter) return;
    const timer = setTimeout(() => navigate(chapterPath(activeChapter.id)), ENTER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [exiting, activeChapter, navigate]);

  const { nearbyStructure: nearbyStatue } = useCollisionDetection({
    playerPosition,
    structures: statues,
    interactionRadius: STATUE_REACH,
  });

  const shownStatue = useLingering(nearbyStatue, STATUE_HIDE_DELAY_MS);

  const shownSkill = shownStatue?.data as TechnologyData | undefined;
  const skillVisible = !!shownSkill && !splash.visible && !menuOpen && !discovery && !inDevelopmentOpen;
  const shownEntry = shownSkill && skillEntry(shownSkill, true, skillElapsed(shownSkill, { startedAt, timeline }));
  const skillWindow = skillVisible && shownEntry && (
    <>
      <SkillWindow
        entry={shownEntry}
        chapterName={chapterDisplayName(shownSkill?.storyChapter ?? '')}
        onInspect={() => setInspecting(true)}
      />
      {inspecting && <ItemInspector entry={shownEntry} onClose={() => setInspecting(false)} />}
    </>
  );

  const inDevelopmentPopup = inDevelopmentOpen && (
    <InDevelopmentPopup chapterName={activeCompany ? companyDisplayName(activeCompany.name) : undefined} onClose={() => setInDevelopmentOpen(false)} />
  );

  const debugActions: DebugAction[] = [{ label: 'Reset story', tone: 'danger', onClick: resetAll }];

  if (unfinishedStandalone) {
    return null;
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
      {splash.visible && (
        <LoadingSplash title="The journey continues" leaving={splash.leaving} loaded={splash.loaded} total={splash.total} />
      )}
      <div className={`story-map-container${exiting ? ' exiting' : ''}`}>
        <StoryProgress objectives={quests} name="Chapters" />
        <GameScene
          name="story-map"
          world={worldConfig}
          playerPosition={playerPosition}
          joystick={{ onMove: handleJoystickMove, onStop: handleJoystickStop, enabled: !discovery && !menuOpen && !inspecting }}
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
        {!splash.visible && discoveryPopup}
        {!discovery && inDevelopmentPopup}
        {skillWindow}
      </div>
    </div>
  );
};

export default StoryMapPage;
