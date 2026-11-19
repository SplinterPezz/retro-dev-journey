import { CollidableEntity, Position } from '../../../types/game';
import { MiniGameMarker, QuizData, StoryChapterConfig, StoryFlags, StoryNpcData } from '../../../types/story';
import { useCollisionDetection } from '../../../game/hooks/useCollisionDetection';
import { entryNodeId } from '../dialogue';
import { DEFAULT_NPC_REACH, DEFAULT_STATION_REACH, DOOR_TRIGGER_ID, isAtExitDoor, isUnlocked } from '../sceneRules';
import { useProximityTrigger } from './useProximityTrigger';

interface SceneTriggersConfig {
  chapter: StoryChapterConfig;
  flags: StoryFlags;
  playerPosition: Position;
  collidables: { npcs: CollidableEntity[]; quizzes: CollidableEntity[]; miniGames: CollidableEntity[] };
  enabled: boolean;
  popupOpen: boolean;
  dialogue: {
    active: object | null;
    isCued: boolean;
    open: (npc: StoryNpcData, nodeId: string) => void;
    close: () => void;
  };
  quizOpen: boolean;
  onQuiz: (quiz: QuizData | null) => void;
  onMiniGame: (marker: MiniGameMarker | null) => void;
  outro: { ended: boolean; leave: () => void };
  say: (text: string) => void;
}

// Everything that opens by walking up to it in a chapter: NPC dialogues, quiz stations,
// the mini-game spot and the exit door. Each opens once per walk-up.
export const useSceneTriggers = ({
  chapter,
  flags,
  playerPosition,
  collidables,
  enabled,
  popupOpen,
  dialogue,
  quizOpen,
  onQuiz,
  onMiniGame,
  outro,
  say,
}: SceneTriggersConfig) => {
  const { nearbyStructure: nearbyNpc } = useCollisionDetection({ playerPosition, structures: collidables.npcs, interactionRadius: DEFAULT_NPC_REACH });
  const { nearbyStructure: nearbyQuiz } = useCollisionDetection({ playerPosition, structures: collidables.quizzes, interactionRadius: DEFAULT_STATION_REACH });
  const { nearbyStructure: nearbyMiniGame } = useCollisionDetection({ playerPosition, structures: collidables.miniGames, interactionRadius: DEFAULT_STATION_REACH });

  const findNpc = (id: string) => chapter.npcs.find((n) => n.id === id);
  const findQuiz = (id: string) => chapter.quizzes.find((q) => q.id === id);
  const findMiniGame = (id: string) => chapter.miniGames?.find((m) => m.id === id);
  const isOpenStation = (station?: { completionFlag: string; requiredFlag?: string }) =>
    !popupOpen && !!station && !flags[station.completionFlag] && isUnlocked(flags, station.requiredFlag);

  // walking away closes the dialogue, unless the story opened it
  useProximityTrigger({
    nearbyId: nearbyNpc?.id ?? null,
    enabled,
    canOpen: (id) => !dialogue.active && !quizOpen && isUnlocked(flags, findNpc(id)?.requiredFlag),
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
    enabled,
    canOpen: (id) => isOpenStation(findQuiz(id)),
    onOpen: (id) => onQuiz(findQuiz(id) ?? null),
    onLeave: () => onQuiz(null),
  });

  useProximityTrigger({
    nearbyId: nearbyMiniGame?.id ?? null,
    enabled,
    canOpen: (id) => isOpenStation(findMiniGame(id)),
    onOpen: (id) => onMiniGame(findMiniGame(id) ?? null),
  });

  // the door leads out once the closing scene is over; before that Meep says why not
  useProximityTrigger({
    nearbyId: chapter.outro && isAtExitDoor(chapter, playerPosition) ? DOOR_TRIGGER_ID : null,
    enabled,
    canOpen: () => !popupOpen,
    onOpen: () => {
      if (!chapter.outro) return;
      if (outro.ended) outro.leave();
      else say(chapter.outro.exitBlockedLine);
    },
  });

  return { nearbyNpcId: nearbyNpc?.id ?? null };
};
