import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScoreboardReportQuery } from '../../../../hooks/useScoreboardAdmin';

export default function ScoreboardReport({ currentUnit, activeConfig, onClose }) {
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [activeTurnoFilter, setActiveTurnoFilter] = useState('todos');

  const { data: reportData = [], isLoading: loadingReport } = useScoreboardReportQuery(currentUnit, reportMonth, reportYear);

  const scoreboardOptions = activeConfig?.opcoes || [];

  const formatPeriod = (entry, exit, status) => {
    const entryTime = new Date(entry).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (status === 'DENTRO') return `${entryTime} - DENTRO`;
    if (!exit || entry === exit) return `${entryTime} - N/A`;
    const exitTime = new Date(exit).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${entryTime} - ${exitTime}`;
  };

  const getTurno = (dateStr) => {
    const h = new Date(dateStr).getHours();
    if (h >= 6 && h < 14) return '1 (06h - 14h)';
    if (h >= 14 && h < 22) return '2 (14h - 22h)';
    return '3 (22h - 06h)';
  };

  const filteredReportData = useMemo(() => {
    return reportData.filter((row) => {
      if (activeTurnoFilter === 'todos') return true;
      const h = new Date(row.created_at).getHours();
      if (activeTurnoFilter === '1') return h >= 6 && h < 14;
      if (activeTurnoFilter === '2') return h >= 14 && h < 22;
      if (activeTurnoFilter === '3') return h >= 22 || h < 6;
      return true;
    });
  }, [reportData, activeTurnoFilter]);

  const realVotesList = useMemo(
    () => filteredReportData.filter((i) => i.cliente_id && !i.cliente_id.startsWith('TESTE-') && !i.expires_at),
    [filteredReportData]
  );
  const totalVotantes = useMemo(() => realVotesList.filter((i) => i.option_index !== null).length, [realVotesList]);
  const totalNaoVotantes = useMemo(() => realVotesList.filter((i) => i.option_index === null).length, [realVotesList]);
  const totalFakes = useMemo(() => filteredReportData.length - realVotesList.length, [filteredReportData, realVotesList]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-50 flex flex-col bg-black/95 px-4 pb-4 pt-6 backdrop-blur-3xl"
    >
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
        <div className="mb-6 flex shrink-0 items-center justify-between">
          <h2 className="text-xl font-black tracking-tight text-white md:text-3xl">Relatório de Votos</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-white">close</span>
          </button>
        </div>

        <div className="mb-6 flex shrink-0 flex-col items-start justify-between gap-4 rounded-3xl border border-white/10 bg-black/30 p-4 shadow-2xl md:p-6 xl:flex-row xl:items-center">
          <div className="flex w-full flex-wrap gap-2 md:flex-nowrap xl:w-auto">
            <select
              className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs font-bold text-white outline-none transition-all focus:border-orange-500 md:px-5"
              value={reportMonth}
              onChange={(e) => setReportMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1} className="bg-black text-white">
                  {new Date(0, i).toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}
                </option>
              ))}
            </select>
            <select
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs font-bold text-white outline-none transition-all focus:border-orange-500 md:px-5"
              value={reportYear}
              onChange={(e) => setReportYear(Number(e.target.value))}
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y} className="bg-black text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="custom-scrollbar flex w-full gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-1 xl:w-auto">
            {['todos', '1', '2', '3'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTurnoFilter(t)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold uppercase transition-colors md:px-5 xl:flex-none ${
                  activeTurnoFilter === t
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-white/40 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t === 'todos' ? 'Todos' : `Turno ${t}`}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 grid shrink-0 grid-cols-3 gap-3 md:gap-6">
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-900/20 p-4 shadow-inner md:p-6">
            <span className="mb-1 text-center text-[8px] font-black uppercase tracking-widest text-orange-400 md:mb-2 md:text-[10px]">
              Votaram
            </span>
            <span className="text-2xl font-black text-white drop-shadow-md md:text-4xl">{totalVotantes}</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner md:p-6">
            <span className="mb-1 text-center text-[8px] font-black uppercase tracking-widest text-white/40 md:mb-2 md:text-[10px]">
              Ignoraram
            </span>
            <span className="text-2xl font-black text-white drop-shadow-md md:text-4xl">{totalNaoVotantes}</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-900/10 p-4 shadow-inner md:p-6">
            <span className="mb-1 text-center text-[8px] font-black uppercase tracking-widest text-rose-400/50 md:mb-2 md:text-[10px]">
              Falsos
            </span>
            <span className="text-2xl font-black text-rose-400/80 drop-shadow-md md:text-4xl">{totalFakes}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/30">
          {loadingReport ? (
            <div className="flex h-full flex-col items-center justify-center py-20 text-white/30">
              <span className="material-symbols-outlined mb-4 animate-spin text-4xl text-orange-500">refresh</span>
              <p className="text-center text-xs font-bold uppercase tracking-widest">Processando Dados...</p>
            </div>
          ) : filteredReportData.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-20 text-white/30">
              <span className="material-symbols-outlined mb-4 text-4xl opacity-50">search_off</span>
              <p className="text-center text-xs font-bold uppercase tracking-widest">Nenhum dado encontrado.</p>
            </div>
          ) : (
            <div className="custom-scrollbar flex-1 overflow-y-auto p-2 md:p-0">
              <div className="hidden w-full md:block">
                <table className="w-full border-collapse whitespace-nowrap text-left text-xs">
                  <thead className="sticky top-0 z-10 bg-[#1a1a1a] shadow-md">
                    <tr>
                      <th className="border-b border-white/10 px-6 py-5 font-black uppercase tracking-widest text-white/40">Data</th>
                      <th className="border-b border-white/10 px-6 py-5 font-black uppercase tracking-widest text-white/40">Dia</th>
                      <th className="border-b border-white/10 px-6 py-5 font-black uppercase tracking-widest text-white/40">Cliente</th>
                      <th className="border-b border-white/10 px-6 py-5 font-black uppercase tracking-widest text-white/40">Voto</th>
                      <th className="border-b border-white/10 px-6 py-5 font-black uppercase tracking-widest text-white/40">Período</th>
                      <th className="border-b border-white/10 px-6 py-5 font-black uppercase tracking-widest text-white/40">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredReportData.map((row) => {
                      const isFake = !row.cliente_id || row.cliente_id.startsWith('TESTE-') || row.expires_at !== null;
                      const isNonVoter = row.option_index === null;
                      const dateObj = new Date(row.created_at);
                      const currentVoteConfig = scoreboardOptions[row.option_index];

                      return (
                        <tr key={row.id} className={`transition-colors hover:bg-white/5 ${isFake ? 'opacity-40' : ''}`}>
                          <td className="px-6 py-4 font-medium text-white/80">{dateObj.toLocaleString('pt-BR')}</td>
                          <td className="px-6 py-4 font-medium capitalize text-white/60">
                            {dateObj.toLocaleDateString('pt-BR', { weekday: 'short' })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              {isFake ? (
                                <span className="font-bold text-white/30">N/A</span>
                              ) : row.cliente_pulseira ? (
                                <span className="font-bold text-orange-400">{row.cliente_pulseira}</span>
                              ) : (
                                <span className="w-max rounded border border-white/10 bg-black/50 px-2 py-0.5 text-[10px] uppercase text-white/30">
                                  Arm. {row.cliente_id}
                                </span>
                              )}
                              {!isFake && <span className="text-[10px] text-white/40">{row.cliente_nome || 'Desconhecido'}</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {isFake ? (
                              <span className="text-white/30">N/A</span>
                            ) : isNonVoter ? (
                              <span className="rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-widest text-white/50">
                                SEM VOTO
                              </span>
                            ) : (
                              <span className="inline-block max-w-37.5 truncate rounded-lg border border-orange-500/20 bg-orange-900/30 px-3 py-1.5 text-[10px] font-bold tracking-widest text-orange-300">
                                {currentVoteConfig ? currentVoteConfig.nome || `Opção ${row.option_index + 1}` : `Opção ${row.option_index + 1}`}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-white/60">
                            {isFake ? 'N/A' : formatPeriod(row.created_at, row.updated_at, row.status)}
                            <div className="mt-0.5 text-[9px] text-white/30">{isFake ? '' : getTurno(row.created_at)}</div>
                          </td>
                          <td className="px-6 py-4">
                            {isFake ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-rose-400/70">
                                <span className="material-symbols-outlined text-[14px]">smart_toy</span> Teste
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-400/70">
                                <span className="material-symbols-outlined text-[14px]">person</span> Real
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-3 p-2 md:hidden">
                <AnimatePresence>
                  {filteredReportData.map((row) => {
                    const isFake = !row.cliente_id || row.cliente_id.startsWith('TESTE-') || row.expires_at !== null;
                    const isNonVoter = row.option_index === null;
                    const dateObj = new Date(row.created_at);
                    const currentVoteConfig = scoreboardOptions[row.option_index];

                    return (
                      <motion.div
                        key={row.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-md ${
                          isFake ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between border-b border-white/5 pb-2">
                          <div className="flex flex-col">
                            {isFake ? (
                              <span className="text-sm font-bold text-white/30">VOTO TESTE</span>
                            ) : row.cliente_pulseira ? (
                              <span className="text-sm font-black text-orange-400">#{row.cliente_pulseira}</span>
                            ) : (
                              <span className="font-mono text-[10px] uppercase text-white/30">ARM. {row.cliente_id}</span>
                            )}
                            {!isFake && (
                              <span className="max-w-45 truncate text-xs text-white/60">
                                {row.cliente_nome || 'Cliente Desconhecido'}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-end text-right">
                            <span className="font-mono text-[10px] text-white/80">{dateObj.toLocaleDateString('pt-BR')}</span>
                            <span className="font-mono text-[10px] text-white/50">
                              {dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Voto:</span>
                            {isFake ? (
                              <span className="text-xs font-bold text-white/30">N/A</span>
                            ) : isNonVoter ? (
                              <span className="rounded bg-white/10 px-2 py-1 text-[9px] font-bold tracking-widest text-white/50 md:rounded-lg">
                                IGNOROU
                              </span>
                            ) : (
                              <span className="max-w-30 truncate rounded-md border border-orange-500/20 bg-orange-900/30 px-2 py-1 text-[9px] font-bold tracking-widest text-orange-300">
                                {currentVoteConfig ? currentVoteConfig.nome || `OPÇÃO ${row.option_index + 1}` : `OPÇÃO ${row.option_index + 1}`}
                              </span>
                            )}
                          </div>
                          {isFake ? (
                            <span className="material-symbols-outlined text-base text-rose-400/50">smart_toy</span>
                          ) : (
                            <span className="material-symbols-outlined text-base text-emerald-400/50">person</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}