// Every story flag name, in one place.
//
// Story progress is a set of named booleans per chapter
// (state.story.chapters[chapterId].flags), saved in localStorage. A flag is
// set by something that happened (a line shown, an answer picked, a quiz
// passed) and read by whatever reacts to it (an objective, a prop appearing,
// an NPC sitting down, Meep commenting).
//
// Always refer to flags through these constants, never as bare strings: a
// typo becomes a compile error, and "Find references" on a flag shows
// everything that sets or reads it.
//
// The string VALUES are what is saved in the player's progress. Never change
// a value (rename the key instead), or existing saves lose that progress.

// ---- engine flags: set by the story engine itself, in every chapter ----

export const ENGINE_FLAGS = {
  /** The chapter's intro pages were closed. Set by ChapterScenePage; the opening dialogue waits for it. */
  introSeen: 'introSeen',
  /** The opening dialogue (chapter.openingDialogue) was shown, so it never shows again. Set by useChapterProgress. */
  openingCued: 'openingCued',
  /** Every objective of the chapter is done. Set by useChapterProgress; chapter configs use it to open the next step. */
  objectivesDone: 'objectivesDone',
  /** The "all collectibles found" window was confirmed. Set by InteriorScene. */
  collectiblesAllFound: 'collectiblesAllFound',
} as const;

// ---- generated flags: one per NPC, dialogue line or collectible ----

/** The dialogue line `nodeId` of `npcId` was shown at least once. Set by useDialogueEngine; locks answered questions. */
export const seenFlag = (npcId: string, nodeId: string): string => `__seen_${npcId}_${nodeId}`;

/** The NPC's automatic dialogue (autoStartFlag / autoStartNodeId) already ran. Set by useChapterProgress. */
export const cuedFlag = (npcId: string): string => `${npcId}_cued`;

/** A collectible's sequence or wait is done, so it stays available. Set by useCollectibles. */
export const revealFlag = (collectibleId: string): string => `collectible_${collectibleId}_revealed`;

// ---- Prologue (ANFE classroom) ----

export const PROLOGUE_FLAGS = {
  // objectives
  /** Talked to Manuel (any first topic). Objective "Meet Manuel". */
  talkedManuel: 'talkedManuel',
  /** Talked to Francesco (any first topic). Objective "Meet Francesco". */
  talkedFrancesco: 'talkedFrancesco',
  /** The instructor's first line was shown. Only used to remember the conversation started. */
  talkedInstructor: 'talkedInstructor',
  /** Answered the instructor's question. Objective "Meet the instructor"; afterwards the instructor only repeats a short line. */
  instructorAnswered: 'instructorAnswered',
  /** Every quiz topic cleared. Objective "Pass the pop quiz". */
  quizPassed: 'quizPassed',

  // the pop quiz
  /** The quiz's two intro pages were read. */
  quizIntroSeen: 'quizIntroSeen',
  /** Quiz topic cleared, one per topic. */
  quizJavaDone: 'quizJavaDone',
  quizAndroidDone: 'quizAndroidDone',
  quizObjCDone: 'quizObjCDone',
  quizOopDone: 'quizOopDone',

  // the story, in order
  /** The instructor's closing line ("Chapter four's starting...") was shown. Meep's "Chapter four" quip answers it. */
  lessonAnnounced: 'lessonAnnounced',
  /** Everyone sits down (the instructor's "take a seat"). NPCs move to their seats. */
  seated: 'seated',
  /** The laptop mini games are finished. Starts the closing scene. */
  miniGamesDone: 'miniGamesDone',
  /** The closing scene ("Some days later") has started; a reload goes back into it. */
  outroStarted: 'outroStarted',
  /** The closing scene is over: the door leads out and the chapter can be finished. */
  prologueEnded: 'prologueEnded',

  // collectibles
  /** Manuel gave the player his spare drumstick (the drumstick collectible). */
  gotDrumstick: 'gotDrumstick',

  // the player's answers, kept for later chapters
  instructorExperienceNever: 'instructorQ_experience_never',
  instructorExperienceALittle: 'instructorQ_experience_alittle',
  instructorExperienceExperienced: 'instructorQ_experience_experienced',
  manuelMusicRock: 'manuelQ_music_rock',
  manuelMusicElectronic: 'manuelQ_music_electronic',
  manuelMusicPlays: 'manuelQ_music_plays',
  manuelFutureJob: 'manuelQ_future_job',
  manuelFutureFreelance: 'manuelQ_future_freelance',
  manuelFutureUnsure: 'manuelQ_future_unsure',
  manuelWhyCodingCuriosity: 'manuelQ_whyCoding_curiosity',
  manuelWhyCodingMoney: 'manuelQ_whyCoding_money',
  manuelWhyCodingUnsure: 'manuelQ_whyCoding_unsure',
  francescoPhoneAndroid: 'francescoQ_phone_android',
  francescoPhoneApple: 'francescoQ_phone_apple',
  francescoPhoneOther: 'francescoQ_phone_other',
  francescoLearnVideo: 'francescoQ_learn_video',
  francescoLearnDocs: 'francescoQ_learn_docs',
  francescoLearnTrial: 'francescoQ_learn_trial',
  francescoStuckSelfReliant: 'francescoQ_stuck_selfReliant',
  francescoStuckLookItUp: 'francescoQ_stuck_lookItUp',
  francescoStuckAskSomeone: 'francescoQ_stuck_askSomeone',
  internshipExpectationBigTech: 'internshipExpectation_bigTech',
  internshipExpectationBetter: 'internshipExpectation_better',
  internshipExpectationCoffee: 'internshipExpectation_coffee',
  internshipExpectationScared: 'internshipExpectation_scared',
} as const;

// ---- Eikony (in development) ----

export const EIKONY_FLAGS = {
  /** Talked to Giancarlo. Required by the debug station. */
  talkedGiancarlo: 'talkedGiancarlo',
  /** Talked to the designer. Required by the layout station. */
  talkedDesigner: 'talkedDesigner',
  /** Layout station: intro read, its only topic cleared, station done. */
  layoutIntroSeen: 'layoutIntroSeen',
  layoutCategoryDone: 'layoutCategoryDone',
  layoutDone: 'layoutDone',
  /** Debug station: intro read, its only topic cleared, station done. */
  debugIntroSeen: 'debugIntroSeen',
  debugCategoryDone: 'debugCategoryDone',
  debugDone: 'debugDone',
} as const;
