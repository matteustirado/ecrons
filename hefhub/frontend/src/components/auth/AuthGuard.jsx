import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import GlobalLoader from '../ui/GlobalLoader';

export default function AuthGuard({ children, allowedRoles }) {
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      const currentUrl = encodeURIComponent(window.location.origin + '/auth/callback');
      window.location.href = `https://auth.dedalosbar.com/login?redirect=${currentUrl}`;
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return <GlobalLoader />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRoles = (user.role || '').toLowerCase();
    const isSuper = userRoles.includes('super');
    
    const hasAccess = isSuper || allowedRoles.some(role => userRoles.includes(role.toLowerCase()));
    
    if (!hasAccess) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-black px-4 text-center text-white">
          <span className="material-symbols-outlined mb-4 text-6xl text-red-500">gpp_bad</span>
          <h1 className="mb-2 text-3xl font-black uppercase tracking-widest text-white/90">Acesso Negado</h1>
          <p className="mb-8 max-w-md text-white/50">
            Seu usuário não possui permissão para acessar esta ferramenta.
            <br /><br />
            Permissão atual: <strong className="text-white/80">{user.role}</strong>
          </p>
          <button 
            onClick={() => {
              logout();
              const currentUrl = encodeURIComponent(window.location.origin + '/auth/callback');
              window.location.href = `https://auth.dedalosbar.com/login?redirect=${currentUrl}`;
            }}
            className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-6 py-3 font-bold uppercase tracking-widest text-red-400 transition-colors hover:bg-red-500/20"
          >
            <span className="material-symbols-outlined">logout</span>
            Trocar de Conta
          </button>
        </div>
      );
    }
  }

  return children;
}