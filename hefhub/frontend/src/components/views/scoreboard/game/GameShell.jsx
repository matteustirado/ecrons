import { AnimatePresence } from 'framer-motion';

export default function GameShell({ children, onHiddenClick, unlockGame }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#050505] p-6 font-sans text-white selection:bg-none md:p-8">
      <div 
        onClick={onHiddenClick} 
        className="fixed right-0 top-0 z-999 h-24 w-24 cursor-pointer" 
        title="Área de Logout (5 Cliques)" 
      />

      {/* TODO: [TECH DEBT] - Fallback manual - Remover após integração do Webhook. */}
      <div 
        onClick={unlockGame}
        className="fixed left-0 top-0 z-999 h-24 w-24 cursor-pointer"
        title="Área de Liberação Manual"
      />
      {/* TODO: [TECH DEBT] - Fallback manual - Remover após integração do Webhook. */}

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-20%] top-[-20%] h-200 w-200 animate-float-slow rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] h-150 w-150 animate-float-reverse rounded-full bg-yellow-500/5 blur-[100px]" />
      </div>

      <main 
        className="relative z-10 flex h-[85vh] w-full max-w-150 flex-col rounded-[2.5rem] border-[3px] border-transparent bg-black/60 bg-clip-padding shadow-2xl backdrop-blur-md" 
        style={{ borderImage: 'linear-gradient(135deg, #ff4d00, #ffcc00) 1', borderRadius: '2.5rem' }}
      >
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>

      <div className="mt-6 text-center text-[10px] font-medium uppercase tracking-widest text-white/20">
        <p>© Developed by: <span className="font-bold text-orange-500">Matteus Tirado</span></p>
      </div>
    </div>
  );
}