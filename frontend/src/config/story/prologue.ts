import { StoryChapterConfig } from '../../types/story';

const SPRITE = {
  manuel: '/sprites/story/npc/manuel/manuel',
  francesco: '/sprites/story/npc/francesco/francesco',
  generic: '/sprites/story/npc/generic/generic',
  classmate1: '/sprites/story/npc/classmate1/classmate1',
  classmate2: '/sprites/story/npc/classmate2/classmate2',
  classmate3: '/sprites/story/npc/classmate3/classmate3',
  classmate4: '/sprites/story/npc/classmate4/classmate4',
  classmate5: '/sprites/story/npc/classmate5/classmate5',
  classmate6: '/sprites/story/npc/classmate6/classmate6',
  classmate7: '/sprites/story/npc/classmate7/classmate7',
};

export const prologueChapter: StoryChapterConfig = {
  id: 'prologue',
  title: 'ANFE, Palermo - 2014',
  splashTitle: 'Prologue',
  audioTrack: '/audio/prologue_placeholder.wav',
  intro: {
    title: 'No Real Plan',
    pages: [
      {
        text: "It's 2014. I just graduated high school, and if I'm honest, I had no real plan for what came next. The only thing that ever truly clicked for me, through all those years of classes I barely paid attention to, was sitting in front of a computer figuring out how things worked.",
      },
      {
        text: 'So I did the only thing that made sense: I signed up for a course at ANFE, here in Palermo - a thousand hours promising to turn me into a "Mobile Application Developer". I had no idea what I was doing. I just knew I wanted to build something instead of only using it.',
      },
    ],
  },
  worldConfig: { width: 1300, height: 900, tileSize: 128 },
  floorImage: '/sprites/story/props/floor_classroom.png',
  playerSpawn: { x: 650, y: 780 },
  doorPosition: { x: 650, y: 895 },

  props: [
    { id: 'cattedra', image: '/sprites/story/props/desk_cattedra.png', position: { x: 650, y: 150 }, imageSize: { width: 192, height: 144 }, collisionHitbox: { x: 10, y: 8, width: 172, height: 88 } },
    // 5 columns x 3 rows, evenly spaced (165px apart, 160px row depth) -
    // one uniform grid instead of two differently-spaced blocks stitched
    // together, which read as random.
    { id: 'desk-1', image: '/sprites/story/props/desk_student.png', position: { x: 320, y: 300 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-2', image: '/sprites/story/props/desk_student.png', position: { x: 485, y: 300 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-3', image: '/sprites/story/props/desk_student.png', position: { x: 650, y: 300 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-4', image: '/sprites/story/props/desk_student.png', position: { x: 815, y: 300 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-5', image: '/sprites/story/props/desk_student.png', position: { x: 980, y: 300 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-6', image: '/sprites/story/props/desk_student.png', position: { x: 320, y: 460 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-7', image: '/sprites/story/props/desk_student.png', position: { x: 485, y: 460 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-8', image: '/sprites/story/props/desk_student.png', position: { x: 650, y: 460 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-9', image: '/sprites/story/props/desk_student.png', position: { x: 815, y: 460 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-10', image: '/sprites/story/props/desk_student.png', position: { x: 980, y: 460 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-11', image: '/sprites/story/props/desk_student.png', position: { x: 320, y: 620 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-12', image: '/sprites/story/props/desk_student.png', position: { x: 485, y: 620 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-13', image: '/sprites/story/props/desk_student.png', position: { x: 650, y: 620 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-14', image: '/sprites/story/props/desk_student.png', position: { x: 815, y: 620 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-15', image: '/sprites/story/props/desk_student.png', position: { x: 980, y: 620 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    // extra left column so Manuel and classmate-3, who stand outside the
    // main grid's left edge, have a desk near them like everyone else
    { id: 'desk-16', image: '/sprites/story/props/desk_student.png', position: { x: 155, y: 300 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-17', image: '/sprites/story/props/desk_student.png', position: { x: 155, y: 460 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    { id: 'desk-18', image: '/sprites/story/props/desk_student.png', position: { x: 155, y: 620 }, imageSize: { width: 128, height: 128 }, collisionHitbox: { x: 16, y: 18, width: 96, height: 72 } },
    // laptops sit on the tabletop of a few desks (desk top starts around y+18)
    { id: 'laptop-1', image: '/sprites/story/props/laptop_1.png', position: { x: 682, y: 326 }, imageSize: { width: 64, height: 40 } },
    { id: 'laptop-2', image: '/sprites/story/props/laptop_2.png', position: { x: 517, y: 486 }, imageSize: { width: 64, height: 40 } },
    { id: 'laptop-3', image: '/sprites/story/props/laptop_3.png', position: { x: 847, y: 486 }, imageSize: { width: 64, height: 40 } },
    { id: 'laptop-4', image: '/sprites/story/props/laptop_1.png', position: { x: 517, y: 646 }, imageSize: { width: 64, height: 40 } },
    { id: 'laptop-5', image: '/sprites/story/props/laptop_2.png', position: { x: 847, y: 646 }, imageSize: { width: 64, height: 40 } },
    // arrow above the student laptop: shown once the four objectives are done
    { id: 'laptop-arrow', image: '/sprites/story/props/arrow_down.png', position: { x: 690, y: 282 }, imageSize: { width: 48, height: 48 }, visibleWhenFlag: 'objectivesDone' },
    // chalkboard + bin flank the cattedra symmetrically
    { id: 'chalkboard', image: '/sprites/story/props/chalkboard_wheels.png', position: { x: 400, y: 150 }, imageSize: { width: 110, height: 110 } },
    { id: 'trash-bin', image: '/sprites/story/props/trash_bin.png', position: { x: 900, y: 150 }, imageSize: { width: 72, height: 72 } },
    // corners and side walls
    { id: 'plant', image: '/sprites/story/props/plant.png', position: { x: 70, y: 110 }, imageSize: { width: 96, height: 96 } },
    { id: 'globe', image: '/sprites/story/props/globe_stand.png', position: { x: 1220, y: 200 }, imageSize: { width: 90, height: 90 } },
    { id: 'corkboard', image: '/sprites/story/props/corkboard_easel.png', position: { x: 1180, y: 460 }, imageSize: { width: 110, height: 110 } },
    { id: 'anfe-sign', image: '/sprites/story/props/anfe_sign.png', position: { x: 800, y: 840 }, imageSize: { width: 96, height: 96 } },
    // small personal-item flavour, offset from their nearest desk/NPC
    { id: 'backpack', image: '/sprites/story/props/backpack.png', position: { x: 110, y: 230 }, imageSize: { width: 80, height: 80 } },
  ],

  miniGames: [
    { id: 'laptop-games', position: { x: 714, y: 380 }, interactionRadius: 80, completionFlag: 'miniGamesDone', requiredFlag: 'objectivesDone' },
  ],

  npcs: [
    {
      id: 'teacher',
      name: 'Instructor',
      spriteBase: SPRITE.generic,
      position: { x: 650, y: 100 },
      patrol: { waypoints: [{ x: 560, y: 100 }, { x: 740, y: 100 }], speed: 25, pauseMs: 2500 },
      seatedFlag: 'seated',
      seatedPosition: { x: 650, y: 250 },
      autoStartFlag: 'objectivesDone',
      autoStartNodeId: 'sitDown',
      answeredFlag: 'instructorAnswered',
      afterAnswerNodeId: 'alreadyAnswered',
      dialogue: {
        startNodeId: 'start',
        nodes: {
          alreadyAnswered: {
            id: 'alreadyAnswered',
            speaker: 'Instructor',
            text: "We covered that already. Let's keep going.",
          },
          sitDown: {
            id: 'sitDown',
            speaker: 'Instructor',
            text: "Ok guys, everyone take a seat. We're continuing the lesson.",
            setFlag: 'seated',
          },
          start: {
            id: 'start',
            speaker: 'Instructor',
            text: "You, in the back - settle down, we start shortly. Before that, though: has anyone here ever written a line of code before signing up for this course?",
            setFlag: 'talkedInstructor',
            choices: [
              { text: 'Never. This is all brand new to me.', next: 'never', setFlag: 'instructorAnswered' },
              { text: "A little, nothing serious.", next: 'alittle', setFlag: 'instructorAnswered' },
              { text: "Yeah, I've messed around with it before.", next: 'experienced', setFlag: 'instructorAnswered' },
            ],
          },
          never: {
            id: 'never',
            speaker: 'Instructor',
            text: "Good - then we're starting exactly where we should. Nobody in this room was born knowing this.",
            setFlag: 'instructorQ_experience_never',
            next: 'seat',
          },
          alittle: {
            id: 'alittle',
            speaker: 'Instructor',
            text: "That'll help, but don't get comfortable. We move fast once we get going.",
            setFlag: 'instructorQ_experience_alittle',
            next: 'seat',
          },
          experienced: {
            id: 'experienced',
            speaker: 'Instructor',
            text: "Oh? Well, don't spoil it for everyone else, then. We'll see how far that gets you.",
            setFlag: 'instructorQ_experience_experienced',
            next: 'seat',
          },
          seat: {
            id: 'seat',
            speaker: 'Instructor',
            text: "Anyway - take your seat. Chapter four's starting in a few minutes, and yes, it'll be on the final project.",
          },
        },
      },
    },
    {
      id: 'manuel',
      name: 'Manuel',
      spriteBase: SPRITE.manuel,
      position: { x: 879, y: 402 },
      dialogue: {
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            speaker: 'Manuel',
            text: "Hey! Still buzzing from last night's gig. You look more lost than me in front of a loop statement.",
            choices: [
              { text: 'How was the gig?', next: 'gig' },
              { text: 'Honestly? This Java stuff is kicking my butt.', next: 'java' },
              { text: 'What do you do for fun outside of class?', next: 'music', isAnswer: true },
              { text: 'Got a random question for you.', next: ['askbackWhy', 'askbackFuture'], isAnswer: true },
            ],
          },
          gig: {
            id: 'gig',
            speaker: 'Manuel',
            text: "Packed place, terrible pay, worth every second. Don't worry about the code, by the way - none of us get it yet either.",
            setFlag: 'talkedManuel',
            next: 'hub',
          },
          java: {
            id: 'java',
            speaker: 'Manuel',
            text: 'Ha! Same here. I keep mixing up class and object. We\'ll figure it out together, one way or another.',
            setFlag: 'talkedManuel',
            next: 'hub',
          },
          music: {
            id: 'music',
            speaker: 'Manuel',
            text: "Honestly? Music, mostly. I'm out at some dive bar or garage show most weekends - I play drums in a band. We're... let's call it 'enthusiastic' more than good.",
            next: 'musicAsk',
          },
          musicAsk: {
            id: 'musicAsk',
            speaker: 'Manuel',
            text: "What about you - what are you into? You play anything yourself?",
            choices: [
              { text: 'Mostly rock and metal, no instrument though.', next: 'musicRock' },
              { text: "I'm more into electronic or hip-hop, never picked up an instrument.", next: 'musicElectronic' },
              { text: 'I actually play an instrument a bit.', next: 'musicPlays' },
            ],
          },
          musicRock: {
            id: 'musicRock',
            speaker: 'Manuel',
            text: "Hell yeah, that overlaps with half our setlist. We should jam sometime, if you're not scared of a drum solo.",
            setFlag: 'manuelQ_music_rock',
            next: 'hub',
          },
          musicElectronic: {
            id: 'musicElectronic',
            speaker: 'Manuel',
            text: "Different world from what we play, but respect - good ears either way.",
            setFlag: 'manuelQ_music_electronic',
            next: 'hub',
          },
          musicPlays: {
            id: 'musicPlays',
            speaker: 'Manuel',
            text: "Wait, really? We could use someone who actually practices. I'm mostly self-taught and it shows.",
            setFlag: 'manuelQ_music_plays',
            next: 'hub',
          },
          askbackWhy: {
            id: 'askbackWhy',
            speaker: 'Manuel',
            text: 'Actually, let me ask YOU something first - what made you want to get into this stuff?',
            choices: [
              { text: 'Honestly? I just like figuring out how things work.', next: 'curiosity' },
              { text: 'I heard it pays well.', next: 'money' },
              { text: "Not sure yet, still figuring it out.", next: 'unsure' },
            ],
          },
          askbackFuture: {
            id: 'askbackFuture',
            speaker: 'Manuel',
            text: "Actually, let me ask YOU something - what's the plan once this course wraps up?",
            choices: [
              { text: 'Hoping to land a junior dev job somewhere.', next: 'futureJob' },
              { text: 'Maybe freelance, see where that goes.', next: 'futureFreelance' },
              { text: "Honestly? No idea yet.", next: 'futureUnsure' },
            ],
          },
          futureJob: {
            id: 'futureJob',
            speaker: 'Manuel',
            text: "Solid plan. Just get something - anything - into a portfolio before you start applying anywhere.",
            setFlag: 'manuelQ_future_job',
            next: 'hub',
          },
          futureFreelance: {
            id: 'futureFreelance',
            speaker: 'Manuel',
            text: "Rough road early on, but doable. Just don't undercharge like I did when I started.",
            setFlag: 'manuelQ_future_freelance',
            next: 'hub',
          },
          futureUnsure: {
            id: 'futureUnsure',
            speaker: 'Manuel',
            text: "Honestly, most of us didn't either. You figure it out by doing, not by planning it all out first.",
            setFlag: 'manuelQ_future_unsure',
            next: 'hub',
          },
          curiosity: {
            id: 'curiosity',
            speaker: 'Manuel',
            text: "That's the best reason there is, honestly. The money's a nice side effect.",
            setFlag: 'manuelQ_whyCoding_curiosity',
            next: 'hub',
          },
          money: {
            id: 'money',
            speaker: 'Manuel',
            text: "Ha, fair enough. Just don't let that be the ONLY reason, or you'll burn out before you finish this course.",
            setFlag: 'manuelQ_whyCoding_money',
            next: 'hub',
          },
          unsure: {
            id: 'unsure',
            speaker: 'Manuel',
            text: "That's honest, at least. Give it a few weeks - it has a way of hooking people.",
            setFlag: 'manuelQ_whyCoding_unsure',
            next: 'hub',
          },
          hub: {
            id: 'hub',
            speaker: 'Manuel',
            text: 'Anything else?',
            choices: [
              { text: 'How was the gig?', next: 'gig' },
              { text: 'This Java stuff is kicking my butt.', next: 'java' },
              { text: 'What do you do for fun outside of class?', next: 'music', isAnswer: true },
              { text: 'Got a random question for you.', next: ['askbackWhy', 'askbackFuture'], isAnswer: true },
              { text: "That's all for now." },
            ],
          },
        },
      },
    },
    {
      id: 'francesco',
      name: 'Francesco',
      spriteBase: SPRITE.francesco,
      position: { x: 1044, y: 402 },
      dialogue: {
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            speaker: 'Francesco',
            text: "You're overthinking the syntax. Once you get the logic, the rest is just memorizing keywords.",
            choices: [
              { text: 'Any tips for someone totally new?', next: 'tips' },
              { text: 'Must be nice being ahead of everyone.', next: 'ahead' },
              { text: 'Did you see the new phone that just came out?', next: 'tech', isAnswer: true },
              { text: 'Let me turn the tables for a second.', next: ['askbackStuck', 'askbackLearn'], isAnswer: true },
            ],
          },
          tips: {
            id: 'tips',
            speaker: 'Francesco',
            text: "Write code every day, even five minutes. And don't fear breaking things - that's genuinely how you learn.",
            setFlag: 'talkedFrancesco',
            next: 'hub',
          },
          ahead: {
            id: 'ahead',
            speaker: 'Francesco',
            text: "I just started earlier, that's all. Give it six months and you won't remember ever being stuck.",
            setFlag: 'talkedFrancesco',
            next: 'hub',
          },
          tech: {
            id: 'tech',
            speaker: 'Francesco',
            text: "Did you catch the new Android flagship that just dropped? People are saying it's insane - the camera alone is supposedly in a different league.",
            next: 'techAsk',
          },
          techAsk: {
            id: 'techAsk',
            speaker: 'Francesco',
            text: 'Are you an Android person, or do you lean Apple? Or something else entirely?',
            choices: [
              { text: 'Android, all the way.', next: 'techAndroid' },
              { text: 'Apple - I like the ecosystem.', next: 'techApple' },
              { text: 'Honestly, something else entirely.', next: 'techOther' },
            ],
          },
          techAndroid: {
            id: 'techAndroid',
            speaker: 'Francesco',
            text: "Good taste. More freedom to tinker, which - trust me - you'll appreciate once we get deeper into this course.",
            setFlag: 'francescoQ_phone_android',
            next: 'hub',
          },
          techApple: {
            id: 'techApple',
            speaker: 'Francesco',
            text: "Fair enough. Just don't expect Objective-C to feel anywhere near as polished as the hardware.",
            setFlag: 'francescoQ_phone_apple',
            next: 'hub',
          },
          techOther: {
            id: 'techOther',
            speaker: 'Francesco',
            text: 'Interesting. Keep that curiosity - it serves you well in this field.',
            setFlag: 'francescoQ_phone_other',
            next: 'hub',
          },
          askbackStuck: {
            id: 'askbackStuck',
            speaker: 'Francesco',
            text: 'Sure - quick question for you. When you get stuck on something, what do you usually do first?',
            choices: [
              { text: 'Try to figure it out myself.', next: 'selfReliant' },
              { text: 'Look it up immediately.', next: 'lookItUp' },
              { text: 'Ask someone like you.', next: 'askSomeone' },
            ],
          },
          askbackLearn: {
            id: 'askbackLearn',
            speaker: 'Francesco',
            text: 'Sure - another one for you. How do you prefer to learn something new?',
            choices: [
              { text: 'Video tutorials, hands down.', next: 'learnVideo' },
              { text: 'Official docs - straight from the source.', next: 'learnDocs' },
              { text: 'Just diving in and breaking stuff until it works.', next: 'learnTrial' },
            ],
          },
          learnVideo: {
            id: 'learnVideo',
            speaker: 'Francesco',
            text: "Nothing wrong with that - just make sure you actually type the code instead of only watching.",
            setFlag: 'francescoQ_learn_video',
            next: 'hub',
          },
          learnDocs: {
            id: 'learnDocs',
            speaker: 'Francesco',
            text: "Respect. Most people skip that until they're forced to - you'll save yourself a lot of guessing.",
            setFlag: 'francescoQ_learn_docs',
            next: 'hub',
          },
          learnTrial: {
            id: 'learnTrial',
            speaker: 'Francesco',
            text: "Honestly the fastest way to actually learn, even if it's the most frustrating.",
            setFlag: 'francescoQ_learn_trial',
            next: 'hub',
          },
          selfReliant: {
            id: 'selfReliant',
            speaker: 'Francesco',
            text: "Good instinct. Just don't spend hours stuck on one thing out of pride - that's the only trap.",
            setFlag: 'francescoQ_stuck_selfReliant',
            next: 'hub',
          },
          lookItUp: {
            id: 'lookItUp',
            speaker: 'Francesco',
            text: "Smart, honestly. Knowing how to search is half the job. Just make sure you understand what you copy.",
            setFlag: 'francescoQ_stuck_lookItUp',
            next: 'hub',
          },
          askSomeone: {
            id: 'askSomeone',
            speaker: 'Francesco',
            text: "Ha, I'll take that as a compliment. Door's always open - within reason.",
            setFlag: 'francescoQ_stuck_askSomeone',
            next: 'hub',
          },
          hub: {
            id: 'hub',
            speaker: 'Francesco',
            text: 'Anything else?',
            choices: [
              { text: 'Any tips for someone totally new?', next: 'tips' },
              { text: 'Must be nice being ahead of everyone.', next: 'ahead' },
              { text: 'Did you see the new phone that just came out?', next: 'tech', isAnswer: true },
              { text: 'Let me turn the tables for a second.', next: ['askbackStuck', 'askbackLearn'], isAnswer: true },
              { text: "That's all for now." },
            ],
          },
        },
      },
    },
    {
      id: 'classmate-1',
      name: 'Classmate',
      spriteBase: SPRITE.classmate1,
      position: { x: 250, y: 570 },
      seatedFlag: 'seated',
      seatedPosition: { x: 384, y: 722 },
      patrol: { waypoints: [{ x: 250, y: 570 }, { x: 400, y: 570 }], speed: 35, pauseMs: 3000 },
      dialogue: {
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            speaker: 'Classmate',
            text: "Pfft, I give up understanding pointers. Wait, Java doesn't even have those... so what exactly am I confused about?",
            next: 'more',
          },
          more: {
            id: 'more',
            speaker: 'Classmate',
            text: "Anyway - if you figure out inheritance before I do, you have to tell me. I've read that slide four times.",
          },
        },
      },
    },
    {
      id: 'classmate-2',
      name: 'Classmate',
      spriteBase: SPRITE.classmate2,
      position: { x: 880, y: 570 },
      seatedFlag: 'seated',
      seatedPosition: { x: 879, y: 722 },
      dialogue: {
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            speaker: 'Classmate',
            text: 'Did you finish the homework? ...Yeah, me neither.',
            next: 'more',
          },
          more: {
            id: 'more',
            speaker: 'Classmate',
            text: "I heard Manuel finished it in like twenty minutes. I don't want to talk about it.",
          },
        },
      },
    },
    {
      id: 'classmate-3',
      name: 'Classmate',
      spriteBase: SPRITE.classmate3,
      position: { x: 466, y: 420 },
      seatedFlag: 'seated',
      seatedPosition: { x: 549, y: 562 },
      dialogue: {
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            speaker: 'Classmate',
            text: 'Is it just me, or does this chair make a weird noise every time I move?',
            next: 'more',
          },
          more: {
            id: 'more',
            speaker: 'Classmate',
            text: "...Yep. Every single time. I've named it Gerald.",
          },
        },
      },
    },
    {
      id: 'classmate-4',
      name: 'Classmate',
      spriteBase: SPRITE.classmate4,
      position: { x: 300, y: 260 },
      seatedFlag: 'seated',
      seatedPosition: { x: 549, y: 722 },
      patrol: { waypoints: [{ x: 300, y: 260 }, { x: 1000, y: 260 }], speed: 45, pauseMs: 2600 },
      dialogue: {
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            speaker: 'Classmate',
            text: "I highlighted my whole notebook in three colors. I still don't understand loops.",
            next: 'more',
          },
          more: {
            id: 'more',
            speaker: 'Classmate',
            text: "But hey - at least it's a very colorful kind of confused.",
          },
        },
      },
    },
    {
      id: 'classmate-5',
      name: 'Classmate',
      spriteBase: SPRITE.classmate5,
      position: { x: 110, y: 340 },
      seatedFlag: 'seated',
      seatedPosition: { x: 714, y: 722 },
      patrol: { waypoints: [{ x: 110, y: 340 }, { x: 110, y: 600 }], speed: 35, pauseMs: 2800 },
      dialogue: {
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            speaker: 'Classmate',
            text: "Back home we didn't really have a 'Mobile Application Developer' course like this. Feels surreal being here.",
            next: 'more',
          },
          more: {
            id: 'more',
            speaker: 'Classmate',
            text: "Anyway - if you ever need someone to double-check your syntax, I've got sharp eyes. Usually.",
          },
        },
      },
    },
    {
      id: 'classmate-6',
      name: 'Classmate',
      spriteBase: SPRITE.classmate6,
      position: { x: 1230, y: 330 },
      seatedFlag: 'seated',
      seatedPosition: { x: 1044, y: 562 },
      dialogue: {
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            speaker: 'Classmate',
            text: "Pretty sure I've worn this beanie every day since this course started. It's basically part of my identity now.",
            next: 'more',
          },
          more: {
            id: 'more',
            speaker: 'Classmate',
            text: "Also I may or may not have slept through half of yesterday's lesson. Don't tell the instructor.",
          },
        },
      },
    },
    {
      id: 'classmate-7',
      name: 'Classmate',
      spriteBase: SPRITE.classmate7,
      position: { x: 1230, y: 640 },
      seatedFlag: 'seated',
      seatedPosition: { x: 1044, y: 722 },
      dialogue: {
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            speaker: 'Classmate',
            text: 'Do you think if I stare at the screen long enough, the code will just fix itself?',
            next: 'more',
          },
          more: {
            id: 'more',
            speaker: 'Classmate',
            text: "...It hasn't worked yet. But I remain optimistic.",
          },
        },
      },
    },
  ],

  quizzes: [
    {
      id: 'classroom-quiz',
      title: 'Pop Quiz',
      introTitle: 'Review Time',
      introSeenFlag: 'quizIntroSeen',
      introPages: [
        "Before the final project, the instructor hands out a practice quiz covering everything from this stretch of the course.",
        'There are four topics: Java, Android, Objective-C, and the object-oriented basics underneath all of them. Three questions each - clear every topic to pass.',
      ],
      position: { x: 1180, y: 110 },
      completionFlag: 'quizPassed',
      categories: [
        {
          id: 'java',
          label: 'Java',
          completionFlag: 'quizJavaDone',
          questions: [
            {
              id: 'java-1',
              question: 'What keyword declares a variable in Java that can never be reassigned?',
              options: ['final', 'static', 'void', 'const'],
              correctIndex: 0,
              onWrongText: 'Close, but not quite. Try again.',
            },
            {
              id: 'java-2',
              question: 'Which keyword is used to create a subclass in Java?',
              options: ['extends', 'implements', 'inherits', 'super'],
              correctIndex: 0,
              onWrongText: "Nope - think about what links a child class to a parent.",
            },
            {
              id: 'java-3',
              question: 'What does JVM stand for?',
              options: ['Java Virtual Machine', 'Java Variable Method', 'Just Virtual Machine', 'Java Visual Machine'],
              correctIndex: 0,
              onWrongText: 'Try again.',
            },
            {
              id: 'java-m1',
              difficulty: 'middle',
              question: "Which access modifier makes a member visible only inside its own class?",
              options: ["private", "protected", "default", "public"],
              correctIndex: 0,
              onWrongText: "Think about the most restrictive one.",
            },
            {
              id: 'java-m2',
              difficulty: 'middle',
              question: "What does the static keyword mean on a field?",
              options: ["It belongs to the class, not to any single instance", "It cannot be changed after initialization", "It is visible only to subclasses", "It is created once per thread"],
              correctIndex: 0,
              onWrongText: "Static is about the class, not the object.",
            },
            {
              id: 'java-code-m',
              difficulty: 'middle',
              question: "Fix the compile error in this class.",
              options: [],
              correctIndex: 0,
              codeSnippet: `public class Counter {
    private int count = 0
    public void increment() {
        count++;
    }
}`,
              expectedCode: `public class Counter {
    private int count = 0;
    public void increment() {
        count++;
    }
}`,
              onWrongText: "Look for a line that is missing its terminator.",
            },
            {
              id: 'java-s1',
              difficulty: 'senior',
              question: "A Dog reference holds an Animal-typed variable and calls an overridden speak(). Which implementation runs?",
              options: ["The Dog implementation (dynamic dispatch)", "The Animal implementation, always", "A compile error", "Whichever the JVM picks at random"],
              correctIndex: 0,
              onWrongText: "Overriding is resolved at runtime by the actual object.",
            },
            {
              id: 'java-s2',
              difficulty: 'senior',
              question: "Which statement best describes the equals() / hashCode() contract?",
              options: ["Equal objects must return equal hash codes", "Equal hash codes mean the objects are equal", "hashCode must return a unique value per object", "equals must never be overridden"],
              correctIndex: 0,
              onWrongText: "Equal objects must agree on hashCode, but not the reverse.",
            },
            {
              id: 'java-code-s',
              difficulty: 'senior',
              question: "The method should return true for adults. Fix the bug.",
              options: [],
              correctIndex: 0,
              codeSnippet: `public boolean isAdult(int age) {
    if (age >= 18) {
        return true
    }
    return false;
}`,
              expectedCode: `public boolean isAdult(int age) {
    if (age >= 18) {
        return true;
    }
    return false;
}`,
              onWrongText: "Check the statement that ends the return.",
            },
          ],
        },
        {
          id: 'android',
          label: 'Android',
          completionFlag: 'quizAndroidDone',
          questions: [
            {
              id: 'android-1',
              question: 'Which file format is used to define an Android layout?',
              options: ['XML', 'JSON', 'YAML', 'CSV'],
              correctIndex: 0,
              onWrongText: 'Nope. Think back to the lesson on screens.',
            },
            {
              id: 'android-2',
              question: 'Which component represents a single screen with a UI in Android?',
              options: ['Activity', 'Service', 'Intent', 'Thread'],
              correctIndex: 0,
              onWrongText: "That's not the one that draws the screen.",
            },
            {
              id: 'android-3',
              question: "What file lists an Android app's permissions and components?",
              options: ['AndroidManifest.xml', 'build.gradle', 'MainActivity.java', 'strings.xml'],
              correctIndex: 0,
              onWrongText: 'Try again.',
            },
            {
              id: 'android-m1',
              difficulty: 'middle',
              question: "Which lifecycle callback runs right before an Activity becomes visible?",
              options: ["onStart", "onCreate", "onResume", "onDestroy"],
              correctIndex: 0,
              onWrongText: "onResume comes after the screen is already visible.",
            },
            {
              id: 'android-m2',
              difficulty: 'middle',
              question: "Which class carries data between Activities?",
              options: ["Intent", "Thread", "Service", "Adapter"],
              correctIndex: 0,
              onWrongText: "Think about how you start another screen.",
            },
            {
              id: 'android-m3',
              difficulty: 'middle',
              question: "What does a RecyclerView need to display its items?",
              options: ["A LayoutManager and an Adapter", "A Service and a BroadcastReceiver", "A WebView and a Fragment", "Only a layout XML file"],
              correctIndex: 0,
              onWrongText: "It needs both layout and data.",
            },
            {
              id: 'android-s1',
              difficulty: 'senior',
              question: "Why must network calls stay off the main thread?",
              options: ["They would block the UI and can trigger an ANR", "The main thread is not allowed to use the network", "It makes the APK larger", "Android forbids every background thread"],
              correctIndex: 0,
              onWrongText: "What does the user see if the main thread freezes?",
            },
            {
              id: 'android-s2',
              difficulty: 'senior',
              question: "What is the main purpose of a ViewModel?",
              options: ["Hold UI data that survives configuration changes", "Replace the database", "Draw custom views", "Manage Bluetooth connections"],
              correctIndex: 0,
              onWrongText: "Think about rotation.",
            },
            {
              id: 'android-s3',
              difficulty: 'senior',
              question: "Which component should run long work with no user interface?",
              options: ["Service", "Activity", "BroadcastReceiver only", "ContentProvider only"],
              correctIndex: 0,
              onWrongText: "It runs in the background.",
            },
          ],
        },
        {
          id: 'objc',
          label: 'Objective-C',
          hint: "It's early 2014. Swift doesn't exist yet. Objective-C is the only language Apple gives you, so if it looks like it was carved in stone, that's because it was.",
          completionFlag: 'quizObjCDone',
          questions: [
            {
              id: 'objc-1',
              question: 'What symbol is used to send a message to an object in Objective-C?',
              options: ['Square brackets [ ]', 'Curly braces { }', 'Parentheses ( )', 'Angle brackets < >'],
              correctIndex: 0,
              onWrongText: 'Think about how Objective-C syntax looks different from Java.',
            },
            {
              id: 'objc-2',
              question: 'Which keyword declares a property in Objective-C?',
              options: ['@property', '@interface', '@implementation', '@synthesize'],
              correctIndex: 0,
              onWrongText: 'Close, but not that one.',
            },
            {
              id: 'objc-3',
              question: "What does 'nil' represent in Objective-C?",
              options: ['A null object pointer', 'A boolean false', 'An empty string', 'A zero-length array'],
              correctIndex: 0,
              onWrongText: 'Try again.',
            },
            {
              id: 'objc-m1',
              difficulty: 'middle',
              question: "What does @interface declare in Objective-C?",
              options: ["A class interface: its public methods and properties", "A block of code run in parallel", "A memory pool", "A protocol implementation"],
              correctIndex: 0,
              onWrongText: "It describes what a class exposes.",
            },
            {
              id: 'objc-m2',
              difficulty: 'middle',
              question: "What does ARC stand for?",
              options: ["Automatic Reference Counting", "Advanced Runtime Compiler", "Asynchronous Resource Cache", "Application Release Cycle"],
              correctIndex: 0,
              onWrongText: "It manages memory for you.",
            },
            {
              id: 'objc-m3',
              difficulty: 'middle',
              question: "What is a delegate?",
              options: ["An object that handles callbacks on behalf of another", "A class that cannot be subclassed", "A copy of a view controller", "A C macro"],
              correctIndex: 0,
              onWrongText: "Think about who gets told when something happens.",
            },
            {
              id: 'objc-s1',
              difficulty: 'senior',
              question: "What is a retain cycle?",
              options: ["Two objects hold strong references to each other, so neither is freed", "A loop that releases memory repeatedly", "A block copied to the heap twice", "A method that calls itself"],
              correctIndex: 0,
              onWrongText: "Neither object reaches zero references.",
            },
            {
              id: 'objc-s2',
              difficulty: 'senior',
              question: "Why is a delegate property usually declared weak?",
              options: ["To avoid a retain cycle between the object and its delegate", "To make the delegate faster", "So the delegate can never be nil", "To copy the delegate on assignment"],
              correctIndex: 0,
              onWrongText: "The delegate usually owns the object that points back to it.",
            },
            {
              id: 'objc-s3',
              difficulty: 'senior',
              question: "What does @synchronized do?",
              options: ["Locks a block so only one thread runs it at a time", "Syncs data with iCloud", "Creates a synchronized property", "Converts a method into a block"],
              correctIndex: 0,
              onWrongText: "It is a lock.",
            },
          ],
        },
        {
          id: 'oop',
          label: 'OOP Basics',
          completionFlag: 'quizOopDone',
          questions: [
            {
              id: 'oop-1',
              question: 'What does OOP stand for?',
              options: ['Object-Oriented Programming', 'Open-Output Programming', 'Object-Only Programming', 'Ordered Operation Protocol'],
              correctIndex: 0,
              onWrongText: 'Try again.',
            },
            {
              id: 'oop-2',
              question: 'What is it called when a class is based on another class, inheriting its features?',
              options: ['Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction'],
              correctIndex: 0,
              onWrongText: "That's a different OOP pillar.",
            },
            {
              id: 'oop-3',
              question: "What's the term for hiding internal details and exposing only what's necessary?",
              options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Overloading'],
              correctIndex: 0,
              onWrongText: 'Try again.',
            },
            {
              id: 'oop-m1',
              difficulty: 'middle',
              question: "What is the main benefit of encapsulation?",
              options: ["It hides internal state and exposes controlled behaviour", "It makes code run faster", "It removes the need for classes", "It allows multiple inheritance"],
              correctIndex: 0,
              onWrongText: "Think about who is allowed to change the data.",
            },
            {
              id: 'oop-m2',
              difficulty: 'middle',
              question: "What is an abstract class?",
              options: ["A class that cannot be instantiated and may declare abstract methods", "A class with no methods at all", "A class that can never be extended", "A class used only for static helpers"],
              correctIndex: 0,
              onWrongText: "You cannot create one directly.",
            },
            {
              id: 'oop-m3',
              difficulty: 'middle',
              question: "What does polymorphism mean?",
              options: ["One interface, many implementations", "Many classes sharing one object", "Having many constructors", "Copying objects deeply"],
              correctIndex: 0,
              onWrongText: "Same call, different behaviour.",
            },
            {
              id: 'oop-s1',
              difficulty: 'senior',
              question: "Which principle says a class should have only one reason to change?",
              options: ["Single Responsibility Principle", "Liskov Substitution Principle", "Open/Closed Principle", "Dependency Inversion Principle"],
              correctIndex: 0,
              onWrongText: "Think about one job per class.",
            },
            {
              id: 'oop-s2',
              difficulty: 'senior',
              question: "What does \"composition over inheritance\" suggest?",
              options: ["Build behaviour by combining objects instead of deep class hierarchies", "Always inherit from the largest class available", "Avoid interfaces entirely", "Copy methods between classes"],
              correctIndex: 0,
              onWrongText: "Prefer has-a over is-a.",
            },
            {
              id: 'oop-s3',
              difficulty: 'senior',
              question: "What does Liskov Substitution require?",
              options: ["A subclass must be usable wherever its superclass is expected", "Subclasses must have fewer methods", "Interfaces may not declare methods", "Every class must be final"],
              correctIndex: 0,
              onWrongText: "The subclass must not break the superclass contract.",
            },
          ],
        },
      ],
    },
  ],

  meepBeats: [
    { id: 'enter', trigger: 'onEnter', text: 'Ooh, a classroom! Smells like chalk and regret. Let\'s see what you remember - if anything.' },
    { id: 'manuel', trigger: 'onFlag', flag: 'talkedManuel', text: 'He seems like a good egg. Loud, but good.' },
    { id: 'francesco', trigger: 'onFlag', flag: 'talkedFrancesco', text: "Teacher's-pet energy, but he's not wrong about practicing daily." },
    { id: 'instructor', trigger: 'onFlag', flag: 'talkedInstructor', text: "Chapter four. Riveting stuff." },
    { id: 'quiz', trigger: 'onFlag', flag: 'quizPassed', text: 'Did... did you actually get all of that right? I\'m almost impressed.' },
    { id: 'complete', trigger: 'onComplete', text: 'Confusing, huh? I think it\'s time for a real school. University, here we come!' },
  ],

  completion: { requiredFlags: ['talkedManuel', 'talkedFrancesco', 'talkedInstructor', 'quizPassed'] },

  objectives: [
    { id: 'obj-manuel', label: 'Meet Manuel', flag: 'talkedManuel' },
    { id: 'obj-francesco', label: 'Meet Francesco', flag: 'talkedFrancesco' },
    { id: 'obj-instructor', label: 'Meet the instructor', flag: 'talkedInstructor' },
    { id: 'obj-quiz', label: 'Pass the pop quiz', flag: 'quizPassed' },
  ],
};
