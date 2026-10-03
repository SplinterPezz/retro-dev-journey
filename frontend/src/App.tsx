import './App.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./store/store";
import { cleanOldInteractions } from './store/trackingSlice';
import { BrowserRouter, Routes, Route } from "react-router";
import { useEffect } from 'react';
import PrivateRoute from './Utils/PrivateRoute';
import SignIn from './Pages/Login/Signin';
import AdminPage from './Pages/Admin/AdminPage';
import HomePage from './Pages/Home/HomePage';
import SandboxPage from './Pages/Sandbox/SandBoxPage';
import StoryMapPage from './Pages/Story/StoryMapPage';
import StoryDifficultyPage from './Pages/Story/StoryDifficultyPage';
import ChapterScenePage from './Pages/Story/ChapterScenePage';
import { prologueChapter } from './config/story/prologue';
import { eikonyChapter } from './config/story/eikony';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import PrivacyRedirect from './Components/PrivacyRedirect/PrivacyRedirect';
import { useFallbackToPortrait, useScreenRotation } from './Components/Common/screenOrientation';

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useScreenRotation();
  useFallbackToPortrait();

  useEffect(() => {
    store.dispatch(cleanOldInteractions());
  }, []);

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AppInitializer>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/story" element={<StoryMapPage />} />
              <Route path="/story/difficulty" element={<StoryDifficultyPage />} />
              <Route path="/story/prologue" element={<ChapterScenePage chapter={prologueChapter} />} />
              <Route path="/story/eikony" element={<ChapterScenePage chapter={eikonyChapter} />} />
              <Route path="/sandbox" element={<SandboxPage />} />
              <Route path="/login" element={<SignIn />} />

              <Route path="/privacy-policy" element={<PrivacyRedirect urlPath="legal?an=no&s_ck=false&newmarkup=yes" />} />
              <Route path="/policy" element={<PrivacyRedirect urlPath="legal?an=no&s_ck=false&newmarkup=yes" />} />
              <Route path="/privacy" element={<PrivacyRedirect urlPath="legal?an=no&s_ck=false&newmarkup=yes" />} />

              <Route path="/cookie" element={<PrivacyRedirect urlPath="cookie-policy?an=no&s_ck=false&newmarkup=yes" />} />
              <Route path="/cookies" element={<PrivacyRedirect urlPath="cookie-policy?an=no&s_ck=false&newmarkup=yes" />} />
              <Route path="/cookie-policy" element={<PrivacyRedirect urlPath="cookie-policy?an=no&s_ck=false&newmarkup=yes" />} />


              <Route path="/admin" element={<PrivateRoute />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppInitializer>
      </PersistGate>
    </Provider>
  );
}

export default App;