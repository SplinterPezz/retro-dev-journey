import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { completeChapter } from '../../../store/storySlice';
import { StoryChapterConfig, StoryFlags, StoryNpcData } from '../../../types/story';
import { ENGINE_FLAGS, cuedFlag } from '../../../config/story/flags';

interface ChapterProgressConfig {
  chapter: StoryChapterConfig;
  flags: StoryFlags;
  completed: boolean;
  nextUnlockIndex: number;
  setFlag: (flag: string) => void;
  canCue: boolean; // false while the scene is not on screen yet or a dialogue / popup is open
  onCue: (npc: StoryNpcData, nodeId: string) => void;
}

// ---- the rules, one question each ----

const allObjectivesDone = (chapter: StoryChapterConfig, flags: StoryFlags): boolean => {
  const objectives = chapter.objectives ?? [];
  return objectives.length > 0 && objectives.every((o) => flags[o.flag]);
};

// The opening dialogue, if it should play now: once, right after the intro
// (or at once for a chapter without one), never in a chapter already finished.
const pendingOpening = (chapter: StoryChapterConfig, flags: StoryFlags, completed: boolean) => {
  const introDone = !chapter.intro || flags[ENGINE_FLAGS.introSeen];
  if (completed || !introDone || flags[ENGINE_FLAGS.openingCued]) return undefined;
  return chapter.openingDialogue;
};

// An NPC with an automatic dialogue whose trigger flag is set and that has
// not played it yet (e.g. the instructor's "take a seat" once the objectives are done).
const isReadyToAutoStart = (npc: StoryNpcData, flags: StoryFlags): boolean =>
  !!npc.autoStartFlag && !!npc.autoStartNodeId && !!flags[npc.autoStartFlag] && !flags[cuedFlag(npc.id)];

const allRequiredFlagsSet = (chapter: StoryChapterConfig, flags: StoryFlags): boolean =>
  chapter.completion.requiredFlags.every((f) => flags[f]);

// Chapter-level rules driven by the flags:
// - every objective done -> ENGINE_FLAGS.objectivesDone;
// - the opening dialogue opens by itself after the intro, once;
// - an NPC's automatic dialogue opens by itself when its flag is set, once;
// - every required flag set -> chapter complete, next chapter unlocked.
export const useChapterProgress = ({
  chapter,
  flags,
  completed,
  nextUnlockIndex,
  setFlag,
  canCue,
  onCue,
}: ChapterProgressConfig) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!flags[ENGINE_FLAGS.objectivesDone] && allObjectivesDone(chapter, flags)) setFlag(ENGINE_FLAGS.objectivesDone);
  }, [flags, chapter, setFlag]);

  useEffect(() => {
    const opening = canCue ? pendingOpening(chapter, flags, completed) : undefined;
    if (!opening) return;
    const npc = chapter.npcs.find((n) => n.id === opening.npcId);
    if (!npc) return;
    setFlag(ENGINE_FLAGS.openingCued);
    onCue(npc, opening.nodeId);
  }, [flags, canCue, completed, chapter, setFlag, onCue]);

  useEffect(() => {
    if (!canCue) return;
    const npc = chapter.npcs.find((n) => isReadyToAutoStart(n, flags));
    if (!npc?.autoStartNodeId) return;
    setFlag(cuedFlag(npc.id));
    onCue(npc, npc.autoStartNodeId);
  }, [flags, canCue, chapter.npcs, setFlag, onCue]);

  useEffect(() => {
    if (!completed && allRequiredFlagsSet(chapter, flags)) {
      dispatch(completeChapter({ chapterId: chapter.id, unlockIndex: nextUnlockIndex }));
    }
  }, [flags, completed, chapter, dispatch, nextUnlockIndex]);
};
