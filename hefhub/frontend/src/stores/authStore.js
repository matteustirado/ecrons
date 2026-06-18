import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('hefhub_token') || null,
  isAuthenticated: !!localStorage.getItem('hefhub_token'),
  
  setAuth: (user, token) => {
    localStorage.setItem('hefhub_token', token);
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('hefhub_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));