import React from 'react';
import { Position, WorldConfig } from '../types/game';
import { cameraStyle } from './camera';
import { useZoomScale } from './zoom';
import { useLogicalViewport } from '../hooks/screenOrientation';
import { useIsMobile } from '../hooks/useIsMobile';
import ZoomSlider from '../components/Common/ZoomSlider';
import MobileJoystick, { JoystickMoveEvent } from '../components/Common/MobileJoystick';
import AudioControls from '../components/AudioControls/AudioControls';
import '../components/Common/scene-layout.css';
// Stylesheets of the pieces every scene draws, in one fixed order: the scenes
// are separate chunks that share them, and importing them here first keeps
// their order the same in each (CSS order decides ties between equal rules).
import '../components/Terrain/TerrainRenderer.css';
import '../components/Structures/Structure.css';
import '../components/Player/Player.css';
import './DebugOverlay.css';
import '../components/Common/HomeButton.css';

interface GameSceneProps {
  // Prefix of the scene's CSS classes: `${name}-viewport`, `${name}-world`.
  name: string;
  world: Pick<WorldConfig, 'width' | 'height'>;
  playerPosition: Position;
  children: React.ReactNode; // what lives in the world and follows the camera
  overlay?: React.ReactNode; // fixed UI drawn above the world
  joystick?: { onMove: (e: JoystickMoveEvent) => void; onStop: () => void; enabled?: boolean };
  audio?: { src: string; volume?: number };
}

// Shell shared by the Sandbox, the story map and the chapter interiors: a
// full-screen viewport with the world under a camera that follows the player,
// plus the zoom slider, the touch joystick on phones and the audio controls.
const GameScene: React.FC<GameSceneProps> = ({ name, world, playerPosition, children, overlay, joystick, audio }) => {
  const isMobile = useIsMobile();
  const viewport = useLogicalViewport();
  const zoomScale = useZoomScale();

  return (
    <>
      <div className={`${name}-viewport`}>
        <div
          className={`${name}-world`}
          style={{ width: world.width, height: world.height, ...cameraStyle(playerPosition, viewport, zoomScale) }}
        >
          {children}
        </div>
      </div>
      {overlay}
      <ZoomSlider />
      {isMobile && joystick && joystick.enabled !== false && (
        <MobileJoystick onMove={joystick.onMove} onStop={joystick.onStop} />
      )}
      {audio && <AudioControls audioSrc={audio.src} defaultVolume={audio.volume} />}
    </>
  );
};

export default GameScene;
