import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import storyReducer, { setDifficulty } from '../../store/storySlice';
import { ROUTES } from '../../config/routes';
import RequireDifficulty from './RequireDifficulty';

const renderAt = (path: string, withDifficulty: boolean) => {
  const store = configureStore({ reducer: { story: storyReducer } });
  if (withDifficulty) store.dispatch(setDifficulty('junior'));
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={ROUTES.storyDifficulty} element={<p>difficulty page</p>} />
          <Route element={<RequireDifficulty />}>
            <Route path={ROUTES.storyMap} element={<p>story map</p>} />
            <Route path={ROUTES.chapter} element={<p>chapter</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe('RequireDifficulty', () => {
  it('sends a chapter opened directly by a new player to the difficulty choice', () => {
    renderAt('/story/prologue', false);
    expect(screen.getByText('difficulty page')).toBeInTheDocument();
  });

  it('sends the story map to the difficulty choice too', () => {
    renderAt(ROUTES.storyMap, false);
    expect(screen.getByText('difficulty page')).toBeInTheDocument();
  });

  it('lets a player with a difficulty in', () => {
    renderAt('/story/prologue', true);
    expect(screen.getByText('chapter')).toBeInTheDocument();
  });
});
