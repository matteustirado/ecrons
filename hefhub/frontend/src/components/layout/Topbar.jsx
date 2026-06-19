import { Menu } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function Topbar({ setIsSidebarOpen }) {
  const { user } = useAuthStore();
  const isSuper = user?.role?.toUpperCase().includes('SUPER');

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-700/30 bg-black/80 px-4 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsSidebarOpen(true)} className="text-slate-200 p-1">
          <Menu size={24} />
        </button>
        <h2 className="text-base font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-slate-500">
          Hefhub System
        </h2>
      </div>
      <div className="flex items-center">
        {!isSuper && (
          <div className="flex items-center gap-2 rounded-lg border border-slate-700/30 bg-black/30 px-3 py-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Unidade:</span>
            <span className="text-xs font-black text-white">{user?.unidade || 'N/A'}</span>
          </div>
        )}
      </div>
    </header>
  );
}