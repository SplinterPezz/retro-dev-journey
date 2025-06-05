import React, { useState, useEffect } from "react";
import AudioControls from "../../Components/AudioControls/AudioControls";
import GameModeSelector from "../../Components/GameModeSelector/GameModeSelector";
import "./HomePage.css";
import IntroDialog from "../../Components/DialogBox/IntroDialogBox";

export default function HomePage() {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Disable scroll 
    document.body.classList.add('homepage-active');

    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = '/backgrounds/3dcjfz5xxyw21.gif';
  }, []);
  
  const handleDialogComplete = () => {
    console.log("Dialog complete")
  };

  return (
    <div className="rpgui-content">
      <div className="homepage-container">
        {/* Audio Controls */}
        
        
        <div 
          className={`homepage-background ${!imageLoaded ? 'loading' : ''}`}
          style={{
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out'
          }}
        />
        
        {imageLoaded && <GameModeSelector />}

        {imageLoaded && 
          <IntroDialog 
            onComplete={handleDialogComplete} 
            initialDelay={3000} 
            debugMode={false}
          />
        }
        
        <AudioControls 
          audioSrc="/audio/home_compressed.mp3"
          defaultVolume={20}
          defaultMuted={true}
          position="top-right"
          buttonStyle="normal"
          containerStyle="framed-grey"
          loop={true}
          autoPlay={false}
          showVolumePercentage={true}
        />

        {/* Loading indicator */}
        {!imageLoaded && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '1.2rem',
            zIndex: 10
          }}>
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}