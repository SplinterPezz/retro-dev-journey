import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from './authSlice';
import trackingSlice, { cleanOldInteractions } from './trackingSlice';
import welcomeSlice from './welcomeSlice'
import contentSlice from './consentSlice'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'tracking', 'welcome', 'consent']
};

const rootReducer = combineReducers({
  auth: authSlice,
  tracking: trackingSlice,
  welcome: welcomeSlice,
  consent: contentSlice
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
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store, {}, () => {
  store.dispatch(cleanOldInteractions());
  
  if (process.env.REACT_APP_ENV === 'development') {
    const state = store.getState();
    console.log('Store initialized and old interactions cleaned:', {
      remainingInteractions: state.tracking.interactions.length,
      interactions: state.tracking.interactions
    });
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;