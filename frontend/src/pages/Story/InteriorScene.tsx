import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { setFlag, recordScore } from '../../store/storySlice';
import { usePlayerMovement } from '../../game/hooks/usePlayerMovement';
import { useCollisionDetection } from '../../game/hooks/useCollisionDetection';
import { useNpcPatrol, NpcPatrolState } from '../../game/hooks/useNpcPatrol';
import { useDebugReset } from '../../game/useDebugReset';
import { useResourceLoader } from '../../hooks/useResourceLoader';
import GameScene from '../../game/GameScene';
import DebugOverlay from '../../game/DebugOverlay';
import { CollidableEntity, Hitbox, Position } from '../../types/game';
import { StoryChapterConfig, StoryNpcData, QuizData, MiniGameMarker } from '../../types/story';
import { tierFor } from '../../config/story/miniGames';
import Player from '../../components/Player/Player';
import TerrainRenderer from '../../components/Terrain/TerrainRenderer';
import Environment from '../../components/Structures/Environment';
import HomeButton from '../../components/Common/HomeButton';
import InteriorNpc from '../../components/Story/world/InteriorNpc';
import BobbingProp from '../../components/Story/world/BobbingProp';
import PortraitDialogueBox from '../../components/Story/dialogue/PortraitDialogueBox';
import QuizPopup from '../../components/Story/quiz/QuizPopup';
import QuizMarker from '../../components/Story/quiz/QuizMarker';
import MiniGamesPopup from '../../components/Story/minigames/MiniGamesPopup';
import StoryProgress from '../../components/Story/hud/StoryProgress';
import Meep from '../../components/Companion/Meep';
import MeepBubble from '../../components/Companion/MeepBubble';
import { useLaggedPosition } from '../../components/Companion/useLaggedPosition';
import { useProximityTrigger } from './hooks/useProximityTrigger';
import { useDialogueEngine } from './hooks/useDialogueEngine';
import { useChapterProgress } from './hooks/useChapterProgress';
import { useMeepBeats } from './hooks/useMeepBeats';
import { useChapterOutro } from './hooks/useChapterOutro';
import { entryNodeId } from './dialogue';
import { playerSpawnPosition as defaultSpawn } from '../../config/world';
import { chapterAssets, doorImage } from '../../config/story/assets';
import { isDev } from '../../config/env';
import './InteriorScene.css';

interface InteriorSceneProps {
  chapter: StoryChapterConfig;
  nextUnlockIndex: number;
  introPending?: boolean; // true while an intro cutscene plays on top - freezes movement and proximity triggers
}

type Flags = Record<string, boolean>;

const EMPTY_FLAGS: Flags = {};

// The splash stays up at least this long, then until the sprites are loaded
// (or the cap runs out, so a broken network never hides the scene for good).
const SPLASH_MIN_MS = 2600;
const SPLASH_MAX_MS = 15000;
const SPLASH_FADE_MS = 900;

const toCollidable = (id: string, position: Position, interactionRadius?: number, collisionHitbox?: Hitbox): CollidableEntity => ({
  id,
  position,
  interactionRadius,
  data: { collisionHitbox },
});

// Where an NPC stands right now: at its seat once seated, otherwise on its patrol.
const isSeatedNpc = (npc: StoryNpcData, flags: Flags): boolean => !!npc.seatedFlag && !!flags[npc.seatedFlag];

const npcStandingPosition = (npc: StoryNpcData, flags: Flags, live?: Position): Position =>
  isSeatedNpc(npc, flags) && npc.seatedPosition ? npc.seatedPosition : live ?? npc.position;

interface RoomProps {
  chapter: StoryChapterConfig;
  flags: Flags;
}

// Floor, door, furniture and quiz markers: re-rendered only when the flags
// change (props and markers appear with them), never on a player step.
const Room: React.FC<RoomProps> = React.memo(({ chapter, flags }) => {
  const door = useMemo(() => ({ image: doorImage, position: chapter.doorPosition }), [chapter.doorPosition]);
  return (
    <>
      <TerrainRenderer worldConfig={chapter.worldConfig} autoRotate={false} terrainImage={chapter.floorImage} />
      <div className="structure-container">
        <Environment environment={door} size={128} />
      </div>
      <div className="structure-container">
        {chapter.props
          .filter((prop) => (!prop.visibleWhenFlag || flags[prop.visibleWhenFlag]) && !(prop.hiddenWhenFlag && flags[prop.hiddenWhenFlag]))
          .map((prop) =>
            prop.visibleWhenFlag ? (
              <BobbingProp key={prop.id} prop={prop} />
            ) : (
              <Environment key={prop.id} environment={prop} size={128} />
            )
          )}
      </div>
      {chapter.quizzes
        .filter((quiz) => !quiz.requiredFlag || flags[quiz.requiredFlag])
        .map((quiz) => (
          <QuizMarker key={quiz.id} position={quiz.position} />
        ))}
    </>
  );
});

