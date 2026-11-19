import { useEffect, useEffectEvent, useState } from 'react';
import { StoryNpcData, StoryFlags } from '../../../types/story';
import { buildChoiceItems, getNode, pickNextNode } from '../dialogue';
import { seenFlag } from '../../../config/story/flags';

interface ActiveDialogue {
  npc: StoryNpcData;
  nodeId: string;
  cued: boolean;
}

export const useDialogueEngine = (
  npcs: StoryNpcData[],
  flags: StoryFlags,
  setFlag: (flag: string) => void
) => {
  const [active, setActive] = useState<ActiveDialogue | null>(null);

  const open = (npc: StoryNpcData, nodeId: string) => setActive({ npc, nodeId, cued: false });
  const cue = (npc: StoryNpcData, nodeId: string) => setActive({ npc, nodeId, cued: true });
  const close = () => setActive(null);

  // the seen flag is what locks an isAnswer choice once its question was asked
  const npcId = active?.npc.id;
  const nodeId = active?.nodeId;
  const markShown = useEffectEvent(() => {
    if (!active) return;
    const node = getNode(active.npc, active.nodeId);
    if (node?.setFlag) setFlag(node.setFlag);
    setFlag(seenFlag(active.npc.id, active.nodeId));
  });
  // once per line shown
  useEffect(() => {
    markShown();
  }, [npcId, nodeId]);

  const selectChoice = (optionId: string) => {
    if (!active) return;
    const choice = getNode(active.npc, active.nodeId)?.choices?.[Number(optionId)];
    if (!choice) return;
    if (choice.setFlag) setFlag(choice.setFlag);
    const next = pickNextNode(choice, active.npc, flags);
    setActive(next ? { ...active, nodeId: next } : null);
  };

  const advance = () => {
    if (!active) return;
    const node = getNode(active.npc, active.nodeId);
    const npc = node?.nextNpcId ? npcs.find((n) => n.id === node.nextNpcId) : active.npc;
    setActive(node?.next && npc ? { ...active, npc, nodeId: node.next } : null);
  };

  const node = active ? getNode(active.npc, active.nodeId) ?? null : null;
  const choices = (active && node ? buildChoiceItems(active.npc, node, flags) : undefined);

  // a cued dialogue runs to its end even if the player walks away
  const isCued = !!active?.cued;

  return { active, node, choices, isCued, open, cue, close, selectChoice, advance };
};
