import { motion } from 'framer-motion';

export default function DisplayShell({ children, isConnected, isLandscape, titulo }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050505] p-4 font-sans text-white selection:bg-none md:p-8">
      {!isConnected && (
        <div className="absolute left-1/2 top-4 z-50 flex -translate-x-1/2 animate-pulse items-center gap-3 rounded-full border border-red-500/50 bg-red-600/20 px-6 py-2 text-sm font-bold tracking-widest text-red-100 shadow-2xl backdrop-blur-xl">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          CONEXÃO PERDIDA. TENTANDO RECONECTAR...
        </div>
      )}

      <div className="pointer-events-none fixed inset-0 z-0 opacity-40">
        <div className="absolute left-[-20%] top-[-20%] h-[80%] w-[80%] animate-pulse rounded-full bg-orange-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] h-[80%] w-[80%] animate-pulse rounded-full bg-red-900/20 blur-[100px]" />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[60%] max-w-125 -translate-x-1/2 -translate-y-1/2 opacity-10">
        <svg viewBox="0 0 600 485" className="h-full w-full drop-shadow-[0_0_30px_#ff0000]">
          <g fill="none" stroke="#ff0000" strokeWidth="5">
            <path d="M276 41.3c-12.4 19.9-79.5 127.5-149.2 239.1C57 392 0 483.7 0 484.2s8.4.7 18.7.6l18.6-.3L168.2 275C240.1 159.8 299.5 65.5 300 65.5c.6 0 59.9 94.3 131.9 209.5l130.8 209.5 18.8.3c15.1.2 18.6 0 18.3-1.1-.2-.7-67.3-108.7-149.3-240C359.6 98.2 300.9 5.1 300 5.1c-.9 0-10.6 14.7-24 36.2z" />
            <path d="M175.2 284.4C107.5 393 51.7 482.6 51.4 483.4c-.6 1.5 22.5 1.6 248.5 1.6 137 0 249.1-.2 249.1-.5 0-1.1-6.1-11.4-7.4-12.4-.8-.7-10.1-1.2-25.1-1.3l-23.8-.3-13.2-21c-7.2-11.6-50.1-80.3-95.4-152.8C324.5 201.4 301.3 165 300 165c-1.3 0-26.8 40-92.4 145.1-49.8 79.7-90.6 145.7-90.6 146.5 0 1.2 2 1.4 12.3 1.2l12.2-.3 78.7-126c43.3-69.3 79.1-126.1 79.6-126.3.7-.2 62 97.1 156 248l11.1 17.8H275l-.2-24.7-.3-24.8-12.2-.5-12.1-.5 23.1-37c12.8-20.4 24.1-38.5 25.3-40.3l2.1-3.3 23.8 38.3c13.1 21.1 24.5 39.4 25.4 40.7l1.5 2.3-7.1-.7c-10.6-1-11.3-.4-11.3 9.9 0 6.7.3 8.5 1.6 9 .9.3 11.7.6 24 .6H381v-2.4c0-1.4-15.8-27.7-39.3-65.3-29.7-47.6-39.7-62.8-41.2-62.8-1.4 0-11.4 15.2-41.2 63-21.6 34.6-39.3 64-39.3 65.2v2.3h37.9l.6 4.2c.3 2.4.5 9.2.3 15.3l-.3 11-41.3.3-41.3.2 2.3-3.8C189.3 448.8 299.6 273 300.1 273c.3 0 26.5 41.6 58.3 92.5l57.7 92.5h10c8.1 0 9.9-.3 9.9-1.5 0-.8-30.2-49.9-67.1-109.1-53.5-85.6-67.5-107.4-69-107.2-1.3.2-25.4 38-73.7 115.3l-71.9 115-32.1.3-32.1.2 39.8-63.7c22-35.1 69-110.4 104.5-167.3 35.6-56.9 65.1-103.5 65.6-103.5s46.1 72.2 101.2 160.5l100.3 160.5 14.9.3 14.8.3-.4-2.3C530.1 451.9 301.7 87 300 87c-.9 0-49.9 77.5-124.8 197.4z" />
          </g>
        </svg>
      </div>

      <motion.div 
        layout
        className={`relative z-10 flex w-full max-w-400 flex-col rounded-[2.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-500 md:p-8 ${isLandscape ? 'h-[95vh]' : 'h-auto min-h-[85vh]'}`} 
      >
        <h1 className={`shrink-0 select-none cursor-default text-center text-transparent bg-clip-text font-black italic tracking-wider uppercase drop-shadow-[0_0_20px_rgba(255,77,0,0.5)] bg-linear-to-r from-orange-500 to-yellow-400 ${isLandscape ? 'mb-4 text-3xl md:text-5xl' : 'mb-10 text-5xl md:text-7xl'}`}>
          {titulo}
        </h1>

        {children}

      </motion.div>
    </div>
  );
}