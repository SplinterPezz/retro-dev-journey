import { DialogueChoiceOption, DialogueNode, StoryNpcData, StoryFlags } from '../../types/story';
import type { ChoiceButtonItem } from '../../components/Story/dialogue/DialogueChoices';
import { seenFlag } from '../../config/story/flags';

const isNodeSeen = (npc: StoryNpcData, nodeId: string, flags: StoryFlags): boolean =>
  !!flags[seenFlag(npc.id, nodeId)];

export const getNode = (npc: StoryNpcData, nodeId: string): DialogueNode | undefined => npc.dialogue.nodes[nodeId];

// an array of targets picks at random, preferring nodes not seen yet
export const pickNextNode = (
  choice: DialogueChoiceOption,
  npc: StoryNpcData,
  flags: StoryFlags,
  random: () => number = Math.random
): string | undefined => {
  if (!Array.isArray(choice.next)) return choice.next;
  const unseen = choice.next.filter((id) => !isNodeSeen(npc, id, flags));
  const pool = unseen.length > 0 ? unseen : choice.next;
  return pool[Math.floor(random() * pool.length)];
};

export const entryNodeId = (npc: StoryNpcData, flags: StoryFlags): string =>
  npc.answeredFlag && flags[npc.answeredFlag] && npc.afterAnswerNodeId ? npc.afterAnswerNodeId : npc.dialogue.startNodeId;

const targetsOf = (choice: DialogueChoiceOption): string[] => {
  if (choice.next === undefined) return [];
  return Array.isArray(choice.next) ? choice.next : [choice.next];
};

// Only isAnswer choices lock, once every node they can lead to has been seen.
export const buildChoiceItems = (npc: StoryNpcData, node: DialogueNode, flags: StoryFlags): ChoiceButtonItem[] | undefined =>
  node.choices?.map((choice, i) => {
    const targets = targetsOf(choice);
    const seenCount = targets.filter((id) => isNodeSeen(npc, id, flags)).length;
    const allSeen = targets.length > 0 && seenCount === targets.length;
    const hasVariants = targets.length > 1;
    return {
      id: String(i),
      label: choice.text,
      isAnswer: choice.isAnswer,
      disabled: !!choice.isAnswer && allSeen,
      progress: choice.isAnswer && hasVariants ? { done: seenCount, total: targets.length } : undefined,
    };
  });
