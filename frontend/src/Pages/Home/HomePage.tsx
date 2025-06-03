import React, { useState, useEffect } from "react";
import AudioControls from "../../Components/AudioControls";
import "./HomePage.css";

export default function HomePage() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Disable scroll 

    document.body.classList.add('homepage-active');

    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = '/backgrounds/3dcjfz5xxyw21.gif';

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Active Scroll on mount component
    return () => {
      document.body.classList.remove('homepage-active');
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className="homepage-container">
      {/* Audio Controls */}
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
      
      <div 
        className={`homepage-background ${!imageLoaded ? 'loading' : ''}`}
        style={{
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
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
  );
}