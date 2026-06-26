import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// TODO: [TECH DEBT] - Fallback manual - Remover após integração do Webhook.
export function useThermometerPolling(unidade) {
  return useQuery({
    queryKey: ['thermometerPolling', unidade],
    queryFn: async () => {
      if (!unidade) return { quantidade_aberta: 0 };
      
      const baseUrl = import.meta.env.VITE_SITE_MAE_URL || 'https://api.dedalos.com.br';
      const token = import.meta.env.VITE_SITE_MAE_TOKEN;

      try {
        const response = await axios.get(`${baseUrl}/api/bar/v1/ocupacao/`, {
          headers: { Authorization: `Token ${token}` },
          timeout: 10000,
        });
        return { quantidade_aberta: response.data?.quantidade_aberta || 0 };
      } catch (error) {
        console.error('[Polling] Falha ao buscar ocupação:', error.message);
        return { quantidade_aberta: 0 };
      }
    },
    refetchInterval: 60000, 
    refetchIntervalInBackground: true,
    enabled: !!unidade,
  });
}
// TODO: [TECH DEBT] - Fallback manual - Remover após integração do Webhook.