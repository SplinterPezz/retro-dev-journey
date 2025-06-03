import React, { useState, useEffect } from 'react';
import DialogBox from './DialogBox';

interface IntroDialogProps {
  onComplete?: () => void;
  autoStart?: boolean;
  initialDelay?: number;
  debugMode?: boolean;
}

const IntroDialog: React.FC<IntroDialogProps> = ({ 
  onComplete, 
  autoStart = true,
  initialDelay = 2000,
  debugMode = false
}) => {
  const [showDialog, setShowDialog] = useState(debugMode);

  useEffect(() => {
    if (autoStart && !debugMode) {
      const timer = setTimeout(() => {
        setShowDialog(true);
      }, initialDelay);

      return () => clearTimeout(timer);
    }
  }, [autoStart, initialDelay, debugMode]);

  const messages = [
    {
      speaker: "Dude",
      text: "Look how beautiful Italy is...",
      delay: debugMode ? 0 : 1000
    },
    {
      speaker: "????", 
      text: "Bro, but ur leaving Italy...",
      delay: debugMode ? 0 : 500
    },
    {
      speaker: "Dude",
      text: "Ur right.. thats my CV then...",
      delay: debugMode ? 0 : 500
    }
  ];

  const handleDialogComplete = () => {
    if (!debugMode) {
      setShowDialog(false);
    }
    if (onComplete) {
      onComplete();
    }
  };

  if (!showDialog) {
    return null;
  }

  // In modalità debug, mostra solo un messaggio statico
  if (debugMode) {
    return (
      <div className="dialog-box-container visible">
        <div className="rpgui-content">
          <div className="rpgui-container framed">
            <div className="dialog-content">
              <p className="dialog-text">
                Dude: ur right.. thats my CV then..
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DialogBox
      messages={messages}
      onComplete={handleDialogComplete}
      typingSpeed={50}
      messageDuration={3000}
    />
  );
};

export default IntroDialog;