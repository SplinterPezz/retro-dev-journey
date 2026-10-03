import { useState, useEffect } from "react";
import AudioControls from "../../components/AudioControls/AudioControls";
import GameModeSelector from "../../components/GameModeSelector/GameModeSelector";
import "./HomePage.css";
import IntroDialog from "../../components/DialogBox/IntroDialogBox";
import { useTracking } from "../../hooks/useTracking";
import { downloadCV } from '../../services/fileService';
import { useNavigate } from 'react-router';
import { playerTurnSprite } from "../../config/assets";
import { isDev, devLog, devError } from "../../config/env";
import { homeAudioTrack, homeDefaultVolume, homeBackgroundImage } from "../../config/home";

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
    img.src = homeBackgroundImage;

    return () => {
      img.onload = null;
      document.body.classList.remove('homepage-active');
    };
  }, []);

  const handleDialogComplete = () => devLog('Dialog complete');

  const handleAdminPage = () => {
    void navigate("/admin")
  }

  const handleDownloadCV = async (platform: string) => {
    trackInteraction(platform);
    try {
      await downloadCV();
    } catch (error) {
      devError('Download failed:', error);
    }
  };

  const handleTrkSocial = (platform: string ) => {
    trackInteraction(platform);
  }

  return (
    <>
      <div className="rpgui-content">
        {!imageLoaded ?
          <>
            <div className='homepage-background opacity-not-loaded-black loading' style={{ backgroundImage: `url(${homeBackgroundImage})` }} />
            <div className="loader-home">
              Loading...
            </div>
          </>
          :
          <div className="homepage-container">
            <div className='homepage-background' style={{ backgroundImage: `url(${homeBackgroundImage})` }} />
            <GameModeSelector handleDownloadClick={handleDownloadCV}/>
            <IntroDialog
              onComplete={handleDialogComplete}
              initialDelay={3000}
              debugMode={isDev}
            />
            <div>
              

              <AudioControls audioSrc={homeAudioTrack} defaultVolume={homeDefaultVolume} className="home-page" />

            </div>
            <div className="social-container">
                <a href="/admin" onClick={(e) => { e.preventDefault(); handleAdminPage(); }}>
                  <img className="social-image" alt="Admin" src={playerTurnSprite} />
                </a>
                <a href="https://www.linkedin.com/in/mauro-pezzati/" target="_blank" rel="noreferrer" onClick={() => handleTrkSocial('linkedin')}>
                  <img className="social-image" alt="LinkedIn" src="/sprites/others/linkedin.png" />
                </a>
                <a href="https://github.com/SplinterPezz/retro-dev-journey" target="_blank" rel="noreferrer" onClick={() => handleTrkSocial('github')}>
                  <img className="social-image" alt="GitHub" src="/sprites/others/github.png" />
                </a>
              </div>
          </div>
        }
      </div>
    </>
  );
}