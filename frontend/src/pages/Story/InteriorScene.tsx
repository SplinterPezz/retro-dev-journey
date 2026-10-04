import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { setFlag, recordScore } from '../../store/storySlice';
import { usePlayerMovement } from '../../game/hooks/usePlayerMovement';
import { useCollisionDetection } from '../../game/hooks/useCollisionDetection';
import { useNpcPatrol } from '../../game/hooks/useNpcPatrol';
import { useDebugReset } from '../../game/useDebugReset';
import GameScene from '../../game/GameScene';
import type { DebugAction } from '../../game/DebugToolbar';
import { CollidableEntity, Hitbox, Position } from '../../types/game';
import { StoryChapterConfig, QuizData, MiniGameMarker, StoryFlags } from '../../types/story';
import { tierFor } from '../../config/story/miniGames';
import Player from '../../components/Player/Player';
import MenuButton from '../../components/GameMenu/MenuButton';
import { useGameMenu } from '../../components/GameMenu/GameMenuContext';
import InteriorNpc from '../../components/Story/world/InteriorNpc';
import SideRoomView from '../../components/Story/world/SideRoomView';
import PortraitDialogueBox from '../../components/Story/dialogue/PortraitDialogueBox';
import QuizPopup from '../../components/Story/quiz/QuizPopup';
import MiniGamesPopup from '../../components/Story/minigames/MiniGamesPopup';
import StoryProgress from '../../components/Story/hud/StoryProgress';
import UnlockPopup from '../../components/Story/hud/UnlockPopup';
import CollectibleItem from '../../components/Story/collectibles/CollectibleItem';
import CollectibleCounter from '../../components/Story/collectibles/CollectibleCounter';
import Meep from '../../components/Companion/Meep';
import MeepBubble from '../../components/Companion/MeepBubble';
import { useLaggedPosition } from '../../components/Companion/useLaggedPosition';
import { useProximityTrigger } from './hooks/useProximityTrigger';
import { useDialogueEngine } from './hooks/useDialogueEngine';
import { useChapterProgress } from './hooks/useChapterProgress';
import { useMeepBeats } from './hooks/useMeepBeats';
import { useChapterOutro } from './hooks/useChapterOutro';
import { useLoadingSplash } from '../../hooks/useLoadingSplash';
import { useCollectibles } from './hooks/useCollectibles';
import { useCollectiblePopups } from './hooks/useCollectiblePopups';
import { entryNodeId } from './dialogue';
import Room from './Room';
import SceneDebug from './SceneDebug';
import {
  DEFAULT_NPC_REACH,
  DEFAULT_STATION_REACH,
  DOOR_TRIGGER_ID,
  EXIT_OBJECTIVE_ID,
  MEEP_LAG_MS,
  PLAYER_SPEED,
  isAtExitDoor,
  isSeatedNpc,
  isUnlocked,
  litSideRoomId,
  npcStandingPosition,
  walkableWorld,
} from './sceneRules';
import { playerSpawnPosition as defaultSpawn } from '../../config/world';
import LoadingSplash from '../../components/Common/LoadingSplash';
import { chapterAssets } from '../../config/story/assets';
import { chapterCollectibles, collectibleCheer, collectibleIcon } from '../../config/story/collectibles';
import { DEFAULT_DIFFICULTY } from '../../config/story/difficulty';
import { npcSprite } from '../../config/story/sprites';
import { isDev } from '../../config/env';
import { ROUTES } from '../../config/routes';
import './InteriorScene.css';

interface InteriorSceneProps {
  chapter: StoryChapterConfig;
  nextUnlockIndex: number;
  introPending?: boolean;
}

const EMPTY_FLAGS: StoryFlags = {};
const EMPTY_LIST: string[] = [];

const toCollidable = (id: string, position: Position, interactionRadius?: number, collisionHitbox?: Hitbox): CollidableEntity => ({
  id,
  position,
  interactionRadius,
  data: { collisionHitbox },
});

