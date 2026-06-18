import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

const getHoraBrasil = () => {
  const date = new Date();
  return new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
};

const getPeriodo = (hora) => {
  if (hora >= 6 && hora < 14) return 'manha';
  if (hora >= 14 && hora < 20) return 'tarde';
  return 'noite';
};

const getTipoDia = (date, holidays) => {
  const ymd = date.toISOString().split('T')[0];
  const isHoliday = holidays.some((h) => h.dataFeriado.startsWith(ymd));
  if (isHoliday) return 'fim_de_semana';
  const day = date.getDay();
  if (day === 0 || day === 6) return 'fim_de_semana';
  return 'semana';
};

const getProximoPeriodo = (periodoAtual, tipoDiaAtual, diaSemanaAtual, isHolidayAmanha) => {
  if (periodoAtual === 'manha') return { periodo: 'tarde', tipo: tipoDiaAtual };
  if (periodoAtual === 'tarde') return { periodo: 'noite', tipo: tipoDiaAtual };
  let proximoTipo = 'semana';
  const diaSemanaAmanha = (diaSemanaAtual + 1) % 7;
  if (diaSemanaAmanha === 6 || diaSemanaAmanha === 0 || isHolidayAmanha) {
    proximoTipo = 'fim_de_semana';
  }
  return { periodo: 'manha', tipo: proximoTipo };
};

export function usePricesAdminQuery(unidade) {
  return useQuery({
    queryKey: ['pricesAdmin', unidade],
    queryFn: async () => {
      const [state, defaults, media, promos, holidays] = await Promise.all([
        axiosClient.get(`/prices/state/${unidade}`).then((res) => res.data),
        axiosClient.get(`/prices/defaults?unidade=${unidade}`).then((res) => res.data),
        axiosClient.get(`/prices/media/${unidade}`).then((res) => res.data),
        axiosClient.get(`/prices/promotions/${unidade}`).then((res) => res.data).catch(() => []),
        axiosClient.get(`/prices/holidays/${unidade}`).then((res) => res.data).catch(() => []),
      ]);

      let parsedPartyBanners = [];
      if (typeof state.partyBanners === 'string') {
        try {
          parsedPartyBanners = JSON.parse(state.partyBanners);
        } catch {
          parsedPartyBanners = [];
        }
      } else if (Array.isArray(state.partyBanners)) {
        parsedPartyBanners = state.partyBanners;
      }

      const parsedPromos = promos.map((p) => ({
        ...p,
        diasAtivos: Array.isArray(p.diasAtivos)
          ? p.diasAtivos.map(String)
          : JSON.parse(p.diasAtivos || '[]').map(String),
      }));

      const agora = getHoraBrasil();
      const tipoDia = getTipoDia(agora, holidays);
      const periodo = getPeriodo(agora.getHours());

      const amanha = new Date(agora);
      amanha.setDate(amanha.getDate() + 1);
      const isHolidayAmanha = holidays.some((h) => h.dataFeriado.startsWith(amanha.toISOString().split('T')[0]));

      const regraAtual = defaults.find(
        (d) => d.tipoDia === tipoDia && d.periodo === periodo && d.qtdPessoas === 1
      );
      
      const valorPadraoAgora = regraAtual ? parseFloat(regraAtual.valor) : 0;
      const valorRealApi = parseFloat(state.valorAtual || 0);
      const isPadrao = Math.abs(valorRealApi - valorPadraoAgora) < 0.5;

      let valorPadraoFuturo = null;
      if (isPadrao) {
        const next = getProximoPeriodo(periodo, tipoDia, agora.getDay(), isHolidayAmanha);
        const regraFutura = defaults.find(
          (d) => d.tipoDia === next.tipo && d.periodo === next.periodo && d.qtdPessoas === 1
        );
        valorPadraoFuturo = regraFutura ? parseFloat(regraFutura.valor) : null;
      }

      return {
        state: {
          ...state,
          partyBanners: parsedPartyBanners,
          valorRealApi,
          valorPadraoAgora,
          valorPadraoFuturo,
          isPadrao,
          periodoAtual: periodo,
          tipoDia: tipoDia,
        },
        defaults,
        media,
        promos: parsedPromos,
        holidays,
      };
    },
    enabled: !!unidade,
    staleTime: 0,
  });
}

export function usePricesAdminMutations(unidade) {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['pricesAdmin', unidade] });

  const saveState = useMutation({
    mutationFn: (data) => axiosClient.put(`/prices/state/${unidade}`, data),
    onSuccess: () => {
      toast.success('Preços atualizados.');
      invalidate();
    },
    onError: () => toast.error('Erro ao salvar preços.'),
  });

  const updateDefault = useMutation({
    mutationFn: (data) => axiosClient.put('/prices/defaults', data),
    onSuccess: () => invalidate(),
    onError: () => toast.error('Erro ao salvar preço padrão.'),
  });

  const updateCategoryMedia = useMutation({
    mutationFn: (data) => axiosClient.put('/prices/media', data),
    onSuccess: () => {
      toast.success('Mídia atualizada.');
      invalidate();
    },
    onError: () => toast.error('Erro ao atualizar mídia.'),
  });

  const uploadMedia = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('priceMedia', file);
      const res = await axiosClient.post('/prices/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.url;
    },
  });

  return { saveState, updateDefault, updateCategoryMedia, uploadMedia };
}