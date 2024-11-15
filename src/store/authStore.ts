import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// Hardcoded credentials for testing
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'admin123';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (username: string, password: string) => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      set({ isAuthenticated: true, user: username });
      return true;
    }
    return false;
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));