import { buildChoiceItems, entryNodeId, pickNextNode } from './dialogue';
import { seenFlag } from '../../config/story/flags';
import { DialogueChoiceOption, DialogueNode, StoryNpcData } from '../../types/story';

const smallTalk: DialogueChoiceOption = { text: 'Small talk', next: 'talk' };
const ask: DialogueChoiceOption = { text: 'Ask me', next: ['q1', 'q2'], isAnswer: true };
const oneQuestion: DialogueChoiceOption = { text: 'One question', next: 'q3', isAnswer: true };
const bye: DialogueChoiceOption = { text: 'Bye' };
const start: DialogueNode = { id: 'start', speaker: 'Manuel', text: 'Hi', choices: [smallTalk, ask, oneQuestion, bye] };

const npc: StoryNpcData = {
  id: 'manuel',
  name: 'Manuel',
  spriteBase: '/sprites/manuel',
  position: { x: 0, y: 0 },
  answeredFlag: 'answered',
  afterAnswerNodeId: 'after',
  dialogue: {
    startNodeId: 'start',
    nodes: {
      start,
      talk: { id: 'talk', speaker: 'Manuel', text: '...' },
      q1: { id: 'q1', speaker: 'Manuel', text: 'Q1' },
      q2: { id: 'q2', speaker: 'Manuel', text: 'Q2' },
      q3: { id: 'q3', speaker: 'Manuel', text: 'Q3' },
      after: { id: 'after', speaker: 'Manuel', text: 'Again?' },
    },
  },
};

const seen = (...nodes: string[]) => Object.fromEntries(nodes.map((n) => [seenFlag('manuel', n), true]));

describe('dialogue choices', () => {
  it('keeps small talk open even after it was seen', () => {
    expect(buildChoiceItems(npc, start, seen('talk'))?.[0]?.disabled).toBe(false);
  });

  it('locks an answer choice once every target was seen, with progress dots', () => {
    expect(buildChoiceItems(npc, start, seen('q1'))?.[1]).toMatchObject({ disabled: false, progress: { done: 1, total: 2 } });
    expect(buildChoiceItems(npc, start, seen('q1', 'q2'))?.[1]).toMatchObject({ disabled: true, progress: { done: 2, total: 2 } });
    expect(buildChoiceItems(npc, start, seen('q3'))?.[2]).toMatchObject({ disabled: true, progress: undefined });
  });

  it('never locks a choice that closes the dialogue', () => {
    expect(buildChoiceItems(npc, start, {})?.[3]?.disabled).toBe(false);
  });
});

describe('pickNextNode', () => {
  it('prefers a target not seen yet', () => {
    expect(pickNextNode(ask, npc, seen('q1'), () => 0)).toBe('q2');
  });

  it('falls back to any target when all were seen', () => {
    expect(['q1', 'q2']).toContain(pickNextNode(ask, npc, seen('q1', 'q2'), () => 0.99));
  });

  it('returns a single target as is, or undefined to close', () => {
    expect(pickNextNode(smallTalk, npc, {})).toBe('talk');
    expect(pickNextNode(bye, npc, {})).toBeUndefined();
  });
});

describe('entryNodeId', () => {
  it('opens the after-answer node once answered', () => {
    expect(entryNodeId(npc, {})).toBe('start');
    expect(entryNodeId(npc, { answered: true })).toBe('after');
  });
});
