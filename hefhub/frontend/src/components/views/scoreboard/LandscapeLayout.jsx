const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4020';

export default function LandscapeLayout({ options }) {
  return (
    <div className="flex w-full flex-1 flex-row items-end justify-center gap-4 md:gap-8">
      {options.map((opt, idx) => {
        const displayTipo = opt.display_tipo || opt.tipo;
        const displayValor = opt.display_valor || opt.valor;
        const imageUrl = displayTipo === 'image' && displayValor ? (displayValor.startsWith('http') ? displayValor : `${API_URL}${displayValor}`) : null;

        return (
          <div key={idx} className="relative flex h-full w-full max-w-[320px] flex-1 flex-col justify-end overflow-hidden rounded-4xl border border-white/20 bg-[#0a0a0a] shadow-2xl">
            {imageUrl && <img src={imageUrl} alt="" className="absolute inset-0 z-0 h-full w-full object-cover object-center opacity-40" />}
            
            <div 
              className="absolute bottom-0 left-0 z-10 h-full w-full transition-all duration-1000 ease-out"
              style={{ background: `linear-gradient(to top, ${opt.color}E6 0%, ${opt.color}80 ${Math.max(opt.percentage / 2, 5)}%, transparent ${Math.max(opt.percentage, 15)}%)` }} 
            />
            
            <div className="pointer-events-none relative z-20 flex h-full w-full flex-col items-center justify-between py-6">
              <span className="mb-2 tabular-nums tracking-tighter text-5xl font-black text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] md:text-[4rem]">
                {opt.percentage.toFixed(0)}%
              </span>
              
              <div className="flex flex-1 items-center justify-center">
                {displayTipo === 'emoji' && (
                  <span className="text-[6rem] leading-none text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-110" style={{ fontFamily: '"Noto Emoji", sans-serif' }}>
                    {displayValor}
                  </span>
                )}
              </div>
              
              <span className="mb-2 w-full truncate px-2 text-center text-lg font-black uppercase leading-none tracking-wider text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] md:text-xl">
                {opt.nome}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}