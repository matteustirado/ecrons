import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('hefhub_user')) || null,
  token: localStorage.getItem('hefhub_token') || null,
  isAuthenticated: !!localStorage.getItem('hefhub_token'),
  
  setAuth: (user, token) => {
    localStorage.setItem('hefhub_token', token);
    localStorage.setItem('hefhub_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('hefhub_token');
    localStorage.removeItem('hefhub_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));