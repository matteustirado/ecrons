import { create } from 'zustand';

// TODO: [TECH DEBT] - Fallback manual - Remover após integração do Webhook.
export const useGameTechDebtStore = create((set) => ({
  isGameUnlocked: false,
  unlockGame: () => set({ isGameUnlocked: true }),
  lockGame: () => set({ isGameUnlocked: false }),
}));
// TODO: [TECH DEBT] - Fallback manual - Remover após integração do Webhook.