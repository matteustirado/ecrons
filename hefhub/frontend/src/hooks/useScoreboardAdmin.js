import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

export function useScoreboardAdminQuery(unidade) {
  return useQuery({
    queryKey: ['scoreboardAdmin', unidade],
    queryFn: async () => {
      try {
        const res = await axiosClient.get(`/scoreboard/active/${unidade}`);
        return res.data;
      } catch {
        return { titulo: '', layout: 'landscape', opcoes: [] };
      }
    },
    enabled: !!unidade,
  });
}

export function useScoreboardPresetsQuery(unidade) {
  return useQuery({
    queryKey: ['scoreboardPresets', unidade],
    queryFn: async () => {
      const res = await axiosClient.get(`/scoreboard/presets/${unidade}`);
      return res.data;
    },
    enabled: !!unidade,
  });
}

export function useScoreboardReportQuery(unidade, month, year) {
  return useQuery({
    queryKey: ['scoreboardReport', unidade, month, year],
    queryFn: async () => {
      const res = await axiosClient.get(`/scoreboard/history/${unidade}?month=${month}&year=${year}`);
      return res.data;
    },
    enabled: !!unidade && !!month && !!year,
  });
}

export function useScoreboardAdminMutations(unidade) {
  const queryClient = useQueryClient();

  const saveActive = useMutation({
    mutationFn: (data) => axiosClient.post('/scoreboard/active', { ...data, unidade, status: 'ATIVO' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scoreboardAdmin', unidade] });
    },
  });

  const savePreset = useMutation({
    mutationFn: (data) => axiosClient.post('/scoreboard/presets', { ...data, unidade }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scoreboardPresets', unidade] });
    },
  });

  const deletePreset = useMutation({
    mutationFn: (id) => axiosClient.delete(`/scoreboard/presets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scoreboardPresets', unidade] });
    },
  });

  const uploadMedia = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('scoreboardImage', file);
      const res = await axiosClient.post('/scoreboard/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.url;
    },
  });

  return { saveActive, savePreset, deletePreset, uploadMedia };
}