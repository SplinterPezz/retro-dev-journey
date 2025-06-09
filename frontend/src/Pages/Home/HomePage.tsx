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

  useEffect(() => {
    const checkRPGUI = () => {
        if (window.RPGUI) {
            console.log("LOADED!")
        } else {
            // Retry after a short delay
            setTimeout(checkRPGUI, 100);
        }
    };

    checkRPGUI();
  }, []);

  return (
    <div className="rpgui-content">
      <div className="homepage-container">
        {/* Audio Controls */}
        <div className={`homepage-background ${imageLoaded ? '' : 'opacity-not-loaded'} ${!imageLoaded ? 'loading' : ''}`}/>
        
        {imageLoaded && <GameModeSelector />}

        {imageLoaded && 
          <IntroDialog 
            onComplete={handleDialogComplete} 
            initialDelay={3000} 
            debugMode={process.env.REACT_APP_ENV === 'development'}
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
          <div className="loader-home">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
}