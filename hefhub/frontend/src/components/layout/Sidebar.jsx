import { NavLink } from 'react-router-dom';
import { Edit, MonitorPlay, LogOut, User, X } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { user, logout, setUnidade } = useAuthStore();

  const handleLogout = () => {
    logout();
    // O ?logout=true é o gatilho que avisa o Ecrons para destruir a sessão dele também!
    window.location.href = 'https://auth.dedalosbar.com/login?logout=true';
  };

  const username = user?.username || 'usuario';
  const isSuper = user?.role?.toUpperCase().includes('SUPER');
  const roleName = isSuper ? 'Master Level' : 'Administrador';

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-700/30 bg-black/40 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-xl p-0.5 shadow-sm">
            <img src="/icon.png" alt="Hefhub System" className="h-full w-full object-contain drop-shadow-[0_0_8px_rgba(148,163,184,0.6)]" />
          </div>
          <h1 className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-slate-500">
            Hefhub System
          </h1>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 lg:hidden">
          <X size={20} />
        </button>
      </div>

      <nav className="custom-scrollbar flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {isSuper && (
          <div className="mb-6 rounded-xl border border-slate-700/30 bg-black/30 p-3 shadow-inner">
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">
              Unidade de Gestão
            </label>
            <div className="relative">
              <select
                value={user?.unidade || 'SP'}
                onChange={(e) => setUnidade(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-600/30 bg-slate-800/50 py-2 pl-3 pr-8 text-xs font-bold text-white outline-none transition focus:border-blue-500"
              >
                <option value="SP">São Paulo (SP)</option>
                <option value="RJ">Rio de Janeiro (RJ)</option>
                <option value="BH">Belo Horizonte (BH)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        )}

        <p className="mb-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Menu Principal</p>
        
        <NavLink 
          to="/prices-edit"
          className={({ isActive }) => `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${isActive ? 'bg-slate-800/50 border border-slate-600/30 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
        >
          <Edit size={18} /> Manutenção
        </NavLink>
        <NavLink 
          to="/prices-display"
          target="_blank"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <MonitorPlay size={18} /> Tela da TV
        </NavLink>
      </nav>

      <div className="border-t border-slate-700/30 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-black/30 p-3 border border-slate-700/30">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white">
            <User size={18} />
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-xs font-black text-white">{username}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">{roleName}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500/10 py-3 text-xs font-black uppercase tracking-widest text-rose-400 transition-colors hover:bg-rose-500/20"
        >
          <LogOut size={16} /> Encerrar Sessão
        </button>

        <div className="my-4 h-px w-full bg-slate-700/30" />

        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Developed by</p>
          <p className="text-xs text-slate-300 font-bold mt-0.5">Matteus Tirado</p>
        </div>
      </div>
    </aside>
  );
}