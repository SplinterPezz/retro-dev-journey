import { StructureData } from '../types/sandbox';

export const downloadButtonId: string = 'download-button';
export const downloadCVCooldown: number = 60;

export const sandboxAudioTrack: string = '/audio/sandbox_compressed.mp3';
export const sandboxDefaultVolume: number = 15;
export const sandboxBackgroundImage: string = '/backgrounds/sky_sandbox.png';

export const hideDownloadButtonInSandbox: boolean = false; // default false (button visible); set to true to hide the Download CV button in the sandbox

export const downloadButton : StructureData = {
  id: downloadButtonId,
  name: 'download',
  type: 'statue',
  position: {x: 1200, y: 2900},
  description: "Download CV!",
  data: {
    animatedImage: "/sprites/others/download_button_2_frames.gif",
    id: "download",
    name: "download",
    position: {x: 0, y: 0},
    centering : {x: -130, y: -120},
    image: "/sprites/others/download_button.png",
  },
  interactionRadius: 100
}

