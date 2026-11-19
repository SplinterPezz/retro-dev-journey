import React from 'react';
import '../../Common/LoadingSplash.css';

interface ChapterCurtainProps {
  title: string;
  subtitle?: string;
  leaving: boolean;
}

// The black curtain of a chapter's closing scene: it fades in, optionally shows
// "<chapter> / <subtitle>", and fades out.
const ChapterCurtain: React.FC<ChapterCurtainProps> = ({ title, subtitle, leaving }) => (
  <div className={`chapter-splash chapter-splash--entering${leaving ? ' chapter-splash--leaving' : ''}`}>
    {subtitle && (
      <div className="chapter-splash-heading">
        <h1 className="chapter-splash-title">{title}</h1>
        <p className="chapter-splash-subtitle">{subtitle}</p>
      </div>
    )}
  </div>
);

export default ChapterCurtain;
