import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { setFlag, recordScore } from '../../store/storySlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { usePlayerMovement } from '../../game/hooks/usePlayerMovement';
import { useNpcPatrol } from '../../game/hooks/useNpcPatrol';
import { useDebugReset } from '../../game/useDebugReset';
import GameScene from '../../game/GameScene';
import type { DebugAction } from '../../game/DebugToolbar';
import { Position } from '../../types/game';
import { StoryChapterConfig, QuizData, MiniGameMarker, StoryFlags } from '../../types/story';
import { tierFor } from '../../config/story/miniGames';
import Player from '../../components/Player/Player';
import MenuButton from '../../components/GameMenu/MenuButton';
import { useGameMenu } from '../../components/GameMenu/GameMenuContext';
import LoadingSplash from '../../components/Common/LoadingSplash';
import InteriorNpc from '../../components/Story/world/InteriorNpc';
import SideRoomView from '../../components/Story/world/SideRoomView';
import PortraitDialogueBox from '../../components/Story/dialogue/PortraitDialogueBox';
import QuizPopup from '../../components/Story/quiz/QuizPopup';
import MiniGamesPopup from '../../components/Story/minigames/MiniGamesPopup';
import StoryProgress from '../../components/Story/hud/StoryProgress';
import ChapterCurtain from '../../components/Story/hud/ChapterCurtain';
import CollectibleItem from '../../components/Story/collectibles/CollectibleItem';
import CollectibleCounter from '../../components/Story/collectibles/CollectibleCounter';
import CollectiblePopups from '../../components/Story/collectibles/CollectiblePopups';
import Meep from '../../components/Companion/Meep';
import MeepBubble from '../../components/Companion/MeepBubble';
import { useLaggedPosition } from '../../components/Companion/useLaggedPosition';
import { useLoadingSplash } from '../../hooks/useLoadingSplash';
import { useDialogueEngine } from './hooks/useDialogueEngine';
import { useChapterProgress } from './hooks/useChapterProgress';
import { useMeepBeats } from './hooks/useMeepBeats';
import { useChapterOutro } from './hooks/useChapterOutro';
import { useCollectibles } from './hooks/useCollectibles';
import { useCollectiblePopups } from './hooks/useCollectiblePopups';
import { useSceneTriggers } from './hooks/useSceneTriggers';
import Room from './Room';
import SceneDebug from './SceneDebug';
import {
  MEEP_LAG_MS,
  PLAYER_SPEED,
  chapterObjectives,
  isSeatedNpc,
  litSideRoomId,
  npcStandingPosition,
  sceneCollidables,
  walkableWorld,
} from './sceneRules';
import { playerSpawnPosition as defaultSpawn } from '../../config/world';
import { chapterAssets } from '../../config/story/assets';
import { chapterCollectibles } from '../../config/story/collectibles';
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

