import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { setFlag, completeChapter, resetStory, resetChapter } from '../../store/storySlice';
import { usePlayerMovement } from '../Sandbox/hooks/usePlayerMovement';
import { useCollisionDetection } from '../Sandbox/hooks/useCollisionDetection';
import { CollidableEntity } from '../../types/sandbox';
import { StoryChapterConfig, StoryNpcData, QuizData, DialogueNode } from '../../types/story';
import Player from '../../Components/Player/Player';
import TerrainRenderer from '../../Components/Terrain/TerrainRenderer';
import Environment from '../../Components/Structures/Environment';
import InteriorNpc from '../../Components/StoryDialogue/InteriorNpc';
import { useNpcPatrol } from './hooks/useNpcPatrol';
import PortraitDialogueBox from '../../Components/StoryDialogue/PortraitDialogueBox';
import QuizPopup from '../../Components/StoryDialogue/QuizPopup';
import QuizMarker from '../../Components/StoryDialogue/QuizMarker';
import AudioControls from '../../Components/AudioControls/AudioControls';
import MobileJoystick from '../../Components/Common/MobileJoystick';
import { useLogicalViewport } from '../../Components/Common/screenOrientation';
import { useZoomScale } from '../../Components/Common/zoomStore';
import ZoomSlider from '../../Components/Common/ZoomSlider';
import HomeButton from '../../Components/Common/HomeButton';
import { useIsMobile } from '../../Components/Common/useIsMobile';
import Meep from '../../Components/Companion/Meep';
import MeepBubble from '../../Components/Companion/MeepBubble';
import { useLaggedPosition } from '../../Components/Companion/useLaggedPosition';
import StoryProgress from '../../Components/StoryDialogue/StoryProgress';
import { playerSpawnPosition as defaultSpawn } from '../../config/sandbox';
import './InteriorScene.css';

interface InteriorSceneProps {
  chapter: StoryChapterConfig;
  nextUnlockIndex: number;
  onExit: () => void;
  introPending?: boolean; // true while an intro cutscene plays on top - freezes movement and proximity triggers
}

const toCollidable = (id: string, position: { x: number; y: number }, interactionRadius?: number, collisionHitbox?: any): CollidableEntity => ({
  id,
  position,
  interactionRadius,
  data: { collisionHitbox },
});

