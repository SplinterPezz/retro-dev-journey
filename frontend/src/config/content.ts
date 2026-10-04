
export interface DialogMessageConfig {
  speaker: string;
  text: string;
  delay: number;
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

export const forceIntroDialogAnimation: boolean = false;
