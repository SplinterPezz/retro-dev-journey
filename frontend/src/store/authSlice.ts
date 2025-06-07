import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from './store';

export interface AuthState {
  id: string | null;
  user: string | null;
  token: string | null;
  expiration: number | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  id : null,
  user: null,
  token: null,
  expiration: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ id:string, user: string; token: string; expiration: number }>) {
      state.id = action.payload.id;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.expiration = action.payload.expiration;
      state.isAuthenticated = true;
    },
    logoutSuccess(state) {
      state.id = null;
      state.user = null;
      state.token = null;
      state.expiration = null;
      state.isAuthenticated = false;
    },
    checkAuthentication(state) {
      // Check if the token is still valid
      // We can also implement some logics to ping authorization for 401 status
      if (state.expiration && Date.now() > (state.expiration * 1000)) {
        state.id = null;
        state.user = null;
        state.token = null;
        state.expiration = null;
        state.isAuthenticated = false;
      }
    }
  },
});

export const { loginSuccess, logoutSuccess, checkAuthentication } = authSlice.actions;
export const logout = () => (dispatch: AppDispatch) => {
  dispatch(logoutSuccess());
};

export default authSlice.reducer;