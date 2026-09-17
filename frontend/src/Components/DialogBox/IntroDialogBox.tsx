import React, { useState, useEffect } from 'react';
import DialogBox from './DialogBox';
import { introDialogMessages, introDialogTypingSpeed, introDialogMessageDuration, forceIntroDialogAnimation } from '../../config/content';

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
  debugMode: debugModeProp = false
}) => {
  const debugMode = debugModeProp && !forceIntroDialogAnimation;
  const [showDialog, setShowDialog] = useState(debugMode);

  useEffect(() => {
    if (autoStart && !debugMode) {
      const timer = setTimeout(() => {
        setShowDialog(true);
      }, initialDelay);

      return () => clearTimeout(timer);
    }
  }, [autoStart, initialDelay, debugMode]);

  const messages = introDialogMessages.map((message) => ({
    ...message,
    delay: debugMode ? 0 : message.delay
  }));

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

  if (debugMode) {
    const lastMessage = introDialogMessages[introDialogMessages.length - 1];
    return (
      <div className="dialog-box-container visible d-none d-sm-block">
        <div className="rpgui-content">
          <div className="rpgui-container framed">
            <div className="dialog-content">
              <p className="dialog-text">
                {lastMessage.speaker}: {lastMessage.text}
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
      typingSpeed={introDialogTypingSpeed}
      messageDuration={introDialogMessageDuration}
    />
  );
};

export default IntroDialog;