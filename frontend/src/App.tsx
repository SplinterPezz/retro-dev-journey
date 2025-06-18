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

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
              <Route path="/story" element={<HomePage />} />
              <Route path="/sandbox" element={<SandboxPage />} />
              <Route path="/login" element={<SignIn />} />
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