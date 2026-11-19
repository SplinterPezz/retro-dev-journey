import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { ROUTES } from '../../config/routes';
import { useAppSelector } from '../../store/hooks';

// Opened directly (new tab, bookmark) without a difficulty: choose one first.
const RequireDifficulty: React.FC = () => {
  const hasDifficulty = useAppSelector((state) => !!state.story.difficulty);
  if (!hasDifficulty) return <Navigate to={ROUTES.storyDifficulty} replace />;
  return <Outlet />;
};

export default RequireDifficulty;
