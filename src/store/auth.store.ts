import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse, AuthUser } from '../app/auth/types/auth';

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  setAuth: (payload: AuthResponse) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (payload) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('whazzonline-token', payload.token);
        }
        set({ user: payload.user, token: payload.token });
      },
      clearAuth: () => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('whazzonline-token');
        }
        set({ user: null, token: null });
      }
    }),
    { name: 'whazzonline-auth' }
  )
);
