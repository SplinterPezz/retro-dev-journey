import React from 'react';
import { storyUi } from '../../../config/story/sprites';
import './PcMonitor.css';

interface PcMonitorProps {
  children: React.ReactNode;
  onPowerOff: () => void;
}

const PcMonitor: React.FC<PcMonitorProps> = ({ children, onPowerOff }) => (
  <div className="pc-monitor-backdrop">
    <div className="pc-monitor">
      <img src={storyUi('pc_monitor')} alt="" className="pc-monitor-frame" />
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
