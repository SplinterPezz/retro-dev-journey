import { useCallback, useEffect, useMemo, useState } from 'react';
import { StoryNpcData } from '../../../types/story';
import { buildChoiceItems, getNode, pickNextNode, seenFlag } from '../dialogue';

interface ActiveDialogue {
  npc: StoryNpcData;
  nodeId: string;
}

// The NPC conversation currently on screen: which node is shown, what its
// choices look like, and how a pick or a "continue" moves it on.
export const useDialogueEngine = (flags: Record<string, boolean>, setFlag: (flag: string) => void) => {
  const [active, setActive] = useState<ActiveDialogue | null>(null);

  const open = useCallback((npc: StoryNpcData, nodeId: string) => setActive({ npc, nodeId }), []);
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
      setActive(next ? { npc: active.npc, nodeId: next } : null);
    },
    [active, flags, setFlag]
  );

  const advance = useCallback(() => {
    if (!active) return;
    const next = getNode(active.npc, active.nodeId)?.next;
    setActive(next ? { npc: active.npc, nodeId: next } : null);
  }, [active]);

  const node = active ? getNode(active.npc, active.nodeId) ?? null : null;
  const choices = useMemo(
    () => (active && node ? buildChoiceItems(active.npc, node, flags) : undefined),
    [active, node, flags]
  );

  // A cued dialogue (autoStartNodeId, e.g. the instructor after the
  // objectives) runs to its end even if the player walks away.
  const isCued = !!active && active.npc.autoStartNodeId === active.nodeId;

  return { active, node, choices, isCued, open, close, selectChoice, advance };
};
