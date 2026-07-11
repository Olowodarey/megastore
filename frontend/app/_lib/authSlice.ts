import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  // False until we've had a chance to read localStorage on the client.
  // Pages that guard on `token` must wait for this to avoid bouncing an
  // already-logged-in user to /login during the brief window before
  // rehydration runs (Redux state always starts null on a fresh page load).
  hasHydrated: boolean;
}

const loadAuth = (): Omit<AuthState, 'hasHydrated'> => {
  if (typeof window === 'undefined') return { user: null, token: null };
  try {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    return { token, user: user ? JSON.parse(user) : null };
  } catch {
    return { user: null, token: null };
  }
};

const initialState: AuthState = { user: null, token: null, hasHydrated: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.hasHydrated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', action.payload.token);
        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.hasHydrated = true;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    },
    initializeAuth: (state) => {
      const loaded = loadAuth();
      state.user = loaded.user;
      state.token = loaded.token;
      state.hasHydrated = true;
    },
  },
});

export const { setCredentials, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
