import { useCallback, useEffect, useMemo, useState } from 'react';
import { StoryNpcData, StoryFlags } from '../../../types/story';
import { buildChoiceItems, getNode, pickNextNode } from '../dialogue';
import { seenFlag } from '../../../config/story/flags';

interface ActiveDialogue {
  npc: StoryNpcData;
  nodeId: string;
  cued: boolean; // opened by the story, not by walking up: runs to its end even if the player walks away
}

// The NPC conversation currently on screen: which node is shown, what its
// choices look like, and how a pick or a "continue" moves it on. `npcs` are
// the scene's NPCs, for lines that hand over to another character.
export const useDialogueEngine = (
  npcs: StoryNpcData[],
  flags: StoryFlags,
  setFlag: (flag: string) => void
) => {
  const [active, setActive] = useState<ActiveDialogue | null>(null);

  const open = useCallback((npc: StoryNpcData, nodeId: string) => setActive({ npc, nodeId, cued: false }), []);
  const cue = useCallback((npc: StoryNpcData, nodeId: string) => setActive({ npc, nodeId, cued: true }), []);
  const close = useCallback(() => setActive(null), []);

  // A node's own flag is set as soon as it is shown, plus its implicit "seen"
  // flag, which is what locks an isAnswer choice once its question was asked.
  const npcId = active?.npc.id;
  const nodeId = active?.nodeId;
  useEffect(() => {
    if (!active) return;
    const node = getNode(active.npc, active.nodeId);
    if (node?.setFlag) setFlag(node.setFlag);
    setFlag(seenFlag(active.npc.id, active.nodeId));
    // Once per node shown.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [npcId, nodeId]);

  const selectChoice = useCallback(
    (optionId: string) => {
      if (!active) return;
      const choice = getNode(active.npc, active.nodeId)?.choices?.[Number(optionId)];
      if (!choice) return;
      if (choice.setFlag) setFlag(choice.setFlag);
      const next = pickNextNode(choice, active.npc, flags);
      setActive(next ? { ...active, nodeId: next } : null);
    },
    [active, flags, setFlag]
  );

  const advance = useCallback(() => {
    if (!active) return;
    const node = getNode(active.npc, active.nodeId);
    const npc = node?.nextNpcId ? npcs.find((n) => n.id === node.nextNpcId) : active.npc;
    setActive(node?.next && npc ? { ...active, npc, nodeId: node.next } : null);
  }, [active, npcs]);

  const node = active ? getNode(active.npc, active.nodeId) ?? null : null;
  const choices = useMemo(
    () => (active && node ? buildChoiceItems(active.npc, node, flags) : undefined),
    [active, node, flags]
  );

  // A cued dialogue (e.g. the instructor after the objectives, or the comments
  // on the mini games) runs to its end even if the player walks away.
  const isCued = !!active?.cued;

  return { active, node, choices, isCued, open, cue, close, selectChoice, advance };
};
