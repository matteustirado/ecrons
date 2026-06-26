import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useScoreboardAdminQuery, useScoreboardAdminMutations } from '../hooks/useScoreboardAdmin';
import GlobalLoader from '../components/ui/GlobalLoader';
import OptionCard from '../components/views/scoreboard/edit/OptionCard';
import ScoreboardReport from '../components/views/scoreboard/edit/ScoreboardReport';
import ScoreboardPresets from '../components/views/scoreboard/edit/ScoreboardPresets';
import { COLOR_PALETTE } from '../constants/KeyboardEmojis';

export default function ScoreboardEdit() {
  const { user } = useAuthStore();
  const currentUnit = user?.unidade ? user.unidade.toUpperCase() : 'SP';
  const { data, isLoading } = useScoreboardAdminQuery(currentUnit);

  if (isLoading || !data) {
    return <GlobalLoader />;
  }

  return <ScoreboardEditContent currentUnit={currentUnit} data={data} />;
}

function ScoreboardEditContent({ currentUnit, data }) {
  const { saveActive, savePreset, uploadMedia } = useScoreboardAdminMutations(currentUnit);
  const [activeOverlay, setActiveOverlay] = useState(null);

  const defaultCapacity = useMemo(() => {
    if (currentUnit === 'RJ') return 426;
    if (currentUnit === 'BH') return 160;
    return 230;
  }, [currentUnit]);

  const [localConfig, setLocalConfig] = useState(() => {
    const draftKey = `hefhub_scoreboard_draft_${currentUnit}`;
    const savedDraft = localStorage.getItem(draftKey);

    const baseOptions = (data.opcoes || []).map((opt) => ({
      ...opt,
      game_tipo: opt.game_tipo || opt.tipo || 'emoji',
      game_valor: opt.game_valor || opt.valor || '❓',
      display_tipo: opt.display_tipo || opt.tipo || 'emoji',
      display_valor: opt.display_valor || opt.valor || '❓',
    }));

    if (savedDraft && (!data.titulo || data.titulo === '') && baseOptions.length === 0) {
      try {
        return JSON.parse(savedDraft);
      } catch {
        return { titulo: '', layout: 'landscape', capacidadeMax: data.capacidadeMax || defaultCapacity, opcoes: baseOptions };
      }
    }

    return { 
      titulo: data.titulo || '', 
      layout: data.layout || 'landscape', 
      capacidadeMax: data.capacidadeMax || defaultCapacity,
      opcoes: baseOptions 
    };
  });

  const [optionCount, setOptionCount] = useState(localConfig.opcoes?.length || 2);
  const [activeColorPickerIndex, setActiveColorPickerIndex] = useState(null);
  const [presetName, setPresetName] = useState('');

  const [recentEmojis, setRecentEmojis] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hefhub_recent_emojis')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const draftKey = `hefhub_scoreboard_draft_${currentUnit}`;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(localConfig));
      } catch (error) {
        console.error(error);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localConfig, currentUnit]);

  const handleOptionChange = useCallback((index, field, value) => {
    setLocalConfig((prev) => {
      const newOpcoes = [...prev.opcoes];
      newOpcoes[index] = { ...newOpcoes[index], [field]: value };

      if (field === 'game_tipo' && value === 'image' && !newOpcoes[index].game_valor?.includes('/')) {
        newOpcoes[index].game_valor = '';
      }
      if (field === 'display_tipo' && value === 'image' && !newOpcoes[index].display_valor?.includes('/')) {
        newOpcoes[index].display_valor = '';
      }

      return { ...prev, opcoes: newOpcoes };
    });
  }, []);

  const handleEmojiSelectGlobal = useCallback((index, context, emoji) => {
    handleOptionChange(index, `${context}_valor`, emoji);
    setRecentEmojis((prev) => {
      const newRecents = [emoji, ...prev.filter((e) => e !== emoji)].slice(0, 24);
      localStorage.setItem('hefhub_recent_emojis', JSON.stringify(newRecents));
      return newRecents;
    });
  }, [handleOptionChange]);

  const handleImageUpload = useCallback(async (index, context, file) => {
    if (!file) return;
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

    if (!allowedMimeTypes.includes(file.type)) {
      toast.error('Formato inválido. Use JPG, PNG, WEBP, GIF ou SVG.');
      return;
    }

    const toastId = toast.loading('Enviando...');
    uploadMedia.mutate(file, {
      onSuccess: (url) => {
        handleOptionChange(index, `${context}_valor`, url);
        toast.update(toastId, { render: 'Imagem anexada com sucesso!', type: 'success', isLoading: false, autoClose: 2000 });
      },
      onError: () => {
        toast.update(toastId, { render: 'Falha no upload.', type: 'error', isLoading: false, autoClose: 3000 });
      }
    });
  }, [handleOptionChange, uploadMedia]);

  const handleCountChange = (e) => {
    let count = parseInt(e.target.value, 10);
    if (isNaN(count)) return;
    if (count < 1) count = 1;
    if (count > 10) count = 10;

    setOptionCount(count);

    setLocalConfig((prev) => {
      const newOpcoes = [...prev.opcoes];
      while (newOpcoes.length < count) {
        const colorIndex = newOpcoes.length % COLOR_PALETTE.length;
        newOpcoes.push({
          nome: '',
          cor: COLOR_PALETTE[colorIndex],
          game_tipo: 'emoji',
          game_valor: '❓',
          display_tipo: 'emoji',
          display_valor: '❓',
        });
      }
      if (newOpcoes.length > count) newOpcoes.length = count;
      return { ...prev, opcoes: newOpcoes };
    });
  };

  const handleSavePreset = () => {
    if (!presetName) return toast.warning('Dê um nome para a predefinição.');
    savePreset.mutate({ 
      unidade: currentUnit, 
      titulo_preset: presetName, 
      titulo_placar: localConfig.titulo, 
      layout: localConfig.layout, 
      opcoes: localConfig.opcoes 
    }, {
      onSuccess: () => {
        toast.success('Predefinição salva com sucesso!');
        setPresetName('');
      },
      onError: () => toast.error('Erro ao salvar predefinição.')
    });
  };

  const handleSaveActive = () => {
    saveActive.mutate({ 
      ...localConfig, 
      unidade: currentUnit, 
      status: 'ATIVO' 
    }, {
      onSuccess: () => toast.success('Placar e Display atualizados em tempo real.'),
      onError: () => toast.error('Erro ao sincronizar placar.')
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto mt-6 flex w-full max-w-360 flex-col px-4 pb-16 md:mt-10 md:px-8 lg:pb-24"
      >
        <div className="pointer-events-none absolute -left-16 -top-12 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-20 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl" />
        
        <div className="mb-8 flex shrink-0 flex-col items-start justify-between gap-5 md:mb-12 md:flex-row md:items-end">
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">Manutenção de Placar</h1>
          <div className="flex gap-2 md:gap-3">
            <button
              onClick={() => setActiveOverlay('report')}
              className="flex h-10 w-10 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_6px_24px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/10 md:h-auto md:w-auto md:px-5 md:py-2.5"
            >
              <span className="material-symbols-outlined text-lg">assessment</span>
              <span className="hidden md:inline">Consultar Votos</span>
            </button>

            <button
              onClick={() => setActiveOverlay('presets')}
              className="flex h-10 w-10 items-center justify-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/20 text-xs font-bold uppercase tracking-wider text-orange-300 shadow-[0_6px_24px_rgba(249,115,22,0.25)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-orange-500/30 active:scale-95 md:h-auto md:w-auto md:px-5 md:py-2.5"
            >
              <span className="material-symbols-outlined text-lg">bookmarks</span>
              <span className="hidden md:inline">Predefinições</span>
            </button>
          </div>
        </div>

        <div className="relative mb-6 flex shrink-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-6 shadow-2xl backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-white/5 to-transparent opacity-70" />
          <div className="pointer-events-none absolute -top-8 right-8 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="relative flex flex-col items-end gap-4 md:flex-row">
            <div className="w-full flex-1">
              <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-white/40">Título do Placar</label>
              <input
                type="text"
                className="w-full rounded-2xl border border-white/15 bg-black/35 px-5 py-4 text-center font-medium text-white shadow-inner outline-none transition-all placeholder:text-white/30 focus:border-orange-400 focus:bg-black/60 focus:ring-2 focus:ring-orange-500/30 md:text-left"
                placeholder="Ex: Quem é o melhor DJ?"
                value={localConfig.titulo}
                onChange={(e) => setLocalConfig({ ...localConfig, titulo: e.target.value })}
              />
            </div>

            <div className="w-full md:w-auto">
              <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-white/40">Layout</label>
              <div className="flex items-center rounded-2xl border border-white/10 bg-black/40 p-1.5 shadow-inner">
                <button
                  onClick={() => setLocalConfig({ ...localConfig, layout: 'landscape' })}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-bold transition-all md:flex-none ${
                    localConfig.layout === 'landscape'
                      ? 'bg-linear-to-r from-orange-600 to-amber-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.45)]'
                      : 'text-white/40 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">view_column</span> PAISAGEM
                </button>

                <button
                  onClick={() => setLocalConfig({ ...localConfig, layout: 'portrait' })}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-bold transition-all md:flex-none ${
                    localConfig.layout === 'portrait'
                    ? 'bg-linear-to-r from-orange-600 to-amber-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.45)]'
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">view_stream</span> RETRATO
                </button>
              </div>
            </div>

            <div className="w-full md:w-36">
              <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-white/40">Capacidade Máx</label>
              <input
                type="number"
                className="w-full rounded-2xl border border-white/15 bg-black/35 px-5 py-4 text-center font-bold text-white shadow-inner outline-none transition-all focus:border-orange-400 focus:bg-black/60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder={defaultCapacity.toString()}
                value={localConfig.capacidadeMax || ''}
                onChange={(e) => setLocalConfig({ ...localConfig, capacidadeMax: e.target.value === '' ? '' : parseInt(e.target.value, 10) })}
              />
            </div>

            <div className="w-full md:w-24">
              <label className="mb-2 ml-1 block text-[10px] font-bold uppercase tracking-widest text-white/40">Opções</label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full rounded-2xl border border-white/15 bg-black/35 px-5 py-4 text-center text-lg font-black text-white shadow-inner outline-none transition-all focus:border-orange-400 focus:bg-black/60 focus:ring-2 focus:ring-orange-500/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={optionCount}
                onChange={handleCountChange}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <AnimatePresence>
              {localConfig.opcoes.map((opt, idx) => (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <OptionCard
                    index={idx}
                    opt={opt}
                    handleOptionChange={handleOptionChange}
                    handleImageUpload={handleImageUpload}
                    setActiveColorPickerIndex={setActiveColorPickerIndex}
                    activeColorPickerIndex={activeColorPickerIndex}
                    recentEmojis={recentEmojis}
                    onEmojiSelect={handleEmojiSelectGlobal}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 flex shrink-0 flex-col items-center justify-end gap-4 rounded-2xl border-t border-white/10 pt-8 sm:flex-row md:mt-10">
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row lg:w-auto">
            <div className="flex h-13 w-full items-center gap-2 rounded-xl border border-white/10 bg-black/30 p-1.5 shadow-lg backdrop-blur-md sm:w-auto">
              <input
                type="text"
                placeholder="Salvar como predefinição..."
                className="h-full w-full border-none bg-transparent px-3 text-xs font-medium text-white outline-none placeholder:text-white/30 sm:w-48"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
              />
              <button
                onClick={handleSavePreset}
                disabled={savePreset.isPending}
                className="flex h-full shrink-0 items-center justify-center rounded-lg bg-white/10 px-4 text-white transition-colors hover:bg-white/20"
                title="Salvar"
              >
                <span className="material-symbols-outlined text-base">save</span>
              </button>
            </div>

            <button
              onClick={handleSaveActive}
              disabled={saveActive.isPending}
              className="flex h-13 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 px-8 text-xs font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(249,115,22,0.45)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <span className="material-symbols-outlined text-lg">{saveActive.isPending ? 'sync' : 'rocket_launch'}</span>
            {saveActive.isPending ? 'SALVANDO...' : 'ATIVAR PLACAR'}
          </button>
        </div>
      </div>
    </motion.div>

    <AnimatePresence>
      {activeOverlay === 'report' && (
        <ScoreboardReport 
          currentUnit={currentUnit} 
          activeConfig={localConfig} 
          onClose={() => setActiveOverlay(null)} 
        />
      )}
      {activeOverlay === 'presets' && (
        <ScoreboardPresets 
          currentUnit={currentUnit} 
          onClose={() => setActiveOverlay(null)} 
        />
      )}
    </AnimatePresence>
  </>
);
}