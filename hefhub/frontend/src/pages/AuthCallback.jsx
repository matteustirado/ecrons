import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import * as jwtDecodeModule from 'jwt-decode';
import GlobalLoader from '../components/ui/GlobalLoader';

const decodeToken = jwtDecodeModule.jwtDecode || jwtDecodeModule.default || jwtDecodeModule;

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      try {
        const decoded = decodeToken(token);
        
        let unidade = 'SP';
        if (decoded.role) {
          const roleStr = decoded.role.toLowerCase();
          if (roleStr.includes('-rj') || roleStr === 'admin_rj') {
            unidade = 'RJ';
          } else if (roleStr.includes('-bh') || roleStr === 'admin_bh') {
            unidade = 'BH';
          }
        }
        
        const userObj = { ...decoded, unidade };
        setAuth(userObj, token);
        navigate('/prices-edit', { replace: true });
      } catch (error) {
        console.error('[AUTH CALLBACK] Erro ao decodificar token:', error);
        navigate('/prices-display', { replace: true });
      }
    } else {
      navigate('/prices-display', { replace: true });
    }
  }, [searchParams, navigate, setAuth]);

  return <GlobalLoader />;
}