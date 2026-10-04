import React from 'react';
import { Hitbox, Position, WorldConfig } from '../types/game';
import { cameraStyle } from './camera';
import { useZoomScale } from './zoom';
import { useLogicalViewport } from '../hooks/screenOrientation';
import { useIsMobile } from '../hooks/useIsMobile';
import ZoomSlider from '../components/Common/ZoomSlider';
import MobileJoystick, { JoystickMoveEvent } from '../components/Common/MobileJoystick';
import ScreenButtons from '../components/Common/ScreenButtons';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import DebugOverlay from './DebugOverlay';
import DebugToolbar, { DebugAction } from './DebugToolbar';
import { isDev } from '../config/env';
import '../components/Common/scene-layout.css';
// Stylesheets of the pieces every scene draws, in one fixed order: the scenes
// are separate chunks that share them, and importing them here first keeps
// their order the same in each (CSS order decides ties between equal rules).
import '../components/Terrain/TerrainRenderer.css';
import '../components/Structures/Structure.css';
import '../components/Player/Player.css';
import './DebugOverlay.css';
import '../components/GameMenu/MenuButton.css';

interface GameSceneProps {
  // Prefix of the scene's CSS classes: `${name}-viewport`, `${name}-world`.
  name: string;
  world: Pick<WorldConfig, 'width' | 'height'>;
  playerPosition: Position;
  children: React.ReactNode; // what lives in the world and follows the camera
  overlay?: React.ReactNode; // fixed UI drawn above the world
  joystick?: { onMove: (e: JoystickMoveEvent) => void; onStop: () => void; enabled?: boolean };
  music?: string; // the scene's music track; volume and mute come from the game menu
  // Development builds only: the player's collision box and position readout
  // (when its hitbox is given), and the debug buttons of the page.
  playerHitbox?: Hitbox;
  debugActions?: DebugAction[];
}

const PLAYER_DEBUG_ID = 'player';

// Shell shared by the Sandbox, the story map and the chapter interiors: a
// full-screen viewport with the world under a camera that follows the player,
// plus the zoom slider, the scene's music, and on phones the touch joystick
// and the orientation / fullscreen buttons.
// In development it also draws the player's debug box, its coordinates and
// the page's debug buttons, the same in every scene.
const GameScene: React.FC<GameSceneProps> = ({ name, world, playerPosition, children, overlay, joystick, music, playerHitbox, debugActions = [] }) => {
  const isMobile = useIsMobile();
  const viewport = useLogicalViewport();
  useBackgroundMusic(music);
  const zoomScale = useZoomScale();

  return (
    <>
      <div className={`${name}-viewport`}>
        <div
          className={`${name}-world`}
          style={{ width: world.width, height: world.height, ...cameraStyle(playerPosition, viewport, zoomScale) }}
        >
          {children}
          {isDev && playerHitbox && <DebugOverlay player={{ id: PLAYER_DEBUG_ID, position: playerPosition, hitbox: playerHitbox }} />}
        </div>
      </div>
      {overlay}
      {isDev && playerHitbox && (
        <div className="debug-coords">
          x: {Math.round(playerPosition.x)} y: {Math.round(playerPosition.y)}
        </div>
      )}
      <DebugToolbar actions={debugActions} />
      <ZoomSlider />
      {isMobile && joystick && joystick.enabled !== false && (
        <MobileJoystick onMove={joystick.onMove} onStop={joystick.onStop} />
      )}
      <ScreenButtons />
    </>
  );
};

export default GameScene;
