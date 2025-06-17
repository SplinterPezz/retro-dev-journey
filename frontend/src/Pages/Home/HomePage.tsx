import React, { useState, useEffect, MouseEventHandler } from "react";
import AudioControls from "../../Components/AudioControls/AudioControls";
import GameModeSelector from "../../Components/GameModeSelector/GameModeSelector";
import "./HomePage.css";
import IntroDialog from "../../Components/DialogBox/IntroDialogBox";
import { useTracking } from "../../hooks/tracking";
import { downloadCV } from '../../Services/fileService';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const { trackInteraction } = useTracking({
    page: 'homepage',
    enabled: true
  });

  useEffect(() => {
    document.body.classList.add('homepage-active');

    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = '/backgrounds/home_page.gif';
  }, []);

  const handleDialogComplete = () => {
    process.env.REACT_APP_ENV === 'development' && console.log("Dialog complete")
  };

  const handleAdminPage = () => {
    navigate("/admin")
  }

  const handleDownloadCV = (platform: string ) => {
    try {
      downloadCV();
    }
    catch(error){
      process.env.REACT_APP_ENV === 'development' && console.error('Download failed:', error);
    }
    trackInteraction(platform);
  };

  const handleTrkSocial = (platform: string ) => {
    trackInteraction(platform);
  }

  return (
    <>
      <div className="rpgui-content">
        {!imageLoaded ?
          <>
            <div className='homepage-background opacity-not-loaded-black loading' />
            <div className="loader-home">
              Loading...
            </div>
          </>
          :
          <div className="homepage-container">
            <div className='homepage-background' />
            <GameModeSelector handleDownloadClick={handleDownloadCV}/>
            <IntroDialog
              onComplete={handleDialogComplete}
              initialDelay={3000}
              debugMode={process.env.REACT_APP_ENV === 'development'}
            />
            <div>
              

              <AudioControls
                audioSrc="/audio/home_compressed.mp3"
                defaultVolume={20}
                defaultMuted={true}
                buttonStyle="normal"
                containerStyle="framed-grey"
                loop={true}
                autoPlay={false}
                showVolumePercentage={true}
                className="home-page"
              />

            </div>
            <div className="social-container">
                <a onClick={handleAdminPage}>
                  <img className="social-image me-4" src="/sprites/player/dude_turn.gif" />
                </a>
                <a href="https://www.linkedin.com/in/mauro-pezzati/" target="_blank" onClick={x => handleTrkSocial('linkedin')}>
                  <img className="social-image me-4" src="/sprites/others/linkedin.png" />
                </a>
                <a href="https://github.com/SplinterPezz/retro-dev-journey" target="_blank" onClick={x => handleTrkSocial('github')}>
                  <img className="social-image" src="/sprites/others/github.png" />
                </a>
              </div>
          </div>
        }
      </div>


    </>

  );
}