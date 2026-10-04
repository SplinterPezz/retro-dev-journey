import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { ROUTES } from '../../config/routes';

// The story map and the chapters need a story, and a story starts with its
// difficulty (and on phones the orientation, asked on the same page). Opening
// one of their URLs directly - a new tab, a bookmark - without one goes there
// first instead of playing with the default difficulty.
const RequireDifficulty: React.FC = () => {
  const hasDifficulty = useSelector((state: RootState) => !!state.story.difficulty);
  if (!hasDifficulty) return <Navigate to={ROUTES.storyDifficulty} replace />;
  return <Outlet />;
};

export default RequireDifficulty;
