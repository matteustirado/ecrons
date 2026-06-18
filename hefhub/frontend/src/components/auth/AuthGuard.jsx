import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import GlobalLoader from '../ui/GlobalLoader';

export default function AuthGuard({ children, allowedRoles }) {
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

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}