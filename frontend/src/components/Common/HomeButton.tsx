import React from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../config/routes';
import './HomeButton.css';

// Reusable "back to portfolio" button. It only navigates to the home page, so any
// progress kept by the screen it sits on is untouched. Placement is up to the
// caller: wrap it in a container (e.g. `home-fixed-top-left`) to position it.
const HomeButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button type="button" className="rpgui-button golden home-button" onClick={() => navigate(ROUTES.home)}>
      <p className="revert-top">🏠 Home</p>
    </button>
  );
};

export default HomeButton;
