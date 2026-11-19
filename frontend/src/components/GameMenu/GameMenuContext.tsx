import React, { createContext, use, useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router';

interface GameMenuState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const GameMenuContext = createContext<GameMenuState>({ isOpen: false, open: () => {}, close: () => {} });

export const GameMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  // open only on the page it was opened from: any page change closes it
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const isOpen = openedOn === pathname;

  const open = useCallback(() => setOpenedOn(pathname), [pathname]);
  const close = useCallback(() => setOpenedOn(null), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return <GameMenuContext value={value}>{children}</GameMenuContext>;
};

export const useGameMenu = () => use(GameMenuContext);
