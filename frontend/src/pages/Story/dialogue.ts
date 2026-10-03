import { DialogueChoiceOption, DialogueNode, StoryNpcData } from '../../types/story';
import type { ChoiceButtonItem } from '../../components/Story/dialogue/DialogueChoices';

type Flags = Record<string, boolean>;

// Every dialogue node gets an implicit "seen" flag the first time it is shown,
// with no content authoring needed.
export const seenFlag = (npcId: string, nodeId: string) => `__seen_${npcId}_${nodeId}`;

export const isNodeSeen = (npc: StoryNpcData, nodeId: string, flags: Flags): boolean =>
  !!flags[seenFlag(npc.id, nodeId)];

export const getNode = (npc: StoryNpcData, nodeId: string): DialogueNode | undefined => npc.dialogue.nodes[nodeId];

// Node a choice leads to. An array of targets picks one at random, preferring
// the ones not seen yet. undefined = the choice closes the dialogue.
export const pickNextNode = (
  choice: DialogueChoiceOption,
  npc: StoryNpcData,
  flags: Flags,
  random: () => number = Math.random
): string | undefined => {
  if (!Array.isArray(choice.next)) return choice.next;
  const unseen = choice.next.filter((id) => !isNodeSeen(npc, id, flags));
  const pool = unseen.length > 0 ? unseen : choice.next;
  return pool[Math.floor(random() * pool.length)];
};

// The node a walk-up opens: the after-answer node once the NPC's question has
// been answered, otherwise the start of its script.
export const entryNodeId = (npc: StoryNpcData, flags: Flags): string =>
  npc.answeredFlag && flags[npc.answeredFlag] && npc.afterAnswerNodeId ? npc.afterAnswerNodeId : npc.dialogue.startNodeId;

// Buttons for a node's choices.
//
// Only isAnswer choices (the ones leading into a question the NPC turns back
// on the player) lock once every node they can lead to has been seen; ordinary
// small-talk topics stay open. A multi-variant isAnswer choice shows
// filled/empty dots, so answering one variant does not read as a dead end.
export const buildChoiceItems = (npc: StoryNpcData, node: DialogueNode, flags: Flags): ChoiceButtonItem[] | undefined =>
  node.choices?.map((c, i) => {
    const targets = c.next === undefined ? [] : Array.isArray(c.next) ? c.next : [c.next];
    const seen = targets.filter((id) => isNodeSeen(npc, id, flags)).length;
    const exhausted = !!c.isAnswer && targets.length > 0 && seen === targets.length;
    const progress = c.isAnswer && targets.length > 1 && Array.isArray(c.next) ? { done: seen, total: targets.length } : undefined;
    return { id: String(i), label: c.text, isAnswer: c.isAnswer, disabled: exhausted, progress };
  });
