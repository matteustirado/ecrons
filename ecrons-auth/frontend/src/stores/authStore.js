import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      auth: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) => set({ auth: user, accessToken, isAuthenticated: true }),
      logout: () => set({ auth: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'ecrons_auth_secure_session',
      storage: createJSONStorage(() => localStorage),
    }
  )
);