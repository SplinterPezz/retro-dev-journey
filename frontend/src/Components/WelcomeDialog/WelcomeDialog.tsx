import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setTipsAcceptedDesktop, setTipsAcceptedMobile } from '../../store/welcomeSlice';
import './WelcomeDialog.css';

interface WelcomeDialogProps {
  isMobile: boolean;
}

const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ isMobile }) => {
  const dispatch = useDispatch();
  const { tipsAcceptedDesktop, tipsAcceptedMobile } = useSelector((state: RootState) => state.welcome);

  const shouldShow = isMobile ? !tipsAcceptedMobile : !tipsAcceptedDesktop;

  if (!shouldShow) {
    return <></>;
  }

  const handleAccept = () => {
    if (isMobile) {
      dispatch(setTipsAcceptedMobile(true));
    } else {
      dispatch(setTipsAcceptedDesktop(true));
    }
  };

  return (
    <>
      <div className="welcome-dialog-backdrop" />
      
      <div className={`welcome-dialog ${isMobile ? 'mobile' : 'desktop'}`}>
        <div className="rpgui-content">
          <div className="rpgui-container framed-golden">
            
            <h3 className="welcome-title">
              Welcome, Adventurer!
            </h3>

            <div className="dialog-separator">
              <hr className="golden" />
            </div>
            
            <div className="welcome-content">
              <div className="welcome-info-section">
                <label className="welcome-section-label">How to Explore:</label>
                
                <div className="controls-info">
                  {isMobile ? (
                    <div className="rpgui-container framed-grey">
                      <p className="control-info-text mb-0">
                        <strong className="controls-info-yellow">Use joystick</strong> to move around
                        <br /> 
                        <strong className="controls-info-yellow">Follow the sparks</strong> to know me!
                      </p>
                    </div>
                  ) : (
                    <div className="rpgui-container framed-grey">
                      <p className="control-info-text mb-0">
                        <strong className="controls-info-yellow">WASD</strong> or <strong className="controls-info-yellow">ARROWS</strong> to move • <strong className="controls-info-yellow">SHIFT</strong> or <strong className="controls-info-yellow">SPACE</strong> to run
                        <br /> 
                        <strong className="controls-info-yellow">Follow the sparks</strong> to know me!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="welcome-info-section">
                <label className="welcome-section-label">Your Journey:</label>
                <p className="welcome-description">
                  Explore my career path by walking near buildings and technologies. 
                  Each structure tells a story of my professional journey!
                </p>
              </div>

              <div className="accept-button-container">
                <button
                
                  className={`rpgui-button golden accept-button ${isMobile ? 'button-mobile' : 'button-desktop'}`}
                  type="button"
                  onClick={handleAccept}
                >
                  <p className="revert-top accept-button-text">Start Adventure!</p>
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeDialog;