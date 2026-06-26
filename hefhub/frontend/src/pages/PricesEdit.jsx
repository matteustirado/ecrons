import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, PartyPopper, AlertTriangle, CheckCircle, History, Clock, Film } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { usePricesAdminQuery, usePricesAdminMutations } from '../hooks/usePricesAdmin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import GlobalLoader from '../components/ui/GlobalLoader';

import SectionCard from '../components/views/prices/edit/SectionCard';
import AvisosEditor from '../components/views/prices/edit/AvisosEditor';
import DefaultsEditor from '../components/views/prices/edit/DefaultsEditor';
import CategoryMediaEditor from '../components/views/prices/edit/CategoryMediaEditor';
import PartyModeEditor from '../components/views/prices/edit/PartyModeEditor';
import PromoModal from '../components/views/prices/edit/PromoModal';
import HolidayModal from '../components/views/prices/edit/HolidayModal';

export default function PricesEdit() {
  const { user } = useAuthStore();
  const currentUnit = user?.unidade ? user.unidade.toUpperCase() : 'SP';
  const { data, isLoading } = usePricesAdminQuery(currentUnit);

  if (isLoading || !data?.state) {
    return <GlobalLoader />;
  }

  return <PricesEditContent currentUnit={currentUnit} data={data} />;
}

