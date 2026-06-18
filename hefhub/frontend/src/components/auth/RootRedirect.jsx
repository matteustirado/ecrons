import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import GlobalLoader from '../ui/GlobalLoader';

const SUPER_ROLES = ['super'];
const ADMIN_ROLES = ['super', 'admin', 'adminsp', 'adminbh', 'adminrj'];
const PRESETS_ROLES = ['super', 'admin', 'adminsp', 'adminbh', 'adminrj', 'preset', 'presetsp', 'presetbh', 'presetrj'];
const GAME_ROLES = ['super', 'game', 'gamesp', 'gamebh', 'gamerj'];
const SCOREBOARD_DISPLAY_ROLES = ['super', 'admin', 'adminsp', 'adminbh', 'adminrj', 'display', 'displaysp', 'displaybh', 'displayrj'];
const PRICES_DISPLAY_ROLES = ['super', 'admin', 'adminsp', 'adminbh', 'adminrj', 'prices', 'pricesp', 'pricebh', 'pricerj', 'pricessp', 'pricesbh', 'pricesrj'];

export default function RootRedirect() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      const currentUrl = encodeURIComponent(window.location.origin + '/auth/callback');
      window.location.href = `https://auth.dedalosbar.com/login?redirect=${currentUrl}`;
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return <GlobalLoader />;
  }

  let targetPath = '/';
  
  if (SUPER_ROLES.includes(user.role)) targetPath = '/scoreboard-edit';
  else if (ADMIN_ROLES.includes(user.role)) targetPath = '/scoreboard-presets';
  else if (PRESETS_ROLES.includes(user.role)) targetPath = '/scoreboard-presets';
  else if (GAME_ROLES.includes(user.role)) targetPath = '/scoreboard-game';
  else if (SCOREBOARD_DISPLAY_ROLES.includes(user.role)) targetPath = '/scoreboard-display';
  else if (PRICES_DISPLAY_ROLES.includes(user.role)) targetPath = '/prices-display';

  return <Navigate to={targetPath} replace />;
}