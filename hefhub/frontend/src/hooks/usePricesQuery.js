import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useSocket } from '../contexts/SocketContext';

export function usePricesQuery(unidade) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  const query = useQuery({
    queryKey: ['prices', unidade],
    queryFn: async () => {
      const [state, defaults, media, promos] = await Promise.all([
        axiosClient.get(`/prices/state/${unidade}`).then(res => res.data),
        axiosClient.get(`/prices/defaults?unidade=${unidade}`).then(res => res.data),
        axiosClient.get(`/prices/media/${unidade}`).then(res => res.data),
        axiosClient.get(`/prices/promotions/${unidade}`).then(res => res.data).catch(() => [])
      ]);
      return { state, defaults, media, promos };
    },
    enabled: !!unidade,
    staleTime: 1000 * 60 * 15,
  });

  useEffect(() => {
    if (!socket) return;

    const handlePricesUpdated = (data) => {
      if (!data?.unidade || data.unidade === unidade) {
        queryClient.invalidateQueries({ queryKey: ['prices', unidade] });
      }
    };

    socket.on('prices:updated', handlePricesUpdated);

    return () => {
      socket.off('prices:updated', handlePricesUpdated);
    };
  }, [socket, unidade, queryClient]);

  return query;
}