function PricesEditContent({ currentUnit, data }) {
  const queryClient = useQueryClient();
  const { saveState, updateDefault, updateCategoryMedia, uploadMedia } = usePricesAdminMutations(currentUnit);

  const [liveState, setLiveState] = useState(data.state);
  const [manualFuture, setManualFuture] = useState(data.state.valorFuturo || '');
  const [promotions, setPromotions] = useState([]);

  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [isIdentidadeOpen, setIsIdentidadeOpen] = useState(true);

  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');

  const addHoliday = useMutation({
    mutationFn: (payload) => axiosClient.post('/prices/holidays', payload),
    onSuccess: () => {
      toast.success('Feriado adicionado.');
      setNewHolidayName('');
      setNewHolidayDate('');
      queryClient.invalidateQueries({ queryKey: ['pricesAdmin', currentUnit] });
    },
    onError: () => toast.error('Erro ao adicionar feriado.'),
  });

  const deleteHoliday = useMutation({
    mutationFn: (id) => axiosClient.delete(`/prices/holidays/${id}`),
    onSuccess: () => {
      toast.success('Feriado removido.');
      queryClient.invalidateQueries({ queryKey: ['pricesAdmin', currentUnit] });
    },
    onError: () => toast.error('Erro ao remover feriado.'),
  });

  const savePromotions = useMutation({
    mutationFn: (payload) => axiosClient.post('/prices/promotions', payload),
    onSuccess: () => {
      toast.success('Promoções salvas.');
      setShowPromoModal(false);
      queryClient.invalidateQueries({ queryKey: ['pricesAdmin', currentUnit] });
    },
    onError: () => toast.error('Erro ao salvar promoções.'),
  });

  const handleSaveState = () => {
    saveState.mutate({
      modoFesta: liveState.modoFesta,
      partyBanners: JSON.stringify(liveState.partyBanners),
      valorFuturo: manualFuture === '' ? null : Number(manualFuture),
      textoFuturo: manualFuture === '' ? '???' : null,
      aviso1: liveState.aviso1,
      aviso2: liveState.aviso2,
      aviso3: liveState.aviso3,
      aviso4: liveState.aviso4,
    }, {
      onSuccess: () => toast.success('Painel de preços atualizado com sucesso.'),
      onError: () => toast.error('Falha ao sincronizar alterações com a TV.')
    });
  };

  const handlePromoUpload = async (files) => {
    if (!files || files.length === 0) return;
    const toastId = toast.loading(files.length > 1 ? `Enviando ${files.length} flyers...` : 'Enviando flyer...');
    try {
      const uploadPromises = Array.from(files).map((file) => uploadMedia.mutateAsync(file));
      const urls = await Promise.all(uploadPromises);
      const newPromotions = urls.map((url) => ({ imageUrl: url, diasAtivos: [] }));
      setPromotions((prev) => [...prev, ...newPromotions]);
      toast.update(toastId, { render: 'Flyer(s) adicionado(s).', type: 'success', isLoading: false, autoClose: 2000 });
    } catch {
      toast.update(toastId, { render: 'Erro ao enviar flyer(s).', type: 'error', isLoading: false, autoClose: 3000 });
    }
  };

  const openPromoModal = () => {
    setPromotions(data.promos || []);
    setShowPromoModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mx-auto mt-6 flex w-full max-w-360 flex-col px-4 pb-16 md:mt-10 md:px-8 lg:pb-24"
    >
      <div className="pointer-events-none absolute -left-16 -top-12 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-20 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl" />

      <div className="mb-8 flex shrink-0 flex-col items-start justify-between gap-5 md:mb-12 md:flex-row md:items-center">
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
          Manutenção de Preços
        </h1>

        <div className="flex w-full flex-wrap gap-3 md:w-auto md:gap-4">
          <button
            onClick={openPromoModal}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/15 px-5 py-3 text-xs font-bold uppercase tracking-wider text-blue-300 backdrop-blur-md transition-all hover:bg-blue-500/25 md:flex-none"
          >
            <span className="material-symbols-outlined text-lg">campaign</span>
            Promoções
          </button>
          <button
            onClick={() => setShowHolidayModal(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-yellow-500/30 bg-yellow-500/15 px-5 py-3 text-xs font-bold uppercase tracking-wider text-yellow-300 backdrop-blur-md transition-all hover:bg-yellow-500/25 md:flex-none"
          >
            <span className="material-symbols-outlined text-lg">event</span>
            Feriados
          </button>
          <button
            onClick={() => setLiveState((prev) => ({ ...prev, modoFesta: !prev.modoFesta }))}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all md:w-auto ${
              liveState.modoFesta
                ? 'border-purple-400 bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.35)]'
                : 'border-white/10 bg-white/5 text-white/45 hover:bg-white/10 hover:text-white'
            }`}
          >
            <PartyPopper size={18} />
            {liveState.modoFesta ? 'Festa ON' : 'Festa OFF'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8 md:gap-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur-2xl md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent opacity-70" />
            <div className="relative z-10 mb-4 flex items-start justify-between">
              <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/45">
                <span className={`h-2.5 w-2.5 rounded-full ${Number(data.state.valorRealApi) > 0 ? 'animate-pulse bg-green-500' : 'bg-red-500'}`} />
                Preço Atual
              </h2>
              {data.state.isPadrao ? (
                <span className="flex items-center gap-1.5 rounded-xl border border-green-500/30 bg-green-500/15 px-3 py-1.5 text-[10px] font-black uppercase text-green-300 md:text-xs">
                  <CheckCircle size={14} /> Padrão
                </span>
              ) : (
                <span className="flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/15 px-3 py-1.5 text-[10px] font-black uppercase text-orange-300 md:text-xs">
                  <AlertTriangle size={14} /> Exceção
                </span>
              )}
            </div>
            <div className="relative z-10 flex items-baseline gap-2 md:gap-3">
              <span className="text-2xl font-light text-white/30 md:text-3xl">R$</span>
              <span className="text-5xl font-black tracking-tighter text-white md:text-6xl">
                {data.state.valorRealApi?.toFixed(2) || '0.00'}
              </span>
            </div>
            <p className="relative z-10 mt-3 text-xs text-white/30 md:text-sm">
              {data.state.tipoDia?.replace('_', ' ') || 'semana'} • {data.state.periodoAtual || 'período'}
            </p>
            <History className="absolute -bottom-4 -right-4 h-32 w-32 text-white/5 md:h-40 md:w-40" />
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-orange-500/25 bg-black/30 p-6 shadow-2xl backdrop-blur-2xl md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-orange-500/10 via-white/5 to-transparent opacity-80" />
            <h2 className="relative z-10 mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-300">
              <Clock size={16} />
              Próximo Valor
            </h2>
            <div className="relative z-10 flex items-center gap-3">
              <span className="text-2xl font-light text-orange-500/50 md:text-3xl">R$</span>
              <input
                type="number"
                step="0.01"
                value={manualFuture}
                onChange={(event) => setManualFuture(event.target.value)}
                placeholder={data.state.valorPadraoFuturo || '???'}
                className="w-full max-w-40 border-b-2 border-orange-500/30 bg-transparent text-5xl font-black tracking-tighter text-white outline-none placeholder:text-white/10 focus:border-orange-400 md:max-w-56 md:text-6xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <p className="relative z-10 mt-3 text-xs text-white/30 md:text-sm">
              {data.state.valorPadraoFuturo
                ? `Sugestão automática: R$ ${data.state.valorPadraoFuturo.toFixed(2)}`
                : 'Sem sugestão automática.'}
            </p>
            <Clock className="absolute -bottom-4 -right-4 h-32 w-32 text-orange-500/10 md:h-40 md:w-40" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {liveState.modoFesta ? (
            <PartyModeEditor key="party" liveState={liveState} setLiveState={setLiveState} uploadMedia={uploadMedia} />
          ) : (
            <motion.div key="normal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="flex flex-col gap-8 md:gap-10">
              <SectionCard title="Identidade Visual e Avisos" icon={<Film size={22} className="text-pink-300" />} open={isIdentidadeOpen} onToggle={() => setIsIdentidadeOpen((p) => !p)}>
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-3 xl:gap-12">
                  <div className="xl:col-span-2">
                    <CategoryMediaEditor categoriesMedia={data.media} updateCategoryMedia={updateCategoryMedia} uploadMedia={uploadMedia} />
                  </div>
                  <div className="border-t border-white/10 pt-8 xl:col-span-1 xl:border-l xl:border-t-0 xl:pl-12 xl:pt-0">
                    <AvisosEditor liveState={liveState} setLiveState={setLiveState} compact />
                  </div>
                </div>
              </SectionCard>
              <DefaultsEditor defaults={data.defaults} updateDefault={updateDefault} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex shrink-0 items-center justify-end border-t border-slate-700/30 pt-8 md:mt-10">
          <button
            onClick={handleSaveState}
            disabled={saveState.isPending}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-500 px-10 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95 disabled:opacity-60 sm:w-auto"
          >
            {saveState.isPending ? (
              <>
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={20} />
                Salvar e Atualizar TV
              </>
            )}
          </button>
        </div>
      </div>

      {showHolidayModal && (
        <HolidayModal
          holidays={data.holidays || []}
          newName={newHolidayName}
          newDate={newHolidayDate}
          setNewName={setNewHolidayName}
          setNewDate={setNewHolidayDate}
          onSave={() => {
            if (!newHolidayName || !newHolidayDate) return toast.warning('Preencha nome e data.');
            addHoliday.mutate({ unidade: currentUnit, nome: newHolidayName, dataFeriado: newHolidayDate });
          }}
          onDelete={(id) => deleteHoliday.mutate(id)}
          onClose={() => setShowHolidayModal(false)}
        />
      )}

      {showPromoModal && (
        <PromoModal
          promotions={promotions}
          onUpload={handlePromoUpload}
          onToggleDay={(idx, day) => {
            setPromotions((prev) => {
              const list = [...prev];
              const promo = { ...list[idx] };
              const days = promo.diasAtivos || [];
              promo.diasAtivos = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
              list[idx] = promo;
              return list;
            });
          }}
          onRemove={(idx) => setPromotions((prev) => prev.filter((_, i) => i !== idx))}
          onSave={() => savePromotions.mutate({ unidade: currentUnit, promotions })}
          onClose={() => setShowPromoModal(false)}
        />
      )}
    </motion.div>
  );
}