// Every story flag name. The string values are saved in the players' progress:
// never change a value (rename the key instead), or existing saves lose it.

export const ENGINE_FLAGS = {
  introSeen: 'introSeen',
  openingCued: 'openingCued',
  objectivesDone: 'objectivesDone',
  collectiblesAllFound: 'collectiblesAllFound',
} as const;

export const seenFlag = (npcId: string, nodeId: string): string => `__seen_${npcId}_${nodeId}`;

export const cuedFlag = (npcId: string): string => `${npcId}_cued`;

export const revealFlag = (collectibleId: string): string => `collectible_${collectibleId}_revealed`;

export const PROLOGUE_FLAGS = {
  talkedManuel: 'talkedManuel',
  talkedFrancesco: 'talkedFrancesco',
  talkedInstructor: 'talkedInstructor',
  instructorAnswered: 'instructorAnswered',
  quizPassed: 'quizPassed',
  quizIntroSeen: 'quizIntroSeen',
  quizJavaDone: 'quizJavaDone',
  quizAndroidDone: 'quizAndroidDone',
  quizObjCDone: 'quizObjCDone',
  quizOopDone: 'quizOopDone',
  lessonAnnounced: 'lessonAnnounced',
  seated: 'seated',
  miniGamesDone: 'miniGamesDone',
  outroStarted: 'outroStarted',
  prologueEnded: 'prologueEnded',
  gotDrumstick: 'gotDrumstick',
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

export const EIKONY_FLAGS = {
  talkedGiancarlo: 'talkedGiancarlo',
  talkedDesigner: 'talkedDesigner',
  layoutIntroSeen: 'layoutIntroSeen',
  layoutCategoryDone: 'layoutCategoryDone',
  layoutDone: 'layoutDone',
  debugIntroSeen: 'debugIntroSeen',
  debugCategoryDone: 'debugCategoryDone',
  debugDone: 'debugDone',
} as const;
