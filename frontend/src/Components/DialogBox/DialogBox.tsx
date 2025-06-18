import React, { useState, useEffect } from 'react';
import './DialogBox.css';

interface DialogMessage {
  speaker: string;
  text: string;
  delay: number;
}

interface DialogBoxProps {
  messages: DialogMessage[];
  onComplete?: () => void;
  typingSpeed?: number;
  messageDuration?: number;
}

const DialogBox: React.FC<DialogBoxProps> = ({
  messages,
  onComplete,
  typingSpeed = 50,
  messageDuration = 3000
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentMessageIndex >= messages.length) {
      if (onComplete) {
        onComplete();
      }
      return;
    }

    const currentMessage = messages[currentMessageIndex];
    
    const delayTimeout = setTimeout(() => {
      setIsVisible(true);
      setIsTyping(true);
      setDisplayedText('');

      let charIndex = 0;
      const fullText = `${currentMessage.speaker}: ${currentMessage.text}`;
      
      const typingInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, charIndex + 1));
          charIndex++;
        } else {
          // Typing completed
          setIsTyping(false);
          clearInterval(typingInterval);
          
          // Hide message after duration
          setTimeout(() => {
            setIsVisible(false);
            
            // Move to next message after fade out
            setTimeout(() => {
              setCurrentMessageIndex(prev => prev + 1);
            }, 500); // Wait for fade out animation
            
          }, messageDuration);
        }
      }, typingSpeed);

      return () => clearInterval(typingInterval);
    }, currentMessage.delay);

    return () => clearTimeout(delayTimeout);
  }, [currentMessageIndex, messages, typingSpeed, messageDuration, onComplete]);

  if (currentMessageIndex >= messages.length) {
    return null;
  }

  return (
    <div className={`dialog-box-container d-none d-sm-block ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="rpgui-content">
        <div className="rpgui-container framed">
          <div className="dialog-content">
            <p className="dialog-text">
              {displayedText}
              {isTyping && <span className="cursor">|</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;