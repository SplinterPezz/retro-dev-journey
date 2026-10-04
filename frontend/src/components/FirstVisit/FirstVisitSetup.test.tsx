import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import storyReducer from '../../store/storySlice';
import settingsReducer from '../../store/settingsSlice';
import { GameMenuProvider } from '../GameMenu/GameMenuContext';
import FirstVisitSetup from './FirstVisitSetup';

const renderSetup = () => {
  const store = configureStore({ reducer: { story: storyReducer, settings: settingsReducer } });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <GameMenuProvider>
          <FirstVisitSetup>
            <p>the game</p>
          </FirstVisitSetup>
        </GameMenuProvider>
      </MemoryRouter>
    </Provider>,
  );
  return { store };
};

describe('FirstVisitSetup', () => {
  it('asks about sound before showing the game', () => {
    const { store } = renderSetup();
    expect(screen.getByText('Do you want sound?')).toBeInTheDocument();
    expect(screen.queryByText('the game')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Audio on'));
    expect(screen.getByText('the game')).toBeInTheDocument();
    expect(store.getState().settings).toMatchObject({ musicMuted: false, dialogueMuted: false, soundAsked: true });
  });

  it('keeps the sound off when the player says no', () => {
    const { store } = renderSetup();
    fireEvent.click(screen.getByText('Audio off'));
    expect(screen.getByText('the game')).toBeInTheDocument();
    expect(store.getState().settings).toMatchObject({ musicMuted: true, dialogueMuted: true, soundAsked: true });
  });
});