// A chapter scene: it decides who may act when (a dialogue, a popup or the closing scene
// holds the others back) and draws the room. The pieces live in their own hooks.
const InteriorScene: React.FC<InteriorSceneProps> = ({ chapter, nextUnlockIndex, introPending = false }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isOpen: menuOpen } = useGameMenu();

  const chapterProgress = useAppSelector((state) => state.story.chapters[chapter.id]);
  const flags = chapterProgress?.flags ?? EMPTY_FLAGS;
  const completed = !!chapterProgress?.completed;
  const foundIds = chapterProgress?.collectibles ?? EMPTY_LIST;
  const difficulty = useAppSelector((state) => state.story.difficulty) ?? DEFAULT_DIFFICULTY;
  const setChapterFlag = (flag: string) => {
    dispatch(setFlag({ chapterId: chapter.id, flag }));
  };
  const { resetAll, resetCurrentChapter, completeCurrentChapter } = useDebugReset(chapter.id);

  const dialogue = useDialogueEngine(chapter.npcs, flags, setChapterFlag);
  const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null);
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameMarker | null>(null);
  const collectibles = chapterCollectibles[chapter.id];
  const collectiblesTotal = collectibles?.items.length ?? 0;
  const found = useCollectiblePopups({ chapterId: chapter.id, flags, setFlag: setChapterFlag, foundCount: foundIds.length, total: collectiblesTotal });
  const meep = useMeepBeats(chapter.meepBeats, flags, completed);
  const splash = useLoadingSplash(chapterAssets(chapter));

  const popupOpen = !!dialogue.active || !!activeQuiz || !!activeMiniGame || found.isOpen;

  // the closing scene seats the player, but the movement hook needs the scene's state first
  const teleportRef = useRef<(position: Position) => void>(undefined);
  const outro = useChapterOutro({
    outro: chapter.outro,
    flags,
    setFlag: setChapterFlag,
    ready: !splash.visible && !introPending,
    busy: popupOpen || menuOpen,
    npcs: chapter.npcs,
    cue: dialogue.cue,
    seatPlayer: (position: Position) => teleportRef.current?.(position),
    onEnd: () => void navigate(ROUTES.storyMap),
  });
  const triggersEnabled = !introPending && !outro.active && !menuOpen;

  const npcStates = useNpcPatrol(chapter.npcs, chapter.props, dialogue.active?.npc.id ?? null);
  const npcPositions = Object.fromEntries(Object.entries(npcStates).map(([id, state]) => [id, state.position]));
  const collidables = sceneCollidables(chapter, flags, npcPositions);
  const { worldBounds, walkableAreas } = walkableWorld(chapter, collectibles?.secretPaths);

  // reloaded in the middle of the closing scene: back at the seat
  const outroSeat = chapter.outro && flags[chapter.outro.startedFlag] ? chapter.outro.playerPosition : undefined;
  const { playerPosition, isMoving, direction, playerHitbox, handleJoystickMove, handleJoystickStop, teleport } = usePlayerMovement({
    initialPosition: outroSeat ?? chapter.playerSpawn ?? defaultSpawn,
    speed: PLAYER_SPEED,
    worldBounds,
    structures: collidables.blockers,
    canMove: !introPending && !activeQuiz && !activeMiniGame && !outro.active && !found.isOpen && !menuOpen,
    areas: walkableAreas,
  });
  useEffect(() => {
    teleportRef.current = teleport;
  }, [teleport]);

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

  const { nearbyNpcId } = useSceneTriggers({
    chapter,
    flags,
    playerPosition,
    collidables,
    enabled: triggersEnabled,
    popupOpen,
    dialogue,
    quizOpen: !!activeQuiz,
    onQuiz: setActiveQuiz,
    onMiniGame: setActiveMiniGame,
    outro,
    say: meep.say,
  });

  useChapterProgress({
    chapter,
    flags,
    completed,
    nextUnlockIndex,
    setFlag: setChapterFlag,
    canCue: !introPending && !popupOpen && !splash.visible && !menuOpen,
    onCue: dialogue.cue,
  });

  // save the score, then someone in the room comments on it
  const finishMiniGames = (earned: number, max: number) => {
    if (activeMiniGame) {
      dispatch(recordScore({ chapterId: chapter.id, gameId: activeMiniGame.id, score: { earned, max } }));
      setChapterFlag(activeMiniGame.completionFlag);
      const results = activeMiniGame.resultsDialogue;
      const npc = results && chapter.npcs.find((n) => n.id === results.npcId);
      if (results && npc) dialogue.cue(npc, results.nodes[tierFor(earned, max).id]);
    }
    setActiveMiniGame(null);
  };

  const finishQuiz = () => {
    if (activeQuiz) setChapterFlag(activeQuiz.completionFlag);
    setActiveQuiz(null);
  };

  const objectives = chapterObjectives(chapter, flags, outro.ended ? chapter.outro?.exitObjective : undefined);
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
      {outro.curtain && <ChapterCurtain title={chapterTitle} subtitle={outro.curtain.subtitle} leaving={outro.curtain.leaving} />}
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
              isNearby={nearbyNpcId === npc.id}
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
          <MiniGamesPopup difficulty={difficulty} onFinish={finishMiniGames} onPowerOff={() => setActiveMiniGame(null)} />
        )}
        <CollectiblePopups
          current={found.current}
          currentNumber={found.currentNumber}
          remaining={found.remaining}
          total={collectiblesTotal}
          onConfirmFound={found.confirmFound}
          allFoundText={found.loreOpen ? collectibles?.allFoundText : undefined}
          onConfirmLore={found.confirmLore}
        />
        {activeQuiz && (
          <QuizPopup
            quiz={activeQuiz}
            flags={flags}
            difficulty={difficulty}
            onSetFlag={setChapterFlag}
            onAllComplete={finishQuiz}
            onClose={() => setActiveQuiz(null)}
          />
        )}
      </div>
    </div>
  );
};

export default InteriorScene;
