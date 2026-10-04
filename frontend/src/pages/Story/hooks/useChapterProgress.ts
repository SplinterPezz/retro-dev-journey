import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { completeChapter } from '../../../store/storySlice';
import { StoryChapterConfig, StoryNpcData } from '../../../types/story';

interface ChapterProgressConfig {
  chapter: StoryChapterConfig;
  flags: Record<string, boolean>;
  completed: boolean;
  nextUnlockIndex: number;
  setFlag: (flag: string) => void;
  canCue: boolean; // false while any dialogue or popup is open
  onCue: (npc: StoryNpcData, nodeId: string) => void;
}

// Chapter-level rules driven by the flags:
// - every objective done -> `objectivesDone` (shows the arrow at the laptop);
// - the chapter's opening dialogue opens by itself once the intro is closed, once;
// - an NPC whose autoStartFlag is set opens its cued dialogue by itself, once;
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
    const objectives = chapter.objectives ?? [];
    if (objectives.length === 0 || flags.objectivesDone) return;
    if (objectives.every((o) => flags[o.flag])) setFlag('objectivesDone');
  }, [flags, chapter.objectives, setFlag]);

  useEffect(() => {
    const opening = chapter.openingDialogue;
    if (!canCue || !opening || completed || flags.openingCued || (chapter.intro && !flags.introSeen)) return;
    const npc = chapter.npcs.find((n) => n.id === opening.npcId);
    if (!npc) return;
    setFlag('openingCued');
    onCue(npc, opening.nodeId);
  }, [flags, canCue, completed, chapter.openingDialogue, chapter.intro, chapter.npcs, setFlag, onCue]);

  useEffect(() => {
    if (!canCue) return;
    const cue = chapter.npcs.find(
      (n) => n.autoStartFlag && n.autoStartNodeId && flags[n.autoStartFlag] && !flags[`${n.id}_cued`]
    );
    if (!cue || !cue.autoStartNodeId) return;
    setFlag(`${cue.id}_cued`);
    onCue(cue, cue.autoStartNodeId);
  }, [flags, canCue, chapter.npcs, setFlag, onCue]);

  useEffect(() => {
    if (completed) return;
    if (chapter.completion.requiredFlags.every((f) => flags[f])) {
      dispatch(completeChapter({ chapterId: chapter.id, unlockIndex: nextUnlockIndex }));
    }
  }, [flags, completed, chapter.completion.requiredFlags, chapter.id, dispatch, nextUnlockIndex]);
};
