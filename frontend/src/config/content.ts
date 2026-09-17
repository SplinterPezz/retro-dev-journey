// Shared textual/content config — dialogs and copy reused or configured
// independently of any single page/component.

export interface DialogMessageConfig {
  speaker: string;
  text: string;
  delay: number; // delay in ms before this message appears (non-debug mode)
}

export const introDialogMessages: DialogMessageConfig[] = [
  {
    speaker: "Dude",
    text: "Look how beautiful Italy is...",
    delay: 1000
  },
  {
    speaker: "????",
    text: "Bro, but ur leaving Italy...",
    delay: 500
  },
  {
    speaker: "Dude",
    text: "Ur right.. thats my CV then...",
    delay: 500
  }
];

export const introDialogTypingSpeed: number = 50;
export const introDialogMessageDuration: number = 3000;

// set to true to always show the full animated intro dialog (typing effect,
// all messages in sequence), even when the app is running with debugMode on
export const forceIntroDialogAnimation: boolean = false;