interface SceneDebugProps {
  chapter: StoryChapterConfig;
  flags: Flags;
  npcStates: Record<string, NpcPatrolState>;
  playerPosition: Position;
  playerHitbox: Hitbox;
}

// Walk-up zones (dashed circles), collision boxes and the picture box of
// flag-gated visual props. Development builds only.
const SceneDebug: React.FC<SceneDebugProps> = ({ chapter, flags, npcStates, playerPosition, playerHitbox }) => (
  <DebugOverlay
    player={{ id: 'player', position: playerPosition, hitbox: playerHitbox }}
    zones={[
      ...chapter.quizzes.map((q) => ({ id: q.id, position: q.position, radius: q.interactionRadius ?? 70 })),
      ...(chapter.miniGames ?? []).map((m) => ({ id: m.id, position: m.position, radius: m.interactionRadius ?? 70 })),
      ...chapter.npcs.map((n) => ({
        id: n.id,
        position: npcStandingPosition(n, flags, npcStates[n.id]?.position),
        radius: n.interactionRadius ?? 50,
      })),
    ]}
    rects={chapter.props
      .filter((p) => p.visibleWhenFlag && p.imageSize)
      .map((p) => ({ id: p.id, position: p.position, width: p.imageSize!.width, height: p.imageSize!.height }))}
    hitboxes={[...chapter.props, ...chapter.npcs].flatMap((item) =>
      item.collisionHitbox ? [{ id: item.id, position: item.position, hitbox: item.collisionHitbox }] : []
    )}
  />
);

