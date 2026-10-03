import React, { Suspense, lazy, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { store, persistor } from './store/store';
import { cleanOldInteractions } from './store/trackingSlice';
import { useIubenda } from './hooks/useIubenda';
import { useFallbackToPortrait, useScreenRotation } from './hooks/screenOrientation';
import HomePage from './pages/Home/HomePage';
import PrivacyRedirect, { privacyRedirects } from './components/PrivacyRedirect/PrivacyRedirect';
import PrivateRoute from './components/Routing/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

// Only the home page is in the main bundle; every other page is its own chunk,
// so a first visit does not download the game, MUI or the charts.
const SandboxPage = lazy(() => import('./pages/Sandbox/SandboxPage'));
const StoryMapPage = lazy(() => import('./pages/Story/StoryMapPage'));
const StoryDifficultyPage = lazy(() => import('./pages/Story/StoryDifficultyPage'));
const ChapterRoute = lazy(() => import('./pages/Story/ChapterRoute'));
const SignIn = lazy(() => import('./pages/Login/SignIn'));
const AdminPage = lazy(() => import('./pages/Admin/AdminPage'));

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useIubenda();
  useScreenRotation();
  useFallbackToPortrait();

  useEffect(() => {
    store.dispatch(cleanOldInteractions());
  }, []);

  return <>{children}</>;
};

const PageLoading: React.FC = () => (
  <div className="rpgui-content page-loading">
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<PageLoading />} persistor={persistor}>
        <AppInitializer>
          <BrowserRouter>
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/story" element={<StoryMapPage />} />
                <Route path="/story/difficulty" element={<StoryDifficultyPage />} />
                <Route path="/story/:chapterId" element={<ChapterRoute />} />
                <Route path="/sandbox" element={<SandboxPage />} />
                <Route path="/login" element={<SignIn />} />

                {privacyRedirects.map(({ path, urlPath }) => (
                  <Route key={path} path={path} element={<PrivacyRedirect urlPath={urlPath} />} />
                ))}

                <Route path="/admin" element={<PrivateRoute />}>
                  <Route path="/admin" element={<AdminPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AppInitializer>
      </PersistGate>
    </Provider>
  );
}

export default App;