const InteriorScene: React.FC<InteriorSceneProps> = ({ chapter, nextUnlockIndex, introPending = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const chapterProgress = useSelector((state: RootState) => state.story.chapters[chapter.id]);
  const flags = chapterProgress?.flags ?? EMPTY_FLAGS;
  const completed = !!chapterProgress?.completed;
  const foundIds = chapterProgress?.collectibles ?? EMPTY_LIST;
  const difficulty = useSelector((state: RootState) => state.story.difficulty) ?? DEFAULT_DIFFICULTY;
  const setChapterFlag = useCallback(
    (flag: string) => {
      dispatch(setFlag({ chapterId: chapter.id, flag }));
    },
    [dispatch, chapter.id]
  );
  const { resetAll, resetCurrentChapter, completeCurrentChapter } = useDebugReset(chapter.id);

  const dialogue = useDialogueEngine(chapter.npcs, flags, setChapterFlag);
  const cueDialogue = dialogue.cue;
  const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null);
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameMarker | null>(null);
  const collectibles = chapterCollectibles[chapter.id];
  const collectiblesTotal = collectibles?.items.length ?? 0;
  const found = useCollectiblePopups({ chapterId: chapter.id, flags, setFlag: setChapterFlag, foundCount: foundIds.length, total: collectiblesTotal });
  const meep = useMeepBeats(chapter.meepBeats, flags, completed);
  const sprites = useMemo(() => chapterAssets(chapter), [chapter]);
  const splash = useLoadingSplash(sprites);

  const popupOpen = !!dialogue.active || !!activeQuiz || !!activeMiniGame || found.isOpen;
  const { isOpen: menuOpen } = useGameMenu();

  const teleportRef = useRef<(position: Position) => void>(undefined);
  const seatPlayer = useCallback((position: Position) => teleportRef.current?.(position), []);
  const goToMap = useCallback(() => void navigate(ROUTES.storyMap), [navigate]);
  const outro = useChapterOutro({
    outro: chapter.outro,
    flags,
    setFlag: setChapterFlag,
    ready: !splash.visible && !introPending,
    busy: popupOpen || menuOpen,
    npcs: chapter.npcs,
    cue: cueDialogue,
    seatPlayer,
    onEnd: goToMap,
  });
  const triggersEnabled = !introPending && !outro.active && !menuOpen;

  const npcStates = useNpcPatrol(chapter.npcs, chapter.props, dialogue.active?.npc.id ?? null);
  const npcCollidables = useMemo(
    () =>
      chapter.npcs.map((npc) =>
        toCollidable(npc.id, npcStandingPosition(npc, flags, npcStates[npc.id]?.position), npc.interactionRadius ?? DEFAULT_NPC_REACH, npc.collisionHitbox)
      ),
    [chapter.npcs, npcStates, flags]
  );
  const quizCollidables = useMemo(
    () => chapter.quizzes.map((q) => toCollidable(q.id, q.position, q.interactionRadius ?? DEFAULT_STATION_REACH)),
    [chapter.quizzes]
  );
  const miniGameCollidables = useMemo(
    () => (chapter.miniGames ?? []).map((m) => toCollidable(m.id, m.position, m.interactionRadius ?? DEFAULT_STATION_REACH)),
    [chapter.miniGames]
  );
  const blockers = useMemo(
    () => [...npcCollidables, ...chapter.props.map((p) => toCollidable(p.id, p.position, 0, p.collisionHitbox))],
    [npcCollidables, chapter.props]
  );
  const { worldBounds, walkableAreas } = useMemo(() => walkableWorld(chapter, collectibles?.secretPaths), [chapter, collectibles]);

  // reloaded in the middle of the closing scene: back at the seat
  const outroSeat = chapter.outro && flags[chapter.outro.startedFlag] ? chapter.outro.playerPosition : undefined;
  const { playerPosition, isMoving, direction, playerHitbox, handleJoystickMove, handleJoystickStop, teleport } = usePlayerMovement({
    initialPosition: outroSeat ?? chapter.playerSpawn ?? defaultSpawn,
    speed: PLAYER_SPEED,
    worldBounds,
    structures: blockers,
    canMove: !introPending && !activeQuiz && !activeMiniGame && !outro.active && !found.isOpen && !menuOpen,
    areas: walkableAreas,
  });
  teleportRef.current = teleport;

  const meepPosition = useLaggedPosition(playerPosition, MEEP_LAG_MS);
  const litRoomId = litSideRoomId(chapter.sideRooms, playerPosition);

  const { onMap: collectiblesOnMap } = useCollectibles({
    collectibles,
    found: foundIds,
    flags,
    setFlag: setChapterFlag,
    playerPosition,
    isMoving,
    enabled: !popupOpen && !introPending && !splash.visible && !outro.active && !menuOpen,
    onFind: found.onFind,
  });

  const { nearbyStructure: nearbyNpc } = useCollisionDetection({ playerPosition, structures: npcCollidables, interactionRadius: DEFAULT_NPC_REACH });
  const { nearbyStructure: nearbyQuiz } = useCollisionDetection({ playerPosition, structures: quizCollidables, interactionRadius: DEFAULT_STATION_REACH });
  const { nearbyStructure: nearbyMiniGame } = useCollisionDetection({ playerPosition, structures: miniGameCollidables, interactionRadius: DEFAULT_STATION_REACH });
  const findNpc = (id: string) => chapter.npcs.find((n) => n.id === id);
  const findQuiz = (id: string) => chapter.quizzes.find((q) => q.id === id);
  const findMiniGame = (id: string) => chapter.miniGames?.find((m) => m.id === id);

  useProximityTrigger({
    nearbyId: nearbyNpc?.id ?? null,
    enabled: triggersEnabled,
    canOpen: (id) => !dialogue.active && !activeQuiz && isUnlocked(flags, findNpc(id)?.requiredFlag),
    onOpen: (id) => {
      const npc = findNpc(id);
      if (npc) dialogue.open(npc, entryNodeId(npc, flags));
    },
    onLeave: () => {
      if (dialogue.active && !dialogue.isCued) dialogue.close();
    },
  });

  useProximityTrigger({
    nearbyId: nearbyQuiz?.id ?? null,
    enabled: triggersEnabled,
    canOpen: (id) => {
      const quiz = findQuiz(id);
      return !popupOpen && !!quiz && !flags[quiz.completionFlag] && isUnlocked(flags, quiz.requiredFlag);
    },
    onOpen: (id) => setActiveQuiz(findQuiz(id) ?? null),
    onLeave: () => setActiveQuiz(null),
  });

  useProximityTrigger({
    nearbyId: nearbyMiniGame?.id ?? null,
    enabled: triggersEnabled,
    canOpen: (id) => {
      const marker = findMiniGame(id);
      return !popupOpen && !!marker && !flags[marker.completionFlag] && isUnlocked(flags, marker.requiredFlag);
    },
    onOpen: (id) => setActiveMiniGame(findMiniGame(id) ?? null),
  });

  useProximityTrigger({
    nearbyId: chapter.outro && isAtExitDoor(chapter, playerPosition) ? DOOR_TRIGGER_ID : null,
    enabled: triggersEnabled,
    canOpen: () => !popupOpen,
    onOpen: () => {
      if (!chapter.outro) return;
      if (outro.ended) outro.leave();
      else meep.say(chapter.outro.exitBlockedLine);
    },
  });

  useChapterProgress({
    chapter,
    flags,
    completed,
    nextUnlockIndex,
    setFlag: setChapterFlag,
    canCue: !introPending && !popupOpen && !splash.visible && !menuOpen,
    onCue: cueDialogue,
  });

  const powerOffMiniGames = useCallback(() => setActiveMiniGame(null), []);

  const finishMiniGames = useCallback(
    (earned: number, max: number) => {
      if (activeMiniGame) {
        dispatch(recordScore({ chapterId: chapter.id, gameId: activeMiniGame.id, score: { earned, max } }));
        setChapterFlag(activeMiniGame.completionFlag);
        const results = activeMiniGame.resultsDialogue;
        const npc = results && chapter.npcs.find((n) => n.id === results.npcId);
        if (results && npc) cueDialogue(npc, results.nodes[tierFor(earned, max).id]);
      }
      setActiveMiniGame(null);
    },
    [activeMiniGame, chapter.id, chapter.npcs, dispatch, setChapterFlag, cueDialogue]
  );

  const handleQuizAllComplete = useCallback(() => {
    if (activeQuiz) setChapterFlag(activeQuiz.completionFlag);
    setActiveQuiz(null);
  }, [activeQuiz, setChapterFlag]);

  const handleQuizClose = useCallback(() => setActiveQuiz(null), []);

  const exitObjective = outro.ended ? chapter.outro?.exitObjective : undefined;
  const objectives = useMemo(() => {
    const list = chapter.objectives?.map((o) => ({ id: o.id, label: o.label, done: !!flags[o.flag] }));
    return list && exitObjective ? [...list, { id: EXIT_OBJECTIVE_ID, label: exitObjective, done: false }] : list;
  }, [chapter.objectives, flags, exitObjective]);

  const chapterTitle = chapter.splashTitle ?? chapter.title;

  const debugActions: DebugAction[] = [
    { label: 'Complete Chapter', tone: 'success', onClick: () => completeCurrentChapter(chapter.completion.requiredFlags, nextUnlockIndex) },
    { label: 'Reset story', tone: 'danger', onClick: resetAll },
    { label: 'Reset Chapter', tone: 'warning', onClick: resetCurrentChapter },
  ];

  return (
    <div className="rpgui-content">
      {splash.visible && (
        <LoadingSplash title={chapterTitle} leaving={splash.leaving} loaded={splash.loaded} total={splash.total} />
      )}
      {outro.curtain && (
        <div className={`chapter-splash chapter-splash--entering${outro.curtain.leaving ? ' chapter-splash--leaving' : ''}`}>
          {outro.curtain.subtitle && (
            <div className="chapter-splash-heading">
              <h1 className="chapter-splash-title">{chapterTitle}</h1>
              <p className="chapter-splash-subtitle">{outro.curtain.subtitle}</p>
            </div>
          )}
        </div>
      )}
      <div className="interior-scene-container">
        {objectives && <StoryProgress objectives={objectives} />}
        {collectiblesTotal > 0 && <CollectibleCounter found={foundIds.length} total={collectiblesTotal} />}
        <GameScene
          name="interior-scene"
          world={chapter.worldConfig}
          playerPosition={playerPosition}
          joystick={{ onMove: handleJoystickMove, onStop: handleJoystickStop, enabled: triggersEnabled }}
          music={chapter.audioTrack}
          playerHitbox={playerHitbox}
          debugActions={debugActions}
          overlay={
            <div className="menu-fixed-top-left">
              <MenuButton />
            </div>
          }
        >
          <Room chapter={chapter} flags={flags} />
          {chapter.sideRooms?.map((room) => (
            <SideRoomView key={room.id} room={room} lit={litRoomId === room.id} />
          ))}
          {collectiblesOnMap.map(({ item, near }) => (
            <CollectibleItem key={item.id} item={item} near={near} />
          ))}

          {chapter.npcs.map((npc) => (
            <InteriorNpc
              key={npc.id}
              npc={npc}
              position={npcStandingPosition(npc, flags, npcStates[npc.id]?.position)}
              moving={isSeatedNpc(npc, flags) ? false : npcStates[npc.id]?.moving ?? false}
              direction={npcStates[npc.id]?.direction ?? 'S'}
              isNearby={nearbyNpc?.id === npc.id}
            />
          ))}

          <Meep position={meepPosition} />
          {meep.bubble && <MeepBubble text={meep.bubble} anchorPosition={meepPosition} onDismiss={meep.dismiss} />}

          <Player position={playerPosition} isMoving={isMoving} direction={direction} />

          {isDev && (
            <SceneDebug chapter={chapter} collectibles={collectibles} foundIds={foundIds} flags={flags} npcStates={npcStates} />
          )}
        </GameScene>

        {dialogue.active && dialogue.node && (
          <PortraitDialogueBox
            speakerName={dialogue.node.portrait ? dialogue.node.speaker : dialogue.active.npc.name}
            portraitImage={npcSprite(dialogue.node.portrait ?? dialogue.active.npc.spriteBase, 'idle')}
            text={dialogue.node.text}
            voiceKey={dialogue.node.speaker}
            choices={dialogue.choices}
            onAdvance={dialogue.advance}
            onChoiceSelect={dialogue.selectChoice}
          />
        )}

        {activeMiniGame && (
          <MiniGamesPopup difficulty={difficulty} onFinish={finishMiniGames} onPowerOff={powerOffMiniGames} />
        )}
        {found.current && (
          <UnlockPopup
            kicker="Collectible found!"
            image={found.current.image}
            title={found.current.name}
            subtitle={`${found.currentNumber} / ${collectiblesTotal}`}
            text={found.current.description}
            cornerImage={collectibleCheer}
            rarity={found.current.rarity}
            remaining={found.remaining}
            onConfirm={found.confirmFound}
          />
        )}
        {found.loreOpen && collectibles && (
          <UnlockPopup
            kicker="All collectibles found!"
            image={collectibleIcon}
            title={`${collectiblesTotal} / ${collectiblesTotal}`}
            text={collectibles.allFoundText}
            cornerImage={collectibleCheer}
            remaining={0}
            onConfirm={found.confirmLore}
          />
        )}
        {activeQuiz && (
          <QuizPopup
            quiz={activeQuiz}
            flags={flags}
            difficulty={difficulty}
            onSetFlag={setChapterFlag}
            onAllComplete={handleQuizAllComplete}
            onClose={handleQuizClose}
          />
        )}
      </div>
    </div>
  );
};

export default InteriorScene;
