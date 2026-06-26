import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4020';

export default function VotingView({ config, handleVote, cancelSession }) {
  const gridCols = config?.opcoes?.length <= 2 ? 'grid-cols-1' : 'grid-cols-2';

  const renderButtonBg = (opt) => {
    const tipo = opt.game_tipo || opt.tipo;
    const valor = opt.game_valor || opt.valor;
    
    if (tipo !== 'image' || !valor) return null;
    
    const imageUrl = valor.startsWith('http') ? valor : `${API_URL}${valor}`;
    
    return (
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        <img src={imageUrl} alt="" className="h-full w-full object-cover object-center opacity-60" />
      </div>
    );
  };

  return (
    <motion.div 
      key="voting" 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }} 
      className="flex h-full flex-1 flex-col"
    >
      <div className="shrink-0 px-8 pb-6 pt-10 text-center">
        <h1 className="bg-linear-to-r from-orange-500 to-yellow-400 bg-clip-text text-3xl font-black uppercase leading-tight text-transparent drop-shadow-md md:text-4xl">
          {config?.titulo || 'FAÇA SUA ESCOLHA!'}
        </h1>
        <p className="mt-3 text-sm font-bold uppercase tracking-wide text-gray-400">
          Escolha a sua vibe:
        </p>
      </div>
      
      <div className={`custom-scrollbar grid flex-1 content-center gap-6 overflow-y-auto px-8 pb-8 ${gridCols}`}>
        {config?.opcoes.map((opt, idx) => (
          <button 
            key={idx} 
            onClick={() => handleVote(idx, opt.nome)} 
            className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border border-white/5 bg-[#151515] p-4 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-orange-900/10 active:scale-95" 
            style={{ minHeight: 'auto', aspectRatio: config.opcoes.length <= 4 ? '4/3' : '3/2' }}
          >
            {renderButtonBg(opt)}
            
            <div className="relative z-10 transform transition-transform duration-300 group-hover:scale-110">
              {(opt.game_tipo || opt.tipo) === 'emoji' ? (
                <span className="text-6xl drop-shadow-lg filter-none md:text-7xl">
                  {opt.game_valor || opt.valor}
                </span>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/10">
                  <span className="material-symbols-outlined text-3xl">touch_app</span>
                </div>
              )}
            </div>
            
            <span className="relative z-10 block px-1 text-base font-bold leading-tight tracking-widest text-gray-200 drop-shadow-md group-hover:text-white md:text-lg">
              {opt.nome}
            </span>
          </button>
        ))}
      </div>
      
      <div className="shrink-0 pb-6 text-center">
        <button 
          onClick={cancelSession} 
          className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/20 transition-colors hover:text-white/50"
        >
          Cancelar
        </button>
      </div>
    </motion.div>
  );
}