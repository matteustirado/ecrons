const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4020';

export default function PortraitLayout({ options }) {
  return (
    <div className="flex w-full flex-1 flex-col justify-start gap-4 md:gap-6">
      {options.map((opt, idx) => {
        const displayTipo = opt.display_tipo || opt.tipo;
        const displayValor = opt.display_valor || opt.valor;
        const imageUrl = displayTipo === 'image' && displayValor ? (displayValor.startsWith('http') ? displayValor : `${API_URL}${displayValor}`) : null;

        return (
          <div key={idx} className="relative flex h-36 w-full flex-row items-center overflow-hidden rounded-2xl border border-white/20 bg-[#0a0a0a] shadow-2xl">
            {imageUrl && <img src={imageUrl} alt="" className="absolute inset-0 z-0 h-full w-full object-cover object-center opacity-40" />}
            
            <div 
              className="absolute left-0 top-0 z-10 h-full w-full transition-all duration-1000 ease-out"
              style={{ background: `linear-gradient(to right, ${opt.color}E6 0%, ${opt.color}80 ${Math.max(opt.percentage / 2, 5)}%, transparent ${Math.max(opt.percentage, 15)}%)` }} 
            />
            
            <div className="pointer-events-none relative z-20 flex h-full w-full flex-row items-center justify-between gap-4 px-6">
              <div className="flex w-20 shrink-0 items-center justify-center">
                {displayTipo === 'emoji' && (
                  <span className="text-[4rem] leading-none text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-110" style={{ fontFamily: '"Noto Emoji", sans-serif' }}>
                    {displayValor}
                  </span>
                )}
              </div>
              
              <span className="flex-1 truncate text-left text-2xl font-black uppercase leading-none tracking-wider text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] md:text-3xl">
                {opt.nome}
              </span>
              
              <span className="min-w-22.5 text-right text-4xl font-black tabular-nums tracking-tighter text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] md:text-5xl">
                {opt.percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}