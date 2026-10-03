// Text configuration
export const gameModeTitlePrefix: string = 'Get to Know';
export const gameModeTitleEasterEggWord: string = 'Me';
export const gameModeTitleSuffix: string = '!';

export const gameModeDescription: string = 'Pick your preferred way to discover my journey';

export const explorationModesLabel: string = 'Exploration Modes:';
export const storyModeButtonText: string = 'Story Mode';
export const sandboxModeButtonText: string = 'Sandbox';
export const gameModeHint: string = 'Choose wisely, adventurer!';
export const downloadCVButtonText: string = 'Download CV';

// Feature flags
export const storyModeEnabled: boolean = true; // set to true once Story Mode is playable
export const storyModeVisible: boolean = true; // set to false to hide the Story Mode button entirely
export const sandboxModeVisible: boolean = true; // set to false to hide the Sandbox button entirely
export const easterEggEnabled: boolean = true; // set to false to disable the title easter egg toggle
export const easterEggBlurAmount: number = 2; // blur amount in px applied to the background when the easter egg is inactive

// Shown instead of the modes when Story Mode is opened with a story already in progress
export const storyInProgressTitle: string = 'Welcome back!';
export const storyInProgressDescription: string = 'It seems you already have a story in progress. Would you like to continue it or start a new one?';
export const storyInProgressWarning: string = 'Starting a new story will erase your current progress.';
export const continueStoryButtonText: string = 'Continue';
export const newStoryButtonText: string = 'New Story';
export const storyInProgressBackText: string = 'Back';
