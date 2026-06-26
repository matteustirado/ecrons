import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { usePricesQuery } from '../hooks/usePricesQuery';
import DisplayShell from '../components/views/prices/DisplayShell';
import PriceColumns from '../components/views/prices/PriceColumns';
import GlobalLoader from '../components/ui/GlobalLoader';
import useKeepAlive from '../hooks/useKeepAlive';

const periodData = {
  manha: { key: 'manha', title: 'MANHÃ/TARDE', time: '06H ÀS 13H59' },
  tarde: { key: 'tarde', title: 'TARDE/NOITE', time: '14H ÀS 19H59' },
  noite: { key: 'noite', title: 'NOITE/MADRUGADA', time: '20H ÀS 05H59' }
};

const getSpTime = () => {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * -3)); 
};

const getMediaUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL.replace('/api', '')}${url}`;
};

function PromoRotator({ activePromos }) {
  const pickRandom = useCallback(() => activePromos[Math.floor(Math.random() * activePromos.length)], [activePromos]);

  const [promos, setPromos] = useState(() => [
    pickRandom(),
    activePromos.length > 1 ? pickRandom() : pickRandom()
  ]);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (!activePromos || activePromos.length === 0) return;

    const interval = setInterval(() => {
      setPromos([
        pickRandom(),
        activePromos.length > 1 ? pickRandom() : pickRandom()
      ]);
      setAnimKey((k) => k + 1);
    }, 15000);

    return () => clearInterval(interval);
  }, [activePromos, pickRandom]);

  return (
    <>
      <AnimatePresence mode="wait">
        {promos[0] && (
          <motion.div
            key={`p1-${animKey}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="h-full aspect-4/3 overflow-hidden rounded-3xl border border-blue-500/20 bg-black/40 p-1.5 shadow-[0_0_35px_rgba(59,130,246,0.15)] backdrop-blur-md"
          >
            <img src={getMediaUrl(promos[0].imageUrl)} className="h-full w-full rounded-2xl object-cover" alt="Promoção" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {promos[1] && (
          <motion.div
            key={`p2-${animKey}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.1 }}
            className="h-full aspect-4/3 overflow-hidden rounded-3xl border border-blue-500/20 bg-black/40 p-1.5 shadow-[0_0_35px_rgba(59,130,246,0.15)] backdrop-blur-md"
          >
            <img src={getMediaUrl(promos[1].imageUrl)} className="h-full w-full rounded-2xl object-cover" alt="Promoção" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function PricesDisplay() {
  useKeepAlive();

  const { unidade } = useParams();
  const { user, logout } = useAuthStore();
  
  const currentUnit = unidade 
    ? unidade.toUpperCase() 
    : (user?.unidade ? user.unidade.toUpperCase() : 'SP');
  
  const { data, isLoading, isError } = usePricesQuery(currentUnit);
  const [exitClicks, setExitClicks] = useState(0);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
    };
  }, []);

  useEffect(() => {
    let timeout;
    if (exitClicks > 0 && exitClicks < 5) {
      timeout = setTimeout(() => setExitClicks(0), 3000);
    } else if (exitClicks >= 5) {
      if (user) {
        logout();
      }
      window.location.href = '/';
    }
    return () => clearTimeout(timeout);
  }, [exitClicks, logout, user]);

  const getOrderedPeriods = useCallback((activePeriod, currentTipoDia) => {
    const spTime = getSpTime();
    
    const getTipoDiaForOffset = (offsetDays) => {
      const targetDate = new Date(spTime.getTime() + offsetDays * 24 * 60 * 60 * 1000);
      const targetDay = targetDate.getDay();
      return (targetDay === 0 || targetDay === 6) ? 'fim_de_semana' : 'semana';
    };

    if (activePeriod === 'manha') {
      return [
        { ...periodData.noite, type: 'past', tipoDia: getTipoDiaForOffset(-1) },
        { ...periodData.manha, type: 'current', tipoDia: currentTipoDia },
        { ...periodData.tarde, type: 'future', tipoDia: currentTipoDia }
      ];
    }
    if (activePeriod === 'tarde') {
      return [
        { ...periodData.manha, type: 'past', tipoDia: currentTipoDia },
        { ...periodData.tarde, type: 'current', tipoDia: currentTipoDia },
        { ...periodData.noite, type: 'future', tipoDia: currentTipoDia }
      ];
    }
    return [
      { ...periodData.tarde, type: 'past', tipoDia: currentTipoDia },
      { ...periodData.noite, type: 'current', tipoDia: currentTipoDia },
      { ...periodData.manha, type: 'future', tipoDia: getTipoDiaForOffset(1) }
    ];
  }, []);

  const handleHiddenClick = () => {
    setExitClicks((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <DisplayShell onHiddenClick={handleHiddenClick}>
        <div className="fixed inset-0 z-10 flex h-dvh w-full items-center justify-center bg-[#050505]">
          <GlobalLoader />
        </div>
      </DisplayShell>
    );
  }

  if (isError || !data || !data.state) {
    return (
      <DisplayShell onHiddenClick={handleHiddenClick}>
        <div className="fixed inset-0 z-10 flex h-dvh w-full items-center justify-center bg-[#050505]">
          <p className="text-xl font-black uppercase tracking-[0.25em] text-white/60">
            Aguardando configuração de preços
          </p>
        </div>
      </DisplayShell>
    );
  }

  const { state, defaults, media } = data;
  const activePeriod = state.periodoAtual || 'manha';
  const orderedColumns = getOrderedPeriods(activePeriod, state.tipoDia || 'semana');

  const currentDay = new Date().getDay().toString();
  const activePromos = (data.promos || []).filter((p) => {
    try {
      const dias = typeof p.diasAtivos === 'string' ? JSON.parse(p.diasAtivos) : p.diasAtivos;
      return dias.includes(currentDay);
    } catch {
      return false;
    }
  });

  return (
    <DisplayShell onHiddenClick={handleHiddenClick}>
      <div className="fixed inset-0 h-dvh w-full overflow-hidden bg-[#050505] select-none">
        <div className="pointer-events-none absolute -left-32 -top-32 h-120 w-120 rounded-full bg-orange-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 top-1/4 h-120 w-120 rounded-full bg-amber-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-120 w-120 -translate-x-1/2 rounded-full bg-purple-600/15 blur-[120px]" />

        <section className="relative z-10 flex h-full w-full flex-col items-center px-4 py-6 md:px-8 lg:px-10 lg:py-[4vh]">
          <div className="flex h-full w-full max-w-7xl flex-col">
            <div className="w-full shrink-0">
              <PriceColumns
                orderedColumns={orderedColumns}
                liveState={state}
                defaults={defaults}
                categoryMedia={media}
                partyMode={state.modoFesta}
              />
            </div>

            <div className="relative z-10 mt-6 shrink-0 text-center font-extrabold uppercase tracking-wide text-white/70">
              {state.aviso1 && <p className="text-xs md:text-sm lg:text-base">* {state.aviso1}</p>}
              {state.aviso2 && <p className="text-xs md:text-sm lg:text-base">* {state.aviso2}</p>}
              {state.aviso3 && <p className="text-xs md:text-sm lg:text-base">** {state.aviso3}</p>}
              {state.aviso4 && <p className="text-xs md:text-sm lg:text-base">** {state.aviso4}</p>}
              {state.textoFuturo && state.textoFuturo !== '???' && (
                <p className="mt-3 text-lg font-black uppercase text-yellow-400 md:text-xl">
                  {state.textoFuturo}
                </p>
              )}
            </div>

            {state.modoFesta ? (
              <div className="mt-6 flex w-full min-h-0 flex-1 shrink-0 justify-center pb-2">
                {state.partyBanners && state.partyBanners.length > 0 && (
                  <div className="h-full aspect-4/3 overflow-hidden rounded-3xl border border-purple-500/30 bg-black/40 p-1.5 shadow-[0_0_40px_rgba(147,51,234,0.25)] backdrop-blur-md">
                    <img
                      src={getMediaUrl(state.partyBanners[0])}
                      className="h-full w-full rounded-2xl object-cover"
                      alt="Poster Evento"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-8 flex w-full min-h-0 flex-1 justify-center gap-8 pb-4 xl:gap-16">
                {activePromos.length > 0 && (
                  <PromoRotator key={JSON.stringify(activePromos.map(p => p.imageUrl))} activePromos={activePromos} />
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </DisplayShell>
  );
}