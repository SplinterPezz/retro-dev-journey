import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { ROUTES } from '../../config/routes';

// Opened directly (new tab, bookmark) without a difficulty: choose one first.
const RequireDifficulty: React.FC = () => {
  const hasDifficulty = useSelector((state: RootState) => !!state.story.difficulty);
  if (!hasDifficulty) return <Navigate to={ROUTES.storyDifficulty} replace />;
  return <Outlet />;
};

export default RequireDifficulty;
