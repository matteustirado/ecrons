import PriceCard from './PriceCard';

export default function PriceColumns({ orderedColumns, liveState, defaults, categoryMedia, isTabletMode, isMobile, partyMode = false }) {
  return (
    <div className={`flex w-full items-stretch justify-center ${isTabletMode || isMobile ? 'gap-3' : 'gap-5'}`}>
      {orderedColumns.map((colData, colIndex) => {
        const isColumnActive = colIndex === 1;
        if (isMobile && !isColumnActive) return null;

        return (
          <div key={colData.key} className={`flex min-w-0 flex-1 max-w-96 flex-col transition-all duration-500 ${isColumnActive ? 'scale-100 opacity-100 saturate-100' : 'scale-[0.92] opacity-55 saturate-50'}`}>
            <h3 className={`mb-3 rounded-2xl border border-white/10 bg-black/40 text-center font-black uppercase tracking-[0.12em] text-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-2xl ${isTabletMode || isMobile ? 'px-3 py-2 text-base' : 'px-4 py-3 text-sm'}`}>
              {colData.title}
              {!partyMode && (
                <span className="mt-1 block text-[0.72em] font-extrabold tracking-[0.08em] text-white/45">
                  {colData.time}
                </span>
              )}
            </h3>
            <div className={`flex flex-col ${isTabletMode || isMobile ? 'gap-4' : 'gap-5'}`}>
              {(partyMode ? [1] : [1, 2, 3]).map((qtdPessoas, index) => (
                <PriceCard
                  key={`${colData.key}-${qtdPessoas}`}
                  index={index}
                  qtdPessoas={qtdPessoas}
                  colData={colData}
                  liveState={liveState}
                  defaults={defaults}
                  mediaData={categoryMedia.find((item) => Number(item.qtdPessoas) === qtdPessoas)}
                  isActive={isColumnActive}
                  isTablet={isTabletMode || isMobile}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}