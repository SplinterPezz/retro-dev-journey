import React, { useState } from 'react';
import DialogBox from './DialogBox';

interface IntroDialogProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

const IntroDialog: React.FC<IntroDialogProps> = ({ 
  onComplete, 
  autoStart = true 
}) => {
  const [showDialog, setShowDialog] = useState(autoStart);

  const messages = [
    {
      speaker: "Dude",
      text: "Look how beautiful Palermo is...",
      delay: 1000 // Start after 1 second
    },
    {
      speaker: "????",
      text: "Bro, but ur leaving..",
      delay: 500 // 0.5 seconds between messages
    },
    {
      speaker: "Dude",
      text: "ur right.. thats my CV then",
      delay: 500 // 0.5 seconds between messages
    }
  ];

  const handleDialogComplete = () => {
    setShowDialog(false);
    if (onComplete) {
      onComplete();
    }
  };

  if (!showDialog) {
    return null;
  }

  return (
    <DialogBox
      messages={messages}
      onComplete={handleDialogComplete}
      typingSpeed={50} // 50ms per character
      messageDuration={3000} // 3 seconds per message
    />
  );
};

export default IntroDialog;