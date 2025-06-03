import './App.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {store, persistor} from "./store/store"
import { BrowserRouter, Routes, Route } from "react-router";
import PrivateRoute from './Utils/PrivateRoute';
import SignIn from './Pages/Login/Signin';
import AdminPage from './Pages/Admin/AdminPage';
import HomePage from './Pages/Home/HomePage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}></PersistGate>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/story" element={<HomePage />} />
          <Route path="/sandbox" element={<HomePage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/admin" element={<PrivateRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
