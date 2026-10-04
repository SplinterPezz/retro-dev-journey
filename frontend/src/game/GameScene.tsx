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
// Imported here first so every scene chunk gets these stylesheets in the same order.
import '../components/Terrain/TerrainRenderer.css';
import '../components/Structures/Structure.css';
import '../components/Player/Player.css';
import './DebugOverlay.css';
import '../components/GameMenu/MenuButton.css';

interface GameSceneProps {
  // CSS class prefix: `${name}-viewport`, `${name}-world`
  name: string;
  world: Pick<WorldConfig, 'width' | 'height'>;
  playerPosition: Position;
  children: React.ReactNode;
  overlay?: React.ReactNode;
  joystick?: { onMove: (e: JoystickMoveEvent) => void; onStop: () => void; enabled?: boolean };
  music?: string;
  playerHitbox?: Hitbox;
  debugActions?: DebugAction[];
}

const PLAYER_DEBUG_ID = 'player';

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
