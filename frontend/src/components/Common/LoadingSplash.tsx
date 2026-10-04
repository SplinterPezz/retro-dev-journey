import React from 'react';
import { loadingIcon } from '../../config/assets';
import './LoadingSplash.css';

interface LoadingSplashProps {
  title: string;
  leaving: boolean;
  loaded: number;
  total: number;
}

const LoadingSplash: React.FC<LoadingSplashProps> = ({ title, leaving, loaded, total }) => (
  <div className={`chapter-splash${leaving ? ' chapter-splash--leaving' : ''}`}>
    <h1 className="chapter-splash-title">{title}</h1>
    <div className="chapter-splash-loading" role="status">
      <span>
        {loaded}/{total} Loading
      </span>
      <img src={loadingIcon} alt="" className="chapter-splash-loading-icon" />
    </div>
  </div>
);

export default LoadingSplash;
