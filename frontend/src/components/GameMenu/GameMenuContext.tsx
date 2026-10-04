import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';

interface GameMenuState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const GameMenuContext = createContext<GameMenuState>({ isOpen: false, open: () => {}, close: () => {} });

// Whether the game menu is open, for the whole app: the menu button opens it,
// and every scene reads it to pause (no walking, no dialogues) while it is up.
// It closes by itself on any page change.
export const GameMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setIsOpen(false), [pathname]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return <GameMenuContext.Provider value={value}>{children}</GameMenuContext.Provider>;
};

export const useGameMenu = () => useContext(GameMenuContext);
