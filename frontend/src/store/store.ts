import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  createMigrate,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
// the ES build: the CommonJS one (lib/) comes through Vite as a module object
import storage from 'redux-persist/es/storage';
import authSlice from './authSlice';
import trackingSlice, { cleanOldInteractions } from './trackingSlice';
import welcomeSlice from './welcomeSlice'
import contentSlice from './consentSlice'
import storySlice from './storySlice'
import zoomSlice from './zoomSlice'
import settingsSlice from './settingsSlice'
import { migrations, PERSIST_VERSION } from './migrations';
import { devLog } from '../config/env';

const persistConfig = {
  key: 'root',
  version: PERSIST_VERSION,
  storage,
  whitelist: ['auth', 'tracking', 'welcome', 'consent', 'story', 'zoom', 'settings'],
  migrate: createMigrate(migrations, { debug: false }),
};

const rootReducer = combineReducers({
  auth: authSlice,
  tracking: trackingSlice,
  welcome: welcomeSlice,
  consent: contentSlice,
  story: storySlice,
  zoom: zoomSlice,
  settings: settingsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }),
  devTools: !import.meta.env.PROD,
});

export const persistor = persistStore(store, {}, () => {
  store.dispatch(cleanOldInteractions());
  devLog('Store initialized and old interactions cleaned:', store.getState().tracking.interactions);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;