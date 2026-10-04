import React from 'react';
import { Joystick } from 'react-joystick-component';
import './MobileJoystick.css';

export type JoystickMoveEvent = Parameters<NonNullable<React.ComponentProps<typeof Joystick>['move']>>[0];

interface MobileJoystickProps {
  onMove: (event: JoystickMoveEvent) => void;
  onStop: () => void;
}

const MobileJoystick: React.FC<MobileJoystickProps> = React.memo(({ onMove, onStop }) => (
  <div className="mobile-joystick">
    <Joystick
      size={100}
      sticky={false}
      baseColor="#4950579e"
      stickColor="rgba(210, 125, 44, 0.8)"
      move={onMove}
      stop={onStop}
      throttle={16}
      minDistance={15}
    />
  </div>
));

export default MobileJoystick;
