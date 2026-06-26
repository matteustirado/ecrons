import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import axiosClient from '../api/axiosClient';
import GlobalLoader from '../components/ui/GlobalLoader';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');

    const redirectToSSO = (delay = 0) => {
      const currentUrl = encodeURIComponent(window.location.origin + '/auth/callback');
      setTimeout(() => {
        window.location.href = `https://auth.dedalosbar.com/login?redirect=${currentUrl}`;
      }, delay);
    };

    if (!code) {
      console.warn('[AUTH CALLBACK] Nenhum código encontrado. Redirecionando em 3s para evitar loop...');
      return redirectToSSO(3000); 
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const exchangeCodeForSession = async () => {
      try {
        const { data } = await axiosClient.post('/auth/exchange', { code });
        
        const { accessToken, user } = data;
        
        let unidade = user?.unidade || 'SP';
        if (user?.role) {
          const roleStr = user.role.toLowerCase();
          if (roleStr.includes('-rj') || roleStr === 'admin_rj') unidade = 'RJ';
          else if (roleStr.includes('-bh') || roleStr === 'admin_bh') unidade = 'BH';
        }
        
        const userObj = { ...user, unidade };
        
        setAuth(userObj, accessToken);
        navigate('/prices-edit', { replace: true });
      } catch (error) {
        console.error('[AUTH CALLBACK] Falha ao trocar código de autorização:', error);
        redirectToSSO(3000); 
      }
    };

    exchangeCodeForSession();
  }, [searchParams, navigate, setAuth]);

  return <GlobalLoader />;
}