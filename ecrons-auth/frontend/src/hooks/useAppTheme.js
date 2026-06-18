import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { buildTheme } from '../utils/themeBuilder';

export function useAppTheme(redirectUrl) {
  return useQuery({
    queryKey: ['appTheme', redirectUrl],
    queryFn: async () => {
      if (!redirectUrl) return buildTheme(null);
      
      const { data } = await axiosClient.get(`/apps/theme?url=${encodeURIComponent(redirectUrl)}`);
      return buildTheme(data);
    },
    staleTime: 1000 * 60 * 15,
  });
}