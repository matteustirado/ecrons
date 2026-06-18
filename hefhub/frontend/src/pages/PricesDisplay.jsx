import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { usePricesQuery } from '../hooks/usePricesQuery';
import DisplayShell from '../components/views/prices/DisplayShell';
import PriceColumns from '../components/views/prices/PriceColumns';
import GlobalLoader from '../components/ui/GlobalLoader';

const periodData = {
  manha: { key: 'manha', title: 'MANHÃ/TARDE', time: '06H ÀS 13H59' },
  tarde: { key: 'tarde', title: 'TARDE/NOITE', time: '14H ÀS 19H59' },
  noite: { key: 'noite', title: 'NOITE/MADRUGADA', time: '20H ÀS 05H59' }
};

export default function PricesDisplay() {
  const { user, logout } = useAuthStore();
  const currentUnit = user?.unidade ? user.unidade.toUpperCase() : 'SP';
  
  const { data, isLoading, isError } = usePricesQuery(currentUnit);
  const [exitClicks, setExitClicks] = useState(0);
  const [isTabletMode, setIsTabletMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let timeout;
    if (exitClicks > 0 && exitClicks < 5) {
      timeout = setTimeout(() => setExitClicks(0), 3000);
    } else if (exitClicks >= 5) {
      logout();
      window.location.href = '/';
    }
    return () => clearTimeout(timeout);
  }, [exitClicks, logout]);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTabletMode(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getOrderedPeriods = useCallback((activePeriod) => {
    if (activePeriod === 'manha') {
      return [
        { ...periodData.noite, type: 'past' },
        { ...periodData.manha, type: 'current' },
        { ...periodData.tarde, type: 'future' }
      ];
    }
    if (activePeriod === 'tarde') {
      return [
        { ...periodData.manha, type: 'past' },
        { ...periodData.tarde, type: 'current' },
        { ...periodData.noite, type: 'future' }
      ];
    }
    return [
      { ...periodData.tarde, type: 'past' },
      { ...periodData.noite, type: 'current' },
      { ...periodData.manha, type: 'future' }
    ];
  }, []);

  const handleHiddenClick = () => {
    setExitClicks((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <DisplayShell onHiddenClick={handleHiddenClick}>
        <div className="relative z-10 flex h-full items-center justify-center">
          <GlobalLoader />
        </div>
      </DisplayShell>
    );
  }

  if (isError || !data || !data.state) {
    return (
      <DisplayShell onHiddenClick={handleHiddenClick}>
        <div className="relative z-10 flex h-full items-center justify-center">
          <p className="text-xl font-black uppercase tracking-[0.25em] text-white/60">
            Aguardando configuração de preços
          </p>
        </div>
      </DisplayShell>
    );
  }

  const { state, defaults, media } = data;
  const activePeriod = state.periodo || 'manha';
  const orderedColumns = getOrderedPeriods(activePeriod);

  return (
    <DisplayShell onHiddenClick={handleHiddenClick}>
      <section className={`relative z-10 flex h-full w-full flex-col items-center ${isTabletMode || isMobile ? 'justify-start gap-4 px-4 py-4' : 'justify-start gap-6 px-10 py-[5vh]'}`}>
        <div className="w-full max-w-6xl shrink-0">
          <PriceColumns
            orderedColumns={orderedColumns}
            liveState={state}
            defaults={defaults}
            categoryMedia={media}
            isTabletMode={isTabletMode}
            isMobile={isMobile}
          />

          <div className={`relative z-10 text-center font-extrabold uppercase tracking-wide text-white/70 ${isTabletMode || isMobile ? 'mt-8' : 'mt-4'}`}>
            {state.aviso1 && <p className={`mb-2 ${isTabletMode || isMobile ? 'text-base md:text-lg' : 'text-sm'}`}>* {state.aviso1}</p>}
            {state.aviso2 && <p className={`mb-2 ${isTabletMode || isMobile ? 'text-base md:text-lg' : 'text-sm'}`}>* {state.aviso2}</p>}
            {state.aviso3 && <p className={`mb-2 ${isTabletMode || isMobile ? 'text-base md:text-lg' : 'text-sm'}`}>** {state.aviso3}</p>}
            {state.aviso4 && <p className={`mb-2 ${isTabletMode || isMobile ? 'text-base md:text-lg' : 'text-sm'}`}>** {state.aviso4}</p>}
            {state.textoFuturo && state.textoFuturo !== '???' && (
              <p className={`mt-4 font-black uppercase text-yellow-400 ${isTabletMode || isMobile ? 'text-2xl' : 'text-xl'}`}>
                {state.textoFuturo}
              </p>
            )}
          </div>
        </div>
      </section>
    </DisplayShell>
  );
}