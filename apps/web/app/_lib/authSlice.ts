import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

const loadAuth = (): AuthState => {
  if (typeof window === 'undefined') return { user: null, token: null };
  try {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    return { token, user: user ? JSON.parse(user) : null };
  } catch {
    return { user: null, token: null };
  }
};

const initialState: AuthState = { user: null, token: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', action.payload.token);
        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    },
    initializeAuth: (state) => {
      const loaded = loadAuth();
      state.user = loaded.user;
      state.token = loaded.token;
    },
  },
});

export const { setCredentials, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
