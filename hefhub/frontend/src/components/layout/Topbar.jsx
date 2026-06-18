import { Menu } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function Topbar({ setIsSidebarOpen }) {
  const { user } = useAuthStore();
  const isSuper = user?.role?.toUpperCase().includes('SUPER');

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-700/30 bg-black/40 px-6 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 lg:hidden">
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-bold text-white/80 hidden sm:block">Gestão de Preços</h2>
      </div>
      <div className="flex items-center gap-4">
        {!isSuper && (
          <div className="hidden items-center gap-2 rounded-xl border border-slate-700/30 bg-black/30 px-4 py-2 sm:flex">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Unidade:</span>
            <span className="text-sm font-black text-white">{user?.unidade || 'N/A'}</span>
          </div>
        )}
      </div>
    </header>
  );
}