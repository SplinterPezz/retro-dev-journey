import React, { useEffect, useRef } from 'react';
import './VirtualPad.css';

interface VirtualPadProps {
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  size?: 'small' | 'medium' | 'large';
  showRunButton?: boolean;
  style?: 'default' | 'rpg' | 'modern';
  className?: string;
  onKeyPress?: (key: string) => void;
  onKeyRelease?: (key: string) => void;
  onMounted?: () => void; // New callback for when component is fully mounted
}

const VirtualPad: React.FC<VirtualPadProps> = ({
  position = 'bottom-left',
  size = 'medium',
  showRunButton = true,
  style = 'rpg',
  className = '',
  onKeyPress,
  onKeyRelease,
  onMounted
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Notify parent when component is mounted and visible
  useEffect(() => {
    const checkMounted = () => {
      if (containerRef.current && containerRef.current.offsetParent !== null) {
        // Component is mounted and visible
        onMounted?.();
        if (process.env.REACT_APP_ENV === 'development') {
          console.log('📱 VirtualPad mounted and visible');
        }
      } else {
        // Retry after a short delay
        setTimeout(checkMounted, 50);
      }
    };

    // Small delay to ensure DOM is fully ready
    setTimeout(checkMounted, 100);
  }, [onMounted]);

  // Handle additional key press/release events if provided
  const handleKeyPress = (key: string) => {
    onKeyPress?.(key);
  };

  const handleKeyRelease = (key: string) => {
    onKeyRelease?.(key);
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'dpad-small';
      case 'large': return 'dpad-large';
      default: return 'dpad-medium';
    }
  };

  const getPositionClass = () => {
    switch (position) {
      case 'bottom-right': return 'dpad-bottom-right';
      case 'top-left': return 'dpad-top-left';
      case 'top-right': return 'dpad-top-right';
      default: return 'dpad-bottom-left';
    }
  };

  const getStyleClass = () => {
    switch (style) {
      case 'modern': return 'dpad-modern';
      case 'default': return 'dpad-default';
      default: return 'dpad-rpg';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`virtual-dpad-container ${getPositionClass()} ${getSizeClass()} ${getStyleClass()} ${className}`}
    >
      <div className="dpad-wrapper">
        <div className="mobile-dpad">
          
          <div 
            className="mobile-key-up dpad-button"
            onMouseDown={() => handleKeyPress('up')}
            onMouseUp={() => handleKeyRelease('up')}
            onMouseLeave={() => handleKeyRelease('up')}
            onTouchStart={() => handleKeyPress('up')}
            onTouchEnd={() => handleKeyRelease('up')}
          >
            <span className="dpad-icon">▲</span>
          </div>

          <div className="mobile-dpad-horizontal">
            <div 
              className="mobile-key-left dpad-button"
              onMouseDown={() => handleKeyPress('left')}
              onMouseUp={() => handleKeyRelease('left')}
              onMouseLeave={() => handleKeyRelease('left')}
              onTouchStart={() => handleKeyPress('left')}
              onTouchEnd={() => handleKeyRelease('left')}
            >
              <span className="dpad-icon">◀</span>
            </div>
            
            <div className="mobile-dpad-center">
              <div className="dpad-center-dot"></div>
            </div>
            
            <div 
              className="mobile-key-right dpad-button"
              onMouseDown={() => handleKeyPress('right')}
              onMouseUp={() => handleKeyRelease('right')}
              onMouseLeave={() => handleKeyRelease('right')}
              onTouchStart={() => handleKeyPress('right')}
              onTouchEnd={() => handleKeyRelease('right')}
            >
              <span className="dpad-icon">▶</span>
            </div>
          </div>

          <div 
            className="mobile-key-down dpad-button"
            onMouseDown={() => handleKeyPress('down')}
            onMouseUp={() => handleKeyRelease('down')}
            onMouseLeave={() => handleKeyRelease('down')}
            onTouchStart={() => handleKeyPress('down')}
            onTouchEnd={() => handleKeyRelease('down')}
          >
            <span className="dpad-icon">▼</span>
          </div>
        </div>
      </div>

      {showRunButton && (
        <div className="run-button-wrapper">
          <div 
            className="mobile-run-button dpad-button run-button"
            onMouseDown={() => handleKeyPress('run')}
            onMouseUp={() => handleKeyRelease('run')}
            onMouseLeave={() => handleKeyRelease('run')}
            onTouchStart={() => handleKeyPress('run')}
            onTouchEnd={() => handleKeyRelease('run')}
          >
            <span className="run-icon">🏃</span>
            <span className="run-text">RUN</span>
          </div>
        </div>
      )}

      {process.env.REACT_APP_ENV === 'development' && (
        <div className="dpad-debug-indicator">
          <span>📱</span>
        </div>
      )}
    </div>
  );
};

export default VirtualPad;