import React, { useState } from 'react';
import { IntroPage } from '../../../types/story';
import './StoryIntroDialog.css';
import '../../Common/pixel-button.css';

interface StoryIntroDialogProps {
  title: string;
  pages: IntroPage[];
  onComplete: () => void;
  onClose?: () => void;
}

const StoryIntroDialog: React.FC<StoryIntroDialogProps> = ({ title, pages, onComplete, onClose }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const page = pages[pageIndex];
  const isLastPage = pageIndex === pages.length - 1;

  const handleNext = () => {
    if (isLastPage) {
      onComplete();
    } else {
      setPageIndex((i) => i + 1);
    }
  };

  return (
    <>
      <div className="story-intro-backdrop" />
      <div className="story-intro-dialog">
        <div className="rpgui-container framed-golden story-intro-box">
          {onClose && (
            <button type="button" className="story-intro-exit pixel-button" onClick={onClose} aria-label="Close">
              ×
            </button>
          )}
          <h2 className="story-intro-title">{title}</h2>
          <div className="dialog-separator">
            <hr className="golden" />
          </div>
          <p className="story-intro-text">{page.text}</p>

          <div className="story-intro-footer">
            <button type="button" className="rpgui-button golden story-intro-button" onClick={handleNext}>
              <p className="revert-top">{isLastPage ? "Let's go" : 'Continue'}</p>
            </button>
          </div>

          <span className="story-intro-progress">
            {pageIndex + 1} / {pages.length}
          </span>
        </div>
      </div>
    </>
  );
};

export default StoryIntroDialog;
