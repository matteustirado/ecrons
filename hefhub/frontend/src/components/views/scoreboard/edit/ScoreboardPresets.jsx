import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useScoreboardPresetsQuery, useScoreboardAdminMutations } from '../../../../hooks/useScoreboardAdmin';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4020';

const SkeletonCard = () => (
  <div className="relative flex min-h-55 flex-col gap-4 overflow-hidden rounded-3xl border border-white/5 bg-black/20 p-6 shadow-xl backdrop-blur-md">
    <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
    <div className="relative z-10 flex items-start justify-between gap-4">
      <div className="flex w-full flex-col gap-2">
        <div className="h-6 w-3/4 animate-pulse rounded-lg bg-white/10" />
        <div className="h-3 w-1/2 animate-pulse rounded-md bg-white/5" />
      </div>
      <div className="h-8 w-20 shrink-0 animate-pulse rounded-lg bg-white/10" />
    </div>
    <div className="relative z-10 mt-2 flex flex-col gap-3 rounded-2xl border border-white/5 bg-black/20 p-4">
      <div className="h-3 w-1/4 animate-pulse rounded-md bg-white/5" />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-white/10" />
        ))}
      </div>
    </div>
  </div>
);

export default function ScoreboardPresets({ currentUnit, onClose }) {
  const { data: presets = [], isLoading } = useScoreboardPresetsQuery(currentUnit);
  const { saveActive, deletePreset } = useScoreboardAdminMutations(currentUnit);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDanger: false,
  });

  const openConfirm = (title, message, action, isDanger = false) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        await action();
      },
      isDanger,
    });
  };

  const handleApplyPreset = (preset) => {
    saveActive.mutate(
      {
        titulo: preset.titulo_placar,
        layout: preset.layout,
        opcoes: preset.opcoes,
      },
      {
        onSuccess: () => {
          toast.success('Predefinição aplicada com sucesso!');
          onClose(); // Fecha o overlay e volta para o Edit
        },
        onError: () => toast.error('Erro ao aplicar predefinição.'),
      }
    );
  };

  const handleDeletePreset = (id) => {
    deletePreset.mutate(id, {
      onSuccess: () => toast.success('Predefinição excluída.'),
      onError: () => toast.error('Erro ao excluir predefinição.'),
    });
  };

  const renderMiniature = (opt, index) => {
    const isEmoji = opt.display_tipo === 'emoji';
    const hasValue = opt.display_valor && opt.display_valor !== '';

    return (
      <div
        key={index}
        className="group relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 shadow-inner"
        style={{ backgroundColor: opt.cor || '#333' }}
        title={opt.nome}
      >
        {isEmoji ? (
          <span className="text-xl drop-shadow-md filter">{hasValue ? opt.display_valor : '❓'}</span>
        ) : hasValue ? (
          <img src={`${API_URL}${opt.display_valor}`} className="h-full w-full object-cover" alt="Preview" />
        ) : (
          <span className="material-symbols-outlined text-lg text-white/30">image</span>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-50 flex flex-col bg-black/95 px-4 pb-4 pt-6 backdrop-blur-3xl"
    >
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
        <div className="mb-6 flex shrink-0 items-center justify-between">
          <h2 className="text-xl font-black tracking-tight text-white md:text-3xl">Modelos Salvos</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-white">close</span>
          </button>
        </div>

        <div className="custom-scrollbar relative z-10 mb-6 flex-1 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((key) => (
                <SkeletonCard key={key} />
              ))}
            </div>
          ) : presets.length === 0 ? (
            <div className="relative flex h-[50vh] flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-2xl backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/5 to-transparent" />
              <span className="material-symbols-outlined mb-4 text-6xl text-white/10">dashboard_customize</span>
              <h2 className="text-lg font-black uppercase tracking-widest text-white drop-shadow-md">Nenhuma Predefinição</h2>
              <p className="mt-2 text-sm font-medium text-white/40">Salve novos modelos na tela principal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence>
                {presets.map((preset) => (
                  <motion.div
                    key={preset.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-6 shadow-xl backdrop-blur-2xl transition-all hover:border-orange-500/30 hover:bg-black/40"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="flex min-w-0 flex-col">
                        <h3 className="truncate text-lg font-black text-white drop-shadow-md" title={preset.titulo_preset}>
                          {preset.titulo_preset}
                        </h3>
                        <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-widest text-orange-400" title={preset.titulo_placar}>
                          {preset.titulo_placar || 'Sem título principal'}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center justify-center rounded-lg border border-white/5 bg-black/40 px-3 py-1.5">
                        <span className="material-symbols-outlined mr-1 text-sm text-white/50">
                          {preset.layout === 'landscape' ? 'view_column' : 'view_stream'}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">
                          {preset.layout === 'landscape' ? 'Paisagem' : 'Retrato'}
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10 flex flex-col gap-3 rounded-2xl border border-white/5 bg-black/40 p-4">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                        Opções ({preset.opcoes?.length || 0})
                      </span>
                      <div className="custom-scrollbar flex gap-2 overflow-x-auto pb-2">
                        {preset.opcoes && preset.opcoes.map((opt, i) => renderMiniature(opt, i))}
                      </div>
                    </div>

                    <div className="relative z-10 mt-auto flex gap-3 pt-2">
                      <button
                        onClick={() =>
                          openConfirm(
                            'Excluir Predefinição?',
                            `Tem certeza que deseja excluir "${preset.titulo_preset}"? Esta ação não pode ser desfeita.`,
                            () => handleDeletePreset(preset.id),
                            true
                          )
                        }
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 transition-colors hover:bg-rose-500/20"
                        title="Excluir"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>

                      <button
                        onClick={() =>
                          openConfirm(
                            'Aplicar Placar?',
                            `Deseja substituir o placar ativo pelo modelo "${preset.titulo_preset}"?`,
                            () => handleApplyPreset(preset)
                          )
                        }
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95 md:text-xs"
                      >
                        <span className="material-symbols-outlined text-lg">rocket_launch</span>
                        ATIVAR MODELO
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {confirmModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-110 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-black/40 p-8 text-center shadow-[0_16px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
            >
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/5 to-transparent" />
              <div className="relative">
                <div
                  className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border shadow-2xl ${
                    confirmModal.isDanger
                      ? 'border-rose-500/20 bg-rose-500/10 text-rose-400'
                      : 'border-orange-500/20 bg-orange-500/10 text-orange-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-4xl">
                    {confirmModal.isDanger ? 'warning' : 'help_outline'}
                  </span>
                </div>
                <h2 className="mb-3 text-xl font-black uppercase tracking-widest text-white drop-shadow-md">
                  {confirmModal.title}
                </h2>
                <p className="mb-8 text-sm font-medium leading-relaxed text-white/60">{confirmModal.message}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                    className="flex-1 rounded-2xl border border-transparent px-5 py-4 text-xs font-bold uppercase tracking-widest text-white/50 transition-all hover:border-white/10 hover:bg-white/10 hover:text-white"
                  >
                    CANCELAR
                  </button>
                  <button
                    onClick={confirmModal.onConfirm}
                    className={`flex-1 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 ${
                      confirmModal.isDanger
                        ? 'bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:bg-rose-500 hover:shadow-[0_0_30px_rgba(225,29,72,0.5)]'
                        : 'bg-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:bg-orange-500 hover:shadow-[0_0_30px_rgba(234,88,12,0.5)]'
                    }`}
                  >
                    CONFIRMAR
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}