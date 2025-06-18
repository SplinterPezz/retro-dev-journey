import React from 'react';
import './PixelProgressBar.css';

interface PixelProgressBarProps {
  progress: number; // 0-100
  width?: number;
  minWidth: number;
  height?: number;
  showPercentage?: boolean;
  animated?: boolean;
  variant?: 'default' | 'golden' | 'red' | 'blue' | 'green';
}

const PixelProgressBar: React.FC<PixelProgressBarProps> = ({
  progress,
  width = 300,
  minWidth = 280,
  height = 20,
  showPercentage = true,
  animated = true,
  variant = 'default'
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="pixel-progress-container">
      <div 
        className={`pixel-progress-bar ${variant} ${animated ? 'animated' : ''}`}
        style={{ width: `${width}%`, height: `${height}px`, minWidth:`${minWidth}px` }}
      >
        <div className="pixel-progress-border">
          <div className="pixel-progress-background">
            <div 
              className="pixel-progress-fill"
              style={{ width: `${clampedProgress}%` }}
            >
              {animated && (
                <div className="pixel-progress-shine" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showPercentage && (
        <div className="pixel-progress-text">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
};

export default PixelProgressBar;