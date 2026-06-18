import { WifiOff } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';

export default function ConnectionGuardian() {
  const { isConnected } = useSocket();

  if (isConnected) return null;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#050505]/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-rose-500/30 bg-rose-600/20 p-4 shadow-[0_0_50px_rgba(225,29,72,0.4)] text-rose-500">
          <WifiOff size={40} className="animate-pulse" />
        </div>
        <div>
          <h2 className="mb-2 text-2xl font-black tracking-tight text-white md:text-3xl">
            Conexão Perdida
          </h2>
          <p className="flex h-10 items-center justify-center text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-rose-500">
            Aguardando sincronização com o servidor...
          </p>
        </div>
      </div>
    </div>
  );
}