const InteriorScene: React.FC<InteriorSceneProps> = ({ chapter, nextUnlockIndex, onExit, introPending = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const chapterProgress = useSelector((state: RootState) => state.story.chapters[chapter.id]);
  const difficulty = useSelector((state: RootState) => state.story.difficulty) ?? 'junior';
  const flags = useMemo(() => chapterProgress?.flags || {}, [chapterProgress]);

  const [activeDialogue, setActiveDialogue] = useState<{ npc: StoryNpcData; nodeId: string } | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null);
  const [meepBubble, setMeepBubble] = useState<string | null>(null);
  // Stable reference - MeepBubble's auto-dismiss timer lives in a useEffect
  // keyed on this prop, so an inline arrow here (a new function every
  // render) would tear down and restart that timer on every render of this
  // component, which happens constantly from Meep's own 50ms lag-follow
  // interval. The bubble would never actually survive long enough to
  // auto-dismiss.
  const handleMeepBubbleDismiss = useCallback(() => setMeepBubble(null), []);
  const [exiting, setExiting] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 3500);
    return () => clearTimeout(timer);
  }, []);
  const triggeredBeats = React.useRef<Set<string>>(new Set());
  // once the player manually exits the quiz with the X button, don't let
  // the proximity effect immediately reopen it while they're still standing
  // on the same tile - only re-arm once they actually step away.
  const quizDismissedRef = React.useRef(false);

  // ---- collidable adapters (npcs / quizzes / door only block + trigger proximity) ----
  const npcStates = useNpcPatrol(chapter.npcs, chapter.props, activeDialogue?.npc.id ?? null);
  const npcCollidables = useMemo(
    () =>
      chapter.npcs.map((npc) =>
        toCollidable(npc.id, npcStates[npc.id]?.position ?? npc.position, npc.interactionRadius ?? 70, npc.collisionHitbox)
      ),
    [chapter.npcs, npcStates]
  );
  const quizCollidables = useMemo(
    () => chapter.quizzes.map((q) => toCollidable(q.id, q.position, q.interactionRadius ?? 70)),
    [chapter.quizzes]
  );
  const doorCollidable = useMemo(
    () => [toCollidable('door', chapter.doorPosition, chapter.doorInteractionRadius ?? 60)],
    [chapter.doorPosition, chapter.doorInteractionRadius]
  );
  const blockingProps = useMemo(
    () => chapter.props.map((p) => toCollidable(p.id, p.position, 0, p.collisionHitbox)),
    [chapter.props]
  );
  const allBlocking = useMemo(
    () => [...npcCollidables, ...blockingProps],
    [npcCollidables, blockingProps]
  );

  const { playerPosition, isMoving, direction, playerHitbox, handleJoystickMove, handleJoystickStop } = usePlayerMovement({
    initialPosition: chapter.playerSpawn || defaultSpawn,
    speed: 220,
    worldBounds: {
      minX: 40,
      minY: 40,
      maxX: chapter.worldConfig.width - 40,
      maxY: chapter.worldConfig.height - 40,
    },
    structures: allBlocking,
    canMove: !introPending && !activeQuiz,
  });

  const meepPosition = useLaggedPosition(playerPosition, 450);
  const isMobile = useIsMobile();
  const viewport = useLogicalViewport();
  const zoomScale = useZoomScale();

  const { nearbyStructure: nearbyNpcEntity } = useCollisionDetection({
    playerPosition,
    structures: npcCollidables,
    interactionRadius: 70,
  });
  const { nearbyStructure: nearbyQuizEntity } = useCollisionDetection({
    playerPosition,
    structures: quizCollidables,
    interactionRadius: 70,
  });
  const { nearbyStructure: nearbyDoor } = useCollisionDetection({
    playerPosition,
    structures: doorCollidable,
    interactionRadius: 60,
  });

  const getNode = (npc: StoryNpcData, nodeId: string): DialogueNode => npc.dialogue.nodes[nodeId];

  // Implicit per-node "seen" flag, set automatically whenever a node is
  // shown (see the effect below) - every node gets one for free, no content
  // authoring required.
  const seenFlag = (npcId: string, nodeId: string) => `__seen_${npcId}_${nodeId}`;

  // Generic rule: any isAnswer choice auto-locks once every node its `next`
  // can lead to has already been shown - used to stop re-offering a
  // reversed question (e.g. Manuel's "Got a random question for you") the
  // player has already answered.
  const isNodeSeen = (npc: StoryNpcData, nodeId: string, flags: Record<string, boolean>): boolean =>
    !!flags[seenFlag(npc.id, nodeId)];


  // open dialogue on entering an NPC's radius - not on every render while
  // still standing there, so a finished conversation doesn't restart by itself
  const openedForNpcRef = React.useRef<string | null>(null);
  useEffect(() => {
    if (exiting || introPending) return;
    if (nearbyNpcEntity) {
      if (!activeDialogue && !activeQuiz && openedForNpcRef.current !== nearbyNpcEntity.id) {
        const npc = chapter.npcs.find((n) => n.id === nearbyNpcEntity.id);
        if (npc && (!npc.requiredFlag || flags[npc.requiredFlag])) {
          openedForNpcRef.current = npc.id;
          setActiveDialogue({ npc, nodeId: npc.dialogue.startNodeId });
        }
      }
    } else {
      openedForNpcRef.current = null;
      if (activeDialogue) {
        const timer = setTimeout(() => setActiveDialogue(null), 50);
        return () => clearTimeout(timer);
      }
    }
  }, [nearbyNpcEntity, activeDialogue, activeQuiz, chapter.npcs, flags, exiting, introPending]);

  // open quiz on proximity
  useEffect(() => {
    if (exiting || introPending) return;
    if (!nearbyQuizEntity) {
      quizDismissedRef.current = false;
      if (activeQuiz) setActiveQuiz(null);
      return;
    }
    if (!activeQuiz && !activeDialogue && !quizDismissedRef.current) {
      const quiz = chapter.quizzes.find((q) => q.id === nearbyQuizEntity.id);
      if (quiz && !flags[quiz.completionFlag] && (!quiz.requiredFlag || flags[quiz.requiredFlag])) {
        setActiveQuiz(quiz);
      }
    }
  }, [nearbyQuizEntity, activeQuiz, activeDialogue, chapter.quizzes, flags, exiting, introPending]);

  // apply the current dialogue node's flag as soon as it's shown, and also
  // mark it "seen" under an implicit flag regardless of authored content -
  // this is what lets any isAnswer choice auto-lock once its target question
  // has been asked, without every node needing its own explicit setFlag.
  useEffect(() => {
    if (activeDialogue) {
      const node = getNode(activeDialogue.npc, activeDialogue.nodeId);
      if (node?.setFlag) {
        dispatch(setFlag({ chapterId: chapter.id, flag: node.setFlag }));
      }
      dispatch(setFlag({ chapterId: chapter.id, flag: seenFlag(activeDialogue.npc.id, activeDialogue.nodeId) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDialogue?.npc.id, activeDialogue?.nodeId]);

  // door -> fade out -> exit. Temporarily disabled: walking into the door left
  // the screen white. Set to true to bring the exit back.
  const DOOR_EXIT_ENABLED = false;
  useEffect(() => {
    if (!DOOR_EXIT_ENABLED) return;
    if (nearbyDoor && !exiting) {
      setExiting(true);
      setActiveDialogue(null);
      setActiveQuiz(null);
      const timer = setTimeout(onExit, 500);
      return () => clearTimeout(timer);
    }
  }, [nearbyDoor, exiting, onExit]);

  // chapter completion
  useEffect(() => {
    if (chapterProgress?.completed) return;
    const done = chapter.completion.requiredFlags.every((f) => flags[f]);
    if (done) {
      dispatch(completeChapter({ chapterId: chapter.id, unlockIndex: nextUnlockIndex }));
    }
  }, [flags, chapterProgress?.completed, chapter.completion.requiredFlags, chapter.id, dispatch, nextUnlockIndex]);

  // meep beats: onEnter once, onFlag per newly-set flag, onComplete once
  useEffect(() => {
    const beat = chapter.meepBeats.find((b) => b.trigger === 'onEnter');
    if (beat && !triggeredBeats.current.has(beat.id)) {
      triggeredBeats.current.add(beat.id);
      setMeepBubble(beat.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chapter.meepBeats
      .filter((b) => b.trigger === 'onFlag' && b.flag && flags[b.flag] && !triggeredBeats.current.has(b.id))
      .forEach((b) => {
        triggeredBeats.current.add(b.id);
        setMeepBubble(b.text);
      });

    if (chapterProgress?.completed) {
      const beat = chapter.meepBeats.find((b) => b.trigger === 'onComplete');
      if (beat && !triggeredBeats.current.has(beat.id)) {
        triggeredBeats.current.add(beat.id);
        setMeepBubble(beat.text);
      }
    }
  }, [flags, chapterProgress?.completed, chapter.meepBeats]);

  const handleChoiceSelect = useCallback(
    (optionId: string) => {
      if (!activeDialogue) return;
      const node = getNode(activeDialogue.npc, activeDialogue.nodeId);
      const choice = node.choices?.[Number(optionId)];
      if (!choice) return;
      if (choice.setFlag) {
        dispatch(setFlag({ chapterId: chapter.id, flag: choice.setFlag }));
      }
      const nextId = Array.isArray(choice.next)
        ? (() => {
            const unseen = choice.next.filter((id) => !isNodeSeen(activeDialogue.npc, id, flags));
            const pool = unseen.length > 0 ? unseen : choice.next;
            return pool[Math.floor(Math.random() * pool.length)];
          })()
        : choice.next;
      if (nextId) {
        setActiveDialogue({ npc: activeDialogue.npc, nodeId: nextId });
      } else {
        setActiveDialogue(null);
      }
    },
    [activeDialogue, chapter.id, dispatch, flags]
  );

  const handleAdvance = useCallback(() => {
    if (!activeDialogue) return;
    const node = getNode(activeDialogue.npc, activeDialogue.nodeId);
    if (node.next) {
      setActiveDialogue({ npc: activeDialogue.npc, nodeId: node.next });
    } else {
      setActiveDialogue(null);
    }
  }, [activeDialogue]);

  const handleQuizSetFlag = useCallback(
    (flag: string) => {
      dispatch(setFlag({ chapterId: chapter.id, flag }));
    },
    [chapter.id, dispatch]
  );

  const handleQuizAllComplete = useCallback(() => {
    if (!activeQuiz) return;
    dispatch(setFlag({ chapterId: chapter.id, flag: activeQuiz.completionFlag }));
    setActiveQuiz(null);
  }, [activeQuiz, chapter.id, dispatch]);

  const handleQuizClose = useCallback(() => {
    quizDismissedRef.current = true;
    setActiveQuiz(null);
  }, []);

  const handleDebugReset = useCallback(() => {
    dispatch(resetStory());
    window.location.href = '/story';
  }, [dispatch]);

  const handleDebugResetChapter = useCallback(() => {
    dispatch(resetChapter({ chapterId: chapter.id }));
    window.location.reload();
  }, [dispatch, chapter.id]);

  const currentNode = activeDialogue ? getNode(activeDialogue.npc, activeDialogue.nodeId) : null;

  return (
    <div className="rpgui-content">
      {splashVisible && (
        <div className="chapter-splash">
          <h1 className="chapter-splash-title">{chapter.splashTitle ?? chapter.title}</h1>
        </div>
      )}
      <div className={`interior-scene-container${exiting ? ' exiting' : ''}`}>
        {chapter.objectives && (
          <StoryProgress
            objectives={chapter.objectives.map((o) => ({ id: o.id, label: o.label, done: !!flags[o.flag] }))}
          />
        )}
        <div className="interior-scene-viewport">
          <div
            className="interior-scene-world"
            style={{
              width: chapter.worldConfig.width,
              height: chapter.worldConfig.height,
              transformOrigin: '0 0',
              transform: `translate(${viewport.width / 2}px, ${viewport.height / 2}px) scale(${zoomScale}) translate(${-playerPosition.x}px, ${-playerPosition.y}px)`,
            }}
          >
            <TerrainRenderer worldConfig={chapter.worldConfig} autoRotate={false} terrainImage={chapter.floorImage} />

            <div className="structure-container">
              <Environment environment={{ image: '/sprites/story/props/door.png', position: chapter.doorPosition }} size={128} />
            </div>

            <div className="structure-container">
              {chapter.props.map((prop) => (
                <Environment key={prop.id} environment={prop} size={128} />
              ))}
            </div>

            {chapter.npcs.map((npc) => (
              <InteriorNpc
                key={npc.id}
                npc={npc}
                position={npcStates[npc.id]?.position ?? npc.position}
                moving={npcStates[npc.id]?.moving ?? false}
                direction={npcStates[npc.id]?.direction ?? 'S'}
                isNearby={nearbyNpcEntity?.id === npc.id}
              />
            ))}

            {chapter.quizzes.map((quiz) => (
              <QuizMarker key={quiz.id} position={quiz.position} />
            ))}

            <Meep position={meepPosition} />
            {meepBubble && (
              <MeepBubble text={meepBubble} anchorPosition={meepPosition} onDismiss={handleMeepBubbleDismiss} />
            )}

            <Player position={playerPosition} isMoving={isMoving} direction={direction} />

            {process.env.REACT_APP_ENV === 'development' && (
              <>
                <div
                  className="debug-hitbox"
                  style={{
                    position: 'absolute',
                    left: playerPosition.x + playerHitbox.x,
                    top: playerPosition.y + playerHitbox.y,
                    width: playerHitbox.width,
                    height: playerHitbox.height,
                    border: '2px solid lime',
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    pointerEvents: 'none',
                    zIndex: 9999,
                  }}
                />
                {[...chapter.props, ...chapter.npcs].map((item) =>
                  item.collisionHitbox && (
                    <div
                      key={`debug-${item.id}`}
                      className="debug-hitbox"
                      style={{
                        position: 'absolute',
                        left: item.position.x + item.collisionHitbox.x,
                        top: item.position.y + item.collisionHitbox.y,
                        width: item.collisionHitbox.width,
                        height: item.collisionHitbox.height,
                        border: '2px solid red',
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        pointerEvents: 'none',
                        zIndex: 9998,
                      }}
                    />
                  )
                )}
              </>
            )}
          </div>
        </div>

        {currentNode && activeDialogue && (
          <PortraitDialogueBox
            speakerName={activeDialogue.npc.name}
            portraitImage={`${activeDialogue.npc.spriteBase}_idle.gif`}
            text={currentNode.text}
            choices={currentNode.choices?.map((c, i) => {
              // Only choices that lead into a question the NPC turns back on
              // the player (isAnswer) lock out once answered - ordinary
              // repeatable small-talk topics (gig/java/tips/ahead) stay open.
              const exhausted = c.isAnswer && c.next
                ? Array.isArray(c.next)
                  ? c.next.every((id) => isNodeSeen(activeDialogue.npc, id, flags))
                  : isNodeSeen(activeDialogue.npc, c.next, flags)
                : false;
              // A multi-variant isAnswer choice (next is an array) shows
              // filled/empty dots so answering one variant doesn't read as a
              // dead end - there's visibly another one still to discover.
              const progress = c.isAnswer && Array.isArray(c.next) && c.next.length > 1
                ? { done: c.next.filter((id) => isNodeSeen(activeDialogue.npc, id, flags)).length, total: c.next.length }
                : undefined;
              return { id: String(i), label: c.text, isAnswer: c.isAnswer, disabled: exhausted, progress };
            })}
            onAdvance={handleAdvance}
            onChoiceSelect={handleChoiceSelect}
          />
        )}

        {activeQuiz && (
          <QuizPopup
            quiz={activeQuiz}
            flags={flags}
            difficulty={difficulty}
            onSetFlag={handleQuizSetFlag}
            onAllComplete={handleQuizAllComplete}
            onClose={handleQuizClose}
          />
        )}

        <div className="home-fixed-top-left">
          <HomeButton />
        </div>
        {process.env.REACT_APP_ENV === 'development' && (
          <button type="button" className="story-debug-reset" onClick={handleDebugReset}>
            Reset story
          </button>
        )}
        {process.env.REACT_APP_ENV === 'development' && (
          <button type="button" className="story-debug-reset story-debug-reset-chapter" onClick={handleDebugResetChapter}>
            Reset Chapter
          </button>
        )}
        {process.env.REACT_APP_ENV === 'development' && (
          <div className="debug-coords">
            x: {Math.round(playerPosition.x)} y: {Math.round(playerPosition.y)}
          </div>
        )}
        <ZoomSlider />
        {isMobile && !introPending && (
          <MobileJoystick onMove={handleJoystickMove} onStop={handleJoystickStop} />
        )}
        {chapter.audioTrack && (
          <AudioControls
            audioSrc={chapter.audioTrack}
            defaultVolume={30}
            defaultMuted={true}
            buttonStyle="normal"
            containerStyle="framed-grey"
            loop={true}
            autoPlay={false}
            showVolumePercentage={true}
          />
        )}
      </div>
    </div>
  );
};

export default InteriorScene;
