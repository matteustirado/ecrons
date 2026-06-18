export default function GlobalLoader() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px]" />
      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center shadow-2xl relative z-10">
        <div className="w-12 h-12 border-4 border-white/5 border-t-orange-500 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(249,115,22,0.3)]" />
        <span className="text-xs font-black text-white/50 tracking-[0.3em] uppercase animate-pulse">
          Carregando
        </span>
      </div>
    </div>
  );
}