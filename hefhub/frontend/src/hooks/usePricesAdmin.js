import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

export function usePricesAdminQuery(unidade) {
  return useQuery({
    queryKey: ['pricesAdmin', unidade],
    queryFn: async () => {
      const [state, defaults, media, promos, holidays] = await Promise.all([
        axiosClient.get(`/prices/state/${unidade}`).then(res => res.data),
        axiosClient.get(`/prices/defaults?unidade=${unidade}`).then(res => res.data),
        axiosClient.get(`/prices/media/${unidade}`).then(res => res.data),
        axiosClient.get(`/prices/promotions/${unidade}`).then(res => res.data).catch(() => []),
        axiosClient.get(`/prices/holidays/${unidade}`).then(res => res.data).catch(() => [])
      ]);
      return { state, defaults, media, promos, holidays };
    },
    enabled: !!unidade,
  });
}

export function usePricesAdminMutations(unidade) {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['pricesAdmin', unidade] });

  const saveState = useMutation({
    mutationFn: (payload) => axiosClient.post(`/prices/state/${unidade}`, payload),
    onSuccess: () => {
      toast.success('Estado salvo com sucesso!');
      invalidate();
    },
    onError: () => toast.error('Erro ao salvar estado.')
  });

  const updateDefault = useMutation({
    mutationFn: (payload) => axiosClient.post('/prices/defaults', payload),
    onSuccess: () => {
      toast.success('Preço atualizado!');
      invalidate();
    },
    onError: () => toast.error('Erro ao atualizar preço.')
  });

  const updateCategoryMedia = useMutation({
    mutationFn: (payload) => axiosClient.post('/prices/media', payload),
    onSuccess: () => {
      toast.success('Mídia atualizada!');
      invalidate();
    },
    onError: () => toast.error('Erro ao atualizar mídia.')
  });

  const uploadMedia = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('mediaFile', file);
      const res = await axiosClient.post('/prices/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.url;
    }
  });

  return { saveState, updateDefault, updateCategoryMedia, uploadMedia };
}