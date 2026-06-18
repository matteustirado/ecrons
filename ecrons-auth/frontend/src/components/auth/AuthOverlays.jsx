import { ShieldAlert } from 'lucide-react';

export function WelcomeOverlay({ welcomeState, theme, isRedirect }) {
  if (!welcomeState.isActive) return null;

  return (
    <div className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-xl transition-all duration-500">
      <div className="flex flex-col items-center gap-6 text-center">
        {theme.welcomeIcon}
        <div>
          <h2 className="mb-3 text-3xl font-black tracking-tight text-white md:text-4xl">
            Acesso Concedido.
          </h2>
          {!welcomeState.showPhrases ? (
            <p className={`flex h-14 items-center justify-center text-[10px] md:text-xs font-black uppercase tracking-[0.2em] ${theme.textHighlight} animate-pulse`}>
              {isRedirect ? 'DIRECIONANDO PARA APLICAÇÃO...' : 'INICIANDO SESSÃO...'}
            </p>
          ) : (
            <div className="relative mx-auto mt-2 h-14 w-80 overflow-hidden">
              <p key={welcomeState.phraseIndex} className={`animate-slide-right absolute inset-0 flex items-center justify-center text-center text-[10px] md:text-xs font-black uppercase leading-relaxed tracking-[0.2em] ${theme.textHighlight}`}>
                {welcomeState.shuffledPhrases[welcomeState.phraseIndex]}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function RbacOverlay({ isBlocked, onReset }) {
  if (!isBlocked) return null;

  return (
    <div className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-xl transition-all duration-500">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-rose-500/30 bg-rose-600/20 p-4 shadow-[0_0_50px_rgba(225,29,72,0.4)] text-rose-500">
          <ShieldAlert size={48} />
        </div>
        <div>
          <h2 className="mb-3 text-3xl font-black tracking-tight text-white md:text-4xl">Acesso Negado.</h2>
          <p className="flex h-14 items-center justify-center text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-rose-500">
            PRIVILÉGIOS INSUFICIENTES PARA O COFRE
          </p>
          <button
            onClick={onReset}
            className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-rose-400 transition hover:bg-rose-500/20 active:scale-95"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}