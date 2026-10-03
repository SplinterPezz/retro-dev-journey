import React from 'react';
import './PcMonitor.css';

interface PcMonitorProps {
  children: React.ReactNode;
  onPowerOff: () => void; // the monitor's power button closes what is on screen
}

// A pixel-art monitor seen from the front. Whatever is passed as children is
// drawn on its screen; the power button under the screen switches it off.
const PcMonitor: React.FC<PcMonitorProps> = ({ children, onPowerOff }) => (
  <div className="pc-monitor-backdrop">
    <div className="pc-monitor">
      <img src="/sprites/story/ui/pc_monitor.png" alt="" className="pc-monitor-frame" />
      <div className="pc-monitor-screen">
        <div className="pc-monitor-content">{children}</div>
        <div className="pc-monitor-scanlines" aria-hidden="true" />
      </div>
      <button type="button" className="pc-monitor-power" onClick={onPowerOff} aria-label="Power off" title="Power off">
        <span className="pc-monitor-led" aria-hidden="true" />
      </button>
    </div>
  </div>
);

export default PcMonitor;