const InteriorScene: React.FC<InteriorSceneProps> = ({ chapter, nextUnlockIndex, introPending = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const chapterProgress = useSelector((state: RootState) => state.story.chapters[chapter.id]);
  const flags = chapterProgress?.flags ?? EMPTY_FLAGS;
  const completed = !!chapterProgress?.completed;
  const difficulty = useSelector((state: RootState) => state.story.difficulty) ?? 'junior';
  const { resetAll, resetCurrentChapter } = useDebugReset(chapter.id);

  const setChapterFlag = useCallback(
    (flag: string) => {
      dispatch(setFlag({ chapterId: chapter.id, flag }));
    },
    [dispatch, chapter.id]
  );

  const dialogue = useDialogueEngine(chapter.npcs, flags, setChapterFlag);
  const cueDialogue = dialogue.cue;
  const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null);
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameMarker | null>(null);
  const meep = useMeepBeats(chapter.meepBeats, flags, completed);

  const assets = useMemo(() => chapterAssets(chapter), [chapter]);
  const { isLoading: assetsLoading, loaded: assetsLoaded, total: assetsTotal } = useResourceLoader({ images: assets });
  const [splashMinElapsed, setSplashMinElapsed] = useState(false);
  const [splashTimedOut, setSplashTimedOut] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const splashLeaving = splashMinElapsed && (!assetsLoading || splashTimedOut);

  useEffect(() => {
    const minTimer = setTimeout(() => setSplashMinElapsed(true), SPLASH_MIN_MS);
    const maxTimer = setTimeout(() => setSplashTimedOut(true), SPLASH_MAX_MS);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  useEffect(() => {
    if (!splashLeaving) return;
    const timer = setTimeout(() => setSplashVisible(false), SPLASH_FADE_MS);
    return () => clearTimeout(timer);
  }, [splashLeaving]);

  // ---- collidable adapters: NPCs and props block, everything triggers by proximity ----
  const npcStates = useNpcPatrol(chapter.npcs, chapter.props, dialogue.active?.npc.id ?? null);
  const npcCollidables = useMemo(
    () =>
      chapter.npcs.map((npc) =>
        toCollidable(npc.id, npcStandingPosition(npc, flags, npcStates[npc.id]?.position), npc.interactionRadius ?? 50, npc.collisionHitbox)
      ),
    [chapter.npcs, npcStates, flags]
  );
  const quizCollidables = useMemo(
    () => chapter.quizzes.map((q) => toCollidable(q.id, q.position, q.interactionRadius ?? 70)),
    [chapter.quizzes]
  );
  const miniGameCollidables = useMemo(
    () => (chapter.miniGames ?? []).map((m) => toCollidable(m.id, m.position, m.interactionRadius ?? 70)),
    [chapter.miniGames]
  );
  const blockingProps = useMemo(
    () => chapter.props.map((p) => toCollidable(p.id, p.position, 0, p.collisionHitbox)),
    [chapter.props]
  );
  const allBlocking = useMemo(() => [...npcCollidables, ...blockingProps], [npcCollidables, blockingProps]);

  const worldBounds = useMemo(
    () => ({ minX: 40, minY: 40, maxX: chapter.worldConfig.width - 40, maxY: chapter.worldConfig.height - 40 }),
    [chapter.worldConfig]
  );

  // ---- closing scene: seats the player, so it hands over the teleport through a ref ----
  const navigate = useNavigate();
  const teleportRef = useRef<(position: Position) => void>(undefined);
  const seatPlayer = useCallback((position: Position) => teleportRef.current?.(position), []);
  const goToMap = useCallback(() => void navigate('/story'), [navigate]);
  const outro = useChapterOutro({
    outro: chapter.outro,
    flags,
    setFlag: setChapterFlag,
    ready: !splashVisible && !introPending,
    busy: !!dialogue.active || !!activeQuiz || !!activeMiniGame,
    npcs: chapter.npcs,
    cue: cueDialogue,
    seatPlayer,
    onEnd: goToMap,
  });
  // reloaded in the middle of the closing scene: back at the seat
  const outroSeat = chapter.outro && flags[chapter.outro.startedFlag] ? chapter.outro.playerPosition : undefined;

  const { playerPosition, isMoving, direction, playerHitbox, handleJoystickMove, handleJoystickStop, teleport } = usePlayerMovement({
    initialPosition: outroSeat ?? chapter.playerSpawn ?? defaultSpawn,
    speed: 220,
    worldBounds,
    structures: allBlocking,
    canMove: !introPending && !activeQuiz && !activeMiniGame && !outro.active,
  });

  teleportRef.current = teleport;

  const meepPosition = useLaggedPosition(playerPosition, 450);

  const { nearbyStructure: nearbyNpc } = useCollisionDetection({ playerPosition, structures: npcCollidables, interactionRadius: 50 });
  const { nearbyStructure: nearbyQuiz } = useCollisionDetection({ playerPosition, structures: quizCollidables, interactionRadius: 70 });
  const { nearbyStructure: nearbyMiniGame } = useCollisionDetection({ playerPosition, structures: miniGameCollidables, interactionRadius: 70 });

  const popupOpen = !!dialogue.active || !!activeQuiz || !!activeMiniGame;
  const isUnlocked = (requiredFlag?: string) => !requiredFlag || !!flags[requiredFlag];

  // ---- walk-up triggers ----

  // NPC: opens its dialogue; walking away closes it (a cued dialogue stays).
  useProximityTrigger({
    nearbyId: nearbyNpc?.id ?? null,
    enabled: !introPending && !outro.active,
    canOpen: (id) => !dialogue.active && !activeQuiz && isUnlocked(chapter.npcs.find((n) => n.id === id)?.requiredFlag),
    onOpen: (id) => {
      const npc = chapter.npcs.find((n) => n.id === id);
      if (npc) dialogue.open(npc, entryNodeId(npc, flags));
    },
    onLeave: () => {
      if (dialogue.active && !dialogue.isCued) dialogue.close();
    },
  });

  // Quiz station: opens until completed; walking away closes it.
  useProximityTrigger({
    nearbyId: nearbyQuiz?.id ?? null,
    enabled: !introPending && !outro.active,
    canOpen: (id) => {
      const quiz = chapter.quizzes.find((q) => q.id === id);
      return !popupOpen && !!quiz && !flags[quiz.completionFlag] && isUnlocked(quiz.requiredFlag);
    },
    onOpen: (id) => setActiveQuiz(chapter.quizzes.find((q) => q.id === id) ?? null),
    onLeave: () => setActiveQuiz(null),
  });

  // End-of-day mini games at the laptop.
  useProximityTrigger({
    nearbyId: nearbyMiniGame?.id ?? null,
    enabled: !introPending && !outro.active,
    canOpen: (id) => {
      const marker = chapter.miniGames?.find((m) => m.id === id);
      return !popupOpen && !!marker && !flags[marker.completionFlag] && isUnlocked(marker.requiredFlag);
    },
    onOpen: (id) => setActiveMiniGame(chapter.miniGames?.find((m) => m.id === id) ?? null),
  });

  useChapterProgress({
    chapter,
    flags,
    completed,
    nextUnlockIndex,
    setFlag: setChapterFlag,
    canCue: !introPending && !popupOpen,
    onCue: dialogue.cue,
  });

  // ---- popup callbacks ----

  // Power button: leave the games without finishing; walking up again reopens them.
  const powerOffMiniGames = useCallback(() => setActiveMiniGame(null), []);

  const finishMiniGames = useCallback(
    (earned: number, max: number) => {
      if (activeMiniGame) {
        dispatch(recordScore({ chapterId: chapter.id, gameId: activeMiniGame.id, score: { earned, max } }));
        setChapterFlag(activeMiniGame.completionFlag);
        // someone in the room comments on the result
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

  const objectives = useMemo(
    () => chapter.objectives?.map((o) => ({ id: o.id, label: o.label, done: !!flags[o.flag] })),
    [chapter.objectives, flags]
  );

  return (
    <div className="rpgui-content">
      {splashVisible && (
        <div className={`chapter-splash${splashLeaving ? ' chapter-splash--leaving' : ''}`}>
          <h1 className="chapter-splash-title">{chapter.splashTitle ?? chapter.title}</h1>
          <div className="chapter-splash-loading" role="status">
            <span>{assetsLoaded}/{assetsTotal} Loading</span>
            <img src="/favicon.ico" alt="" className="chapter-splash-loading-icon" />
          </div>
        </div>
      )}
      {outro.curtain && (
        <div className={`chapter-splash chapter-splash--entering${outro.curtain.leaving ? ' chapter-splash--leaving' : ''}`}>
          {outro.curtain.subtitle && (
            <div className="chapter-splash-heading">
              <h1 className="chapter-splash-title">{chapter.splashTitle ?? chapter.title}</h1>
              <p className="chapter-splash-subtitle">{outro.curtain.subtitle}</p>
            </div>
          )}
        </div>
      )}
      <div className="interior-scene-container">
        {objectives && <StoryProgress objectives={objectives} />}
        <GameScene
          name="interior-scene"
          world={chapter.worldConfig}
          playerPosition={playerPosition}
          joystick={{ onMove: handleJoystickMove, onStop: handleJoystickStop, enabled: !introPending && !outro.active }}
          audio={chapter.audioTrack ? { src: chapter.audioTrack, volume: 30 } : undefined}
          overlay={
            <div className="home-fixed-top-left">
              <HomeButton />
            </div>
          }
        >
          <Room chapter={chapter} flags={flags} />

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
            <SceneDebug chapter={chapter} flags={flags} npcStates={npcStates} playerPosition={playerPosition} playerHitbox={playerHitbox} />
          )}
        </GameScene>

        {dialogue.active && dialogue.node && (
          <PortraitDialogueBox
            speakerName={dialogue.node.portrait ? dialogue.node.speaker : dialogue.active.npc.name}
            portraitImage={`${dialogue.node.portrait ?? dialogue.active.npc.spriteBase}_idle.gif`}
            text={dialogue.node.text}
            choices={dialogue.choices}
            onAdvance={dialogue.advance}
            onChoiceSelect={dialogue.selectChoice}
          />
        )}

        {activeMiniGame && (
          <MiniGamesPopup difficulty={difficulty} onFinish={finishMiniGames} onPowerOff={powerOffMiniGames} />
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

        {isDev && (
          <>
            <button type="button" className="story-debug-reset" onClick={resetAll}>
              Reset story
            </button>
            <button type="button" className="story-debug-reset story-debug-reset-chapter" onClick={resetCurrentChapter}>
              Reset Chapter
            </button>
            <div className="debug-coords">
              x: {Math.round(playerPosition.x)} y: {Math.round(playerPosition.y)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InteriorScene;
