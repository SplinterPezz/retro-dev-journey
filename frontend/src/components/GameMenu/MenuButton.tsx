import React from 'react';
import { createPortal } from 'react-dom';
import GameMenu from './GameMenu';
import { useGameMenu } from './GameMenuContext';
import './MenuButton.css';

interface MenuButtonProps {
  withMusic?: boolean; // show the music controls in the menu (pages that play music)
}

// The golden "☰ Menu" button of the game screens, and the menu it opens.
// Placement is up to the caller: wrap it in a container (e.g.
// `menu-fixed-top-left`) to position it.
const MenuButton: React.FC<MenuButtonProps> = ({ withMusic = true }) => {
  const { isOpen, open } = useGameMenu();
  return (
    <>
      <button type="button" className="rpgui-button golden menu-button" onClick={open}>
        <p className="revert-top">☰ Menu</p>
      </button>
      {/* On the page body, above everything: the button's own container is a
          fixed layer that would otherwise keep the window under the dialogue
          box and the joystick. rpgui-content brings the RPGUI styles along. */}
      {isOpen &&
        createPortal(
          <div className="rpgui-content game-menu-layer">
            <GameMenu withMusic={withMusic} />
          </div>,
          document.body
        )}
    </>
  );
};

export default MenuButton